from django.shortcuts import HttpResponse
from django.urls import reverse
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.views import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import ReadIsAuthenticated, IsAuthenticated
from .serializers import UserSerializer, PublicUserSerializer, CustomTokenObtainPairSerializer, ChatSerializer, ChatRequestSerializer
from .models import User, Chat, ChatRequest

# Create your views here.
def index(request):
    return HttpResponse(reverse('api:index'))

class UsersView(generics.ListCreateAPIView):
    permission_classes = [ReadIsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return UserSerializer

        return PublicUserSerializer
    
    def get_queryset(self):
        query = self.request.query_params.get('q', None)

        if query:
            return User.objects.filter(
                Q(username__icontains=query) | 
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            )

        return User.objects.all()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ChatsView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(users=self.request.user)
    
class ChatRequestsView(generics.ListCreateAPIView):
    serializer_class = ChatRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filters the queryset based on two things.
        The requested user's id and their inbox provided "sent" or "received".
        If sent is provided in the query parameters then loads the "sent" inbox,
        else loads for "received" inbox.
        """
        user_id = self.request.user.id

        if 'sent' in self.request.query_params:
            return ChatRequest.objects.filter(sender=user_id)
        
        return ChatRequest.objects.filter(receiver=user_id)
    
    def create(self, request, *args, **kwargs):
        """
        Uses the "ChatRequestCreateSerializer" to create multiple chat_requests at once.
        Then after all gives a response with a list of all the created chat_requests using the default
        serializer class "ChatRequestSerializer" with the many argument set to true so it provides a list.
        """
        serializer = ChatRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        created_requests = serializer.save()

        return Response(self.serializer_class(created_requests, many=True).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)