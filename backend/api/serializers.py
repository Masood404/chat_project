from django.core.validators import MinLengthValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User
    
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]

class UserSerializer(serializers.ModelSerializer):
    confirmation = serializers.CharField(required=True, write_only=True)
    friends = UserSummarySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "email", "password", "confirmation", "friends"]
        extra_kwargs = {
            "username": { "validators": [MinLengthValidator(4)] },
            "password": { "write_only": True, "validators": [validate_password] },
            "email": { "validators": [UniqueValidator(queryset=User.objects.all())] },
            "sent_requests": { "read_only": True },
            "recieved_requests": { "read_only": True }
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
    
class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]