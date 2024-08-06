from django.shortcuts import render, HttpResponse
from django.urls import reverse
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .serializers import UserSerializer

# Create your views here.
def index(request):
    return HttpResponse(reverse('api:index'))

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]