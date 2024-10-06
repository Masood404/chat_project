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
        user_id = self.request.user.id

        if 'sent' in self.request.query_params:
            chat_requests = ChatRequest.objects.filter(sender=user_id)
        else:
            chat_requests = ChatRequest.objects.filter(receiver=user_id)

        return chat_requests
    
    def post(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data['sender'] = request.user.id

        serializer = self.get_serializer(data=request_data)

        if serializer.is_valid():
            chat_requests = serializer.save()

            return Response(self.get_serializer_class()(chat_requests, many=True).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)