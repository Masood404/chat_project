from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timedelta

from .models import User

class TokenObtainPairTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    
    def _get_refresh_token_expiry(self, remember_me: bool):
        """
        Get the refresh token expiry based on if remember_me is provided.
        """
        response = self.client.post('/api/token/', {'username': 'testuser', 'password': 'testpassword', 'remember_me': remember_me})
        self.assertEqual(response.status_code, 200)
        refresh = RefreshToken(response.json()['refresh'])
        return datetime.fromtimestamp(refresh.payload['exp'])

    def _test_refresh_expiry(self, remember_me: bool, expected_lifetime: timedelta, tolerance: timedelta = timedelta(hours=1)):
        """
        Helper method to test the refresh expiry
        """
        expected_exp = datetime.now() + expected_lifetime
        refresh_exp = self._get_refresh_token_expiry(remember_me)
        self.assertAlmostEqual(refresh_exp, expected_exp, delta=tolerance)

    def test_token_obtain_with_remember_me(self):
        """
        Test the obtention of token with remember passed in the request.
        """
        self._test_refresh_expiry(True, settings.SIMPLE_JWT['REMEMBER_ME_REFRESH_TOKEN_LIFETIME'])

    def test_token_obtain_without_remember_me(self):
        """
        Test the obtention of token without remember passed in the request.
        """
        self._test_refresh_expiry(False, settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'])

class ChatRequestTestCase(TestCase):
    def setup(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(username='testuser2', password='testpassword')