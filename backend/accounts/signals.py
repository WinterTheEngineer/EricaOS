from .models import User, Profile
from django.dispatch import receiver
from lists.defaults import setDefaultLists
from django.db.models.signals import post_save

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def create_default_lists(sender, instance, created, **kwargs):
    if created:
        setDefaultLists(instance)