from django.core.validators import MinLengthValidator
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User
    
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