from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.
class User(AbstractUser):
    class Meta: 
        ordering = ("first_name", "last_name")

    first_name = models.CharField(max_length=150, blank=False, null=False)