from rest_framework import serializers
from .models import Reminder
from django.contrib.auth import get_user_model

class ReminderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ["title", "description", "due",]


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ["id", "title", "description", "due", "created_at", "modified_at",]