from .models import List, ListItem
from rest_framework import serializers

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ["id", "title", "description", "ordered", "created_at", "last_modified", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ["id", "order", "name", "list"]
        extra_kwargs = {"list": {"read_only": True}}