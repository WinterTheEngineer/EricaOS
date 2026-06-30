import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.text import slugify

from phonenumber_field.modelfields import PhoneNumberField
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Core identity
    email = models.EmailField(unique=True)

    # Profile data
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)

    # OAuth

    # Django-required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"  # User logs in with email (or phone via custom login view)
    REQUIRED_FIELDS = ["first_name", "last_name"]  # Required for createsuperuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name