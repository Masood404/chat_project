from django.shortcuts import HttpResponse
from django.urls import reverse
from django.db.models import Q
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import ReadIsAuthenticated, IsAuthenticated
from .serializers import UserSerializer, PublicUserSerializer, CustomTokenObtainPairSerializer, ChatSerializer
from .models import User, Chat

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