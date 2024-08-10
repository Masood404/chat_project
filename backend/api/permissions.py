from rest_framework.permissions import *

class ReadIsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.method == "POST" or (request.method == "GET" and (
            request.user and request.user.is_authenticated
        ))