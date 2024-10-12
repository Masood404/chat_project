from typing import Iterable, Union
from rest_framework.permissions import *
from django.http import HttpRequest

class ReadIsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.method == "POST" or (
            request.method == "GET" and request.user.is_authenticated
        )

class IsOwner(BasePermission):
    """
    Custom permission class to only allow the authorized user or the owner
    (based on the owner_fields provided as an argument)
    to do RUD operations on any object.
    """
    owner_fields = ['owner']

    def __init__(self, owner_fields: Iterable[str] | None = None):
        if owner_fields:
            self.owner_fields = owner_fields
        super().__init__()

    def has_object_permission(self, request: HttpRequest, view, obj):
        # Check ownership based on the provided owner_fields
        for owner_field in self.owner_fields:
            owner = getattr(obj, owner_field, None)
            if owner == request.user:
                return True
        return False
