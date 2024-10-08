from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = 'api'

urlpatterns = [
    path('', views.index, name='index'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', views.UsersView.as_view(), name='users')
]