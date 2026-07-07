from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

def futureproof_validator(value):
    if value <= timezone.now():
        raise ValidationError("The reminder must be scheduled in the future.")


# Create your models here.
class Reminder(models.Model):

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reminders")
    
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    due = models.DateTimeField(validators=[futureproof_validator])

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
