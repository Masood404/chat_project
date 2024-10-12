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

class MethodIsOwner(IsOwner):
    """
    **Permission class** that uses **IsOwner's** object permission method for http methods.
    
    **Use with caution**, it will give permission when the ongoing method is not in the 'methods' property of the instance.

    **Here is its ideal use case with maximum security:** 

    ```python
    # The PUT method is only allowed for the reciever
    permissions.append(MethodIsOwner(owner_fields=['receiver'], methods=['PUT']))

    # The DELETE method is only allowed only for the sender
    permissions.append(MethodIsOwner(owner_fields=['sender'], methods=['DELETE']))
    
    # The entire view is only allowed for these users
    permissions.append(IsOwner(owner_fields=['receiver', 'sender']))

    ```
    """
    methods = ['GET', 'PUT', 'PATCH', 'DELETE']

    def __init__(self, owner_fields: Iterable[str] | None = None, methods: list[str] = None):
        super().__init__(owner_fields)

        if methods:
            self.methods = methods

    def has_object_permission(self, request: HttpRequest, view, obj):
        if request.method in self.methods:
            return super().has_object_permission(request, view, obj)
        # Allow object permission if the http methods are not recognized.
        # And why? So more instance's of this same class have a chance to give permission
        return True
    
def method_is_owner_group(instances: Union[Iterable[MethodIsOwner], MethodIsOwner]) -> list:
    """
    Returns a list of MethodIsOwner permissions with IsOwner appended to the end for better safety.

    It keeps the track of possible owners provided by the iterable argument 'instances',
    and adds an IsOwner permission instance at the end with those users.
    """

    permissions = []
    possible_owners = set()

    def helper_append(obj: MethodIsOwner):
        permissions.append(obj)
        possible_owners.update(obj.owner_fields)

    # When the provided argument 'instances' is singular
    if isinstance(instances, MethodIsOwner): 
        helper_append(instances)
    else:
        for instance in instances: helper_append(instance)

    permissions.append(IsOwner(owner_fields=possible_owners))

    return permissions