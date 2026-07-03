from django.db.models import Q
from .models import List, ListItem
from rest_framework import generics, exceptions
from rest_framework.response import Response
from .serializers import ListSerializer, ListItemSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


def setDefaults():

    default_lists = [
        "Grocery List"
    ]

    default_list_items = {
        "Grocery List": []
    }

class ListCreate(generics.CreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print(serializer.errors)  # <-- THIS IS WHAT YOU'RE MISSING
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class ListDelete(generics.DestroyAPIView):
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return List.objects.filter(author=self.request.user)


class ListView(generics.ListAPIView):

    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return List.objects.filter(author=user)


class ListItemCreate(generics.ListCreateAPIView):

    serializer_class = ListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return ListItem.objects.filter(
            parent__author=user
        )

    def perform_create(self, serializer):

        parent_id = self.request.data.get("parent")

        if not parent_id:
            raise exceptions.ValidationError({
                "parent": "This field is required."
            })

        try:
            parent_obj = List.objects.get(
                id=parent_id,
                author=self.request.user
            )


        except List.DoesNotExist:
            raise exceptions.ValidationError({
                "parent": "Invalid list or unauthorized."
            })

        serializer.save(parent=parent_obj)


class ListDelete(generics.DestroyAPIView):

    serializer_class = ListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return List.objects.filter(author=user)