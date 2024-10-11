from textwrap import dedent

from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework.reverse import reverse as api_reverse
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timedelta

from .models import User, ChatRequest, Chat

def long_message(msg): return dedent(msg).strip()

def authenticate_user(self, user: User|None=None):
    """
    Helper function for all TestCases to authenticate the user in test case's self.user and for the self.client of them.
    """
    refresh = RefreshToken.for_user(user if user else self.user)
    access_token = str(refresh.access_token)

    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

class TokenObtainPairTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
    
    def _get_refresh_token_expiry(self, remember_me: bool):
        """
        Get the refresh token expiry based on if remember_me is provided.
        """
        response = self.client.post(api_reverse('api:token_obtain_pair'), {'username': 'testuser', 'password': 'testpassword', 'remember_me': remember_me})
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

class ChatRequestTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(id=1, username='testuser', password='testpassword')
        self.user2 = User.objects.create_user(id=2, username='testuser2', password='testpassword')
        self.user3 = User.objects.create_user(id=3, username='testuser3', password='testpassword')

        # Create two dummy chats
        self.chats = [Chat(id=1, name='chat 1', admin=self.user), Chat(id=2, name='chat 2', admin=self.user2)]
        Chat.objects.bulk_create(self.chats)

        # Instantiate sent_chat_requests
        self.sent_chat_requests = [
            ChatRequest(id=1, chat=self.chats[0], sender=self.user, receiver=self.user2),
            ChatRequest(id=2, chat=self.chats[0], sender=self.user, receiver=self.user2),
        ]
        # Instantiate received_chat_requests
        self.received_chat_requests = [
            ChatRequest(id=3, chat=self.chats[0], sender=self.user2, receiver=self.user),
            ChatRequest(id=4, chat=self.chats[0], sender=self.user2, receiver=self.user)
        ]
        # Create all the dummy chat_requests
        ChatRequest.objects.bulk_create(self.sent_chat_requests + self.received_chat_requests)

    def _post(self, *args, **kwargs):
        return self.client.post(api_reverse('api:chat_requests'), *args, **kwargs)

    def _test_get_list(self, show_sent: bool):
        authenticate_user(self)

        response = self.client.get(api_reverse('api:chat_requests') + (
            '?sent' if show_sent else '' # Add the sent query parameter based on 'show_sent'
        ))
        self.assertEqual(response.status_code, 200)

        expected_results = [
            {
                'id': chat_request.id,
                'chat': chat_request.chat.id,
                'sender': chat_request.sender.id,
                'receiver': chat_request.receiver.id
            }
            for chat_request in (self.sent_chat_requests if show_sent else self.received_chat_requests)
        ]
        results = [
            {
                'id': chat_request['id'],
                'chat': chat_request['chat'],
                'sender': chat_request['sender'],
                'receiver': chat_request['receiver']
            }
            for chat_request in response.json()['results']
        ]

        def sort_key(x): return x['id']

        self.assertEqual(sorted(results, key=sort_key), sorted(expected_results, key=sort_key))

    def test_get_list_sent(self):
        self._test_get_list(True)

    def test_get_list_received(self):
        self._test_get_list(False)

    def test_create(self):
        authenticate_user(self)

        receivers = [
            2,
            3
        ]
        chat = 1
        
        response = self._post(data={
            'receivers': receivers,
            'chat': chat
        })

        self.assertEqual(response.status_code, 201)

        expected_results = [
            {
                'chat': chat,
                'sender': self.user.id,
                'receiver': receiver
            }
            for receiver in receivers
        ]
        results = [
            {
                'chat': created_request['chat'],
                'sender': created_request['sender'],
                'receiver': created_request['receiver']
            }
            for created_request in response.json()
        ]

        def sort_key(x): return x['receiver']

        self.assertEqual(sorted(results, key=sort_key), sorted(expected_results, key=sort_key))

    def test_unauthorized_create(self):
        """
        Test for unathorzation of when a user tries to send a request from a chat who they are not admin of.
        """
        authenticate_user(self)

        response = self._post(data={
            'receivers': [1, 3],
            'chat': 3
        })

        self.assertEqual(response.status_code, 400)
        
    def test_unauthenticated_access(self):
        """
        Test for unauthenticated access to list and create
        """
        list_response = self.client.get(api_reverse('api:chat_requests'))

        self.assertEqual(list_response.status_code, 401)

        create_response = self._post(data={
            'receivers': [2, 3],
            'chat': 1
        })

        self.assertEqual(create_response.status_code, 401)

    def test_same_sender_receiver_create(self):
        """
        Test if any receiver provided in the receivers list field is the same as the sender (authenticated user).
        If there exist then it should be ignored but if other receivers were provided and were valid, 
        then those should be created.
        """
        authenticate_user(self)

        response = self._post(data={
            'chat': 1,
            'receivers': [1, 2, 3]
        })

        self.assertEqual(response.status_code, 201)

        self.assertEqual(len(response.json()), 2, long_message("""
        The response array should exacly have the length of 2. If it have the length of 3,
        then most possibly the chat request where the sender is the same as the receiver has been created.
        Else if its a different length and still fails then other unexpected problem happened out of scope of this test. 
        """))

    def test_non_existent_receiver(self):
        authenticate_user(self)

        response = self._post(data={
            'receivers': [3, 1000] # No user with the id of '1000' exist
        })

        self.assertEqual(response.status_code, 400)

    def test_non_existent_chat(self):
        authenticate_user(self)

        response = self._post(data={
            'chat': 1000 # No chat with the id of '1000' exist
        })
        
        self.assertEqual(response.status_code, 400)

    def test_chat_with_request_create(self):
        """
        Test to send create a new chat with its requests at the same time when no chat's id is provided.
        """
        authenticate_user(self)

        # None is also allowed for the name of chat but for test purpose lets keep this
        name = 'created_test_chat_with_request'
        receivers = [
            2, 3
        ]

        response = self._post(data={
            'name': name,
            'receivers': receivers
        })

        self.assertEqual(response.status_code, 201)

        # Get the chat that was created with the chat requests
        chat = Chat.objects.filter(name=name)

        self.assertTrue(chat.exists(), 'Chat could not be created while sending chat requests at the same time.')

        expected_results = [
            {
                'chat': chat[0].id,
                'sender': self.user.id,
                'receiver': receiver
            }
            for receiver in receivers
        ]

        results = [
            {
                'chat': chat_request['chat'],
                'sender': chat_request['sender'],
                'receiver': chat_request['receiver']
            }
            for chat_request in response.json()
        ]

        def sort_key(x): return x['receiver']

        self.assertEqual(sorted(results, key=sort_key), sorted(expected_results, key=sort_key))