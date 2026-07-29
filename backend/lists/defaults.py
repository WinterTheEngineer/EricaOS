import os
from dotenv import load_dotenv
from lists.models import List
from accounts.models import User
from django.utils import timezone

load_dotenv()

def setDefaultLists(user):

    now = timezone.now()
    month = now.strftime('%B')

    default_lists = [
        {
            "title" : f'{month} Buy List',
            "description": f"Items I need to buy in {month}",
            "list_type": "checklist",
            "list_items" : []
        },
        {
            "title" : f'{month} Grocery List',
            "description": f"Groceries I need to buy in {month}",
            "list_type": "checklist",
            "list_items" : []
        }
    ]

    for default_list in default_lists:
        List.objects.get_or_create(
            title=default_list["title"],
            description=default_list["description"],
            ordered=(default_list["list_type"]=='ordered'),
            checklist=(default_list["list_type"]=='checklist'),
            author=user,
        )