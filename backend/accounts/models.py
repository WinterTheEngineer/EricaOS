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
    phone = PhoneNumberField(blank=True, null=True, unique=True)

    # Username is required internally but auto-generated
    username = models.CharField(max_length=150, unique=True)

    # Profile data
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)

    # OAuth
    google_id = models.CharField(max_length=255, unique=True, blank=True, null=True)

    # Django-required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"  # User logs in with email (or phone via custom login view)
    REQUIRED_FIELDS = ["first_name", "last_name"]  # Required for createsuperuser

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def generate_username(self):
        """
        Auto-generate unique username based on firstname+lastname
        """
        base = slugify(f"{self.first_name}-{self.last_name}") or "user"
        username = base
        counter = 1

        while User.objects.filter(username=username).exists():
            counter += 1
            username = f"{base}-{counter}"

        return username
