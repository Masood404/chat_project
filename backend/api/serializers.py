from django.core.validators import MinLengthValidator
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Chat, ChatRequest
    
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
    admin = PublicUserSerializer()
    users = BaseUserSerializer(many=True)

    class Meta:
        model = Chat
        fields = ['id', 'name', 'admin', 'users']

class ChatRequestSerializer(serializers.ModelSerializer):
    receivers = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()),
        write_only=True,
        required=True
    )
    name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ChatRequest
        fields = ['id', 'chat', 'sender', 'receiver', 'status', 'created_at', 'updated_at', 'name', 'receivers']
        extra_kwargs = {
            'chat': { 'required': False },
            'receiver' : { 'read_only': True, 'required': False }
        }

    def validate_chat(self, chat): 
        """
        Check if the sender is the owner of the chat with the provided chat_id
        """
        try:
            chat = Chat.objects.get(id=chat.id)
        except Chat.DoesNotExist:
            raise serializers.ValidationError(f'Chat with id {chat.id} does not exist.')

        sender_id = self.initial_data.get('sender')
        if sender_id is None:
            raise serializers.ValidationError('Sender ID is missing from validated data.')

        if chat.admin.id != sender_id:
            raise serializers.ValidationError('The sender is not authorized to send requests for the provided chat id.')

        return chat

    def create(self, validated_data):
        # receivers from validated data
        receivers = validated_data.pop('receivers')

        # Get the chat id from validated data
        chat_id = validated_data.get('chat', None)
        # Extract the chat name from the request; will be None if not provided
        chat_name = validated_data.pop('name', None)

        # Create the chat if it doesn't exist
        if not chat_id:
            if chat_name:
                # Validate the name against the Chat model's constraints and create it.
                chat = Chat(admin=validated_data['sender'], name=chat_name)
                chat.full_clean()  
                chat.save() 
            else:
                chat = Chat.objects.create(admin=validated_data['sender'])

            validated_data['chat'] = chat

        chat_requests = []

        for receiver in receivers:
            # Check for duplicate chat requests
            chat_request = ChatRequest.objects.filter(receiver=receiver, chat=chat_id)
            if not chat_request.exists():
                # If there is no duplication found then create a new chat request
                chat_request = ChatRequest.objects.create(**validated_data, receiver=receiver)

            chat_requests.append(chat_request)

        return chat_requests