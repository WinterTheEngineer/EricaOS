from .models import Reminder
from django.db.models import Q
from rest_framework import generics, exceptions
from rest_framework.response import Response
from .serializers import ReminderSerializer, ReminderCreateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class CreateReminder(generics.CreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderView(generics.ListAPIView):

    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Reminder.objects.filter(author=user)