from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timedelta

from .models import User

class TokenObtainPairTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    
    def test_token_obtain_with_remember_me(self):
        response = self.client.post('/api/token/', {'username': 'testuser', 'password': 'testpassword', 'remember_me': True})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        refresh = RefreshToken(data['refresh'])
        access = data['access']
        access_exp = datetime.fromtimestamp(AccessToken(access).payload['exp'])
        refresh_exp = datetime.fromtimestamp(refresh.payload['exp'])

        # Check if the 'remember me' flag has extended the refresh token expiry
        self.assertGreater(refresh_exp, datetime.now() + timedelta(days=1))  # Adjust based on your settings

    def test_token_obtain_without_remember_me(self):
        response = self.client.post('/api/token/', {'username': 'testuser', 'password': 'testpassword', 'remember_me': False})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        refresh = RefreshToken(data['refresh'])
        access = data['access']
        access_exp = datetime.fromtimestamp(AccessToken(access).payload['exp'])
        refresh_exp = datetime.fromtimestamp(refresh.payload['exp'])

        # Check if the refresh token expiry is as per default settings
        self.assertLess(refresh_exp, datetime.now() + timedelta(days=30))  # Adjust based on your settings
