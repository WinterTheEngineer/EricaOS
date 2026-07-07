from django.urls import path
from . import views

urlpatterns = [
    path("reminders/", views.ReminderView.as_view()),
    path("create/", views.CreateReminder.as_view()),

]