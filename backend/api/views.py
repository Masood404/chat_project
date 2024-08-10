from django.shortcuts import HttpResponse
from django.urls import reverse
from django.db.models import Q
from rest_framework import generics

from .permissions import AllowAny, IsAuthenticated, ReadIsAuthenticated
from .serializers import UserSerializer, PublicUserSerializer
from .models import User

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
