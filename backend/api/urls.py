from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = 'api'

urlpatterns = [
    path('', views.index, name='index'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', views.UsersView.as_view(), name='users'),
    path('user/', views.UserView.as_view(), name='user'),
    path('chats/', views.ChatsView.as_view(), name='chats'),
    path('chat-requests/', views.ChatRequestsView.as_view(), name='chat_requests'),
    path('chat-request/<int:pk>', views.ChatRequestView.as_view(), name='chat_request')
]