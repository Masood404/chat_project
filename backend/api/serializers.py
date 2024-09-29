from django.core.validators import MinLengthValidator
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Chat
    
class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
    
class PublicUserSerializer(BaseUserSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ["first_name", "last_name", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

class UserSerializer(PublicUserSerializer):
    confirmation = serializers.CharField(required=True, write_only=True)

    class Meta(PublicUserSerializer.Meta):
        fields = PublicUserSerializer.Meta.fields + ["email", "password", "confirmation"]
        extra_kwargs = {
            "username": { "validators": [MinLengthValidator(4)] },
            "password": { "write_only": True, "validators": [validate_password] },
            "email": { "validators": [UniqueValidator(queryset=User.objects.all())] },
        }
    def create(self, validated_data):
        validated_data.pop("confirmation")
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        if "password" in validated_data:
            instance.set_password(validated_data["password"])
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance
    
    def validate_confirmation(self, confirmation):
        if self.initial_data["password"] != confirmation:
            raise serializers.ValidationError("Confirmation must match with password.")
        
        return confirmation
    
    def validate_username(self, username):
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("This username is already taken.")
        
        return username

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    remember_me = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        data = super().validate(attrs)

        remember_me = attrs.get('remember_me', False)

        refresh = self.get_token(self.user)

        if remember_me:
            refresh.set_exp(lifetime=settings.SIMPLE_JWT['REMEMBER_ME_REFRESH_TOKEN_LIFETIME'])

        else:
            refresh.set_exp(lifetime=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'])
        
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        return data
    
class ChatSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()  # For read operation
    user_ids = serializers.ListField(  # For write operation
        write_only=True,
        child=serializers.IntegerField()
    )

    class Meta:
        model = Chat
        fields = ['id', 'name', 'users', 'user_ids']  # `users` is for read, `user_ids` is for write

    def get_users(self, obj):
        # Use PublicUserSerializer for the read operation
        return PublicUserSerializer(obj.users.all(), many=True).data

    def create(self, validated_data):
        # Extract user ids and remove from validated data
        user_ids = validated_data.pop('user_ids', [])

        # Create the chat instance
        chat = Chat.objects.create(**validated_data)

        # Add the users to the chat
        chat.users.set(user_ids)
        return chat

    def update(self, instance, validated_data):
        # Extract user ids and remove from validated data
        user_ids = validated_data.pop('user_ids', [])

        # Update the chat instance
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Update the users in the chat
        if user_ids:
            instance.users.set(user_ids)

        return instance
