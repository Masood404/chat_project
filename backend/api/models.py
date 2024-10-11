from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MaxLengthValidator

class User(AbstractUser):
    class Meta: 
        ordering = ("first_name", "last_name")

    first_name = models.CharField(max_length=150, blank=False, null=False)

class Chat(models.Model):
    """
    Chat or otherwise known as Chat Room model.
    """
    admin = models.ForeignKey(to=User, on_delete=models.CASCADE)
    users = models.ManyToManyField(to=User, related_name="chats", through='Chatship')
    name = models.CharField(null=True, max_length=128, validators=[MinLengthValidator(4)])

class Chatship(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('chat', 'user')

class Message(models.Model):
    chat = models.ForeignKey(to=Chat, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatRequest(models.Model):
    PENDING = 'P'
    ACCEPTED = 'A'
    DECLINED = 'D'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
    ]

    chat = models.ForeignKey(to=Chat, on_delete=models.CASCADE, related_name="chat_requests")
    sender = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="sent_chat_requests")
    receiver = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="received_chat_requests")
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('created_at', )
        constraints = [
            # Constraint to not allow the equality of sender and receiver
            models.CheckConstraint(
                check=~models.Q(sender=models.F('receiver')),
                name='sender_not_equal_receiver'
            )
        ]

    def accept(self):
        """
        Accept the chat request and add the receiver to the chat.
        """
        self.status = self.ACCEPTED
        self.chat.users.add(self.receiver)
        self.save()

    def decline(self):
        """
        Decline the chat request.
        """
        self.status = self.DECLINED
        self.save()

    def is_pending(self):
        """
        Check if the chat request is still pending.
        """
        return self.status == self.PENDING
