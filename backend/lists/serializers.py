from rest_framework import serializers
from .models import List, ListItem
from django.contrib.auth import get_user_model


User = get_user_model()

# -------------------------
# READ serializer for items
# -------------------------
class ListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ["id", "order", "name"]


# -------------------------
# WRITE serializer for items (nested input only)
# -------------------------
class ListItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListItem
        fields = ["name"]


class AuthorSerializer(serializers.ModelSerializer):
    identifier = serializers.EmailField(source="email")

    class Meta:
        model = User
        fields = ["id", "identifier"]

# -------------------------
# LIST serializer (READ + CREATE LIST + NESTED ITEMS)
# -------------------------
class ListSerializer(serializers.ModelSerializer):
    # for OUTPUT (GET requests)
    items = ListItemSerializer(many=True, read_only=True)

    # for INPUT (POST requests)
    items_input = ListItemCreateSerializer(many=True, write_only=True, required=False)
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = List
        fields = [
            "id",
            "title",
            "description",
            "ordered",
            "items",
            "items_input",
            "created_at",
            "last_modified",
            "author",
        ]
        extra_kwargs = {
            "author": {"read_only": True}
        }

    def create(self, validated_data):
        items_data = validated_data.pop("items_input", [])
        request = self.context["request"]

        list_obj = List.objects.create(
            author=request.user,
            **validated_data
        )

        for index, item in enumerate(items_data, start=1):
            ListItem.objects.create(
                parent=list_obj,
                name=item["name"],
                order=index if list_obj.ordered else None
            )

        return list_obj