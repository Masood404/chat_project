from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=150, blank=False, null=False)
    friends = models.ManyToManyField("self", symmetrical=True)
    sent_requests = models.ManyToManyField("self", symmetrical=False, related_name="recieved_requests")

    def send_request(self, user):
        if self == user:
            raise ValidationError("A user cannot send friend request to themselves.")
        
        self.sent_requests.add(user)

    def add_friend(self, user):
        if self == user:
            raise ValidationError("A user cannot friend themselves.")
        
        self.friends.add(user)