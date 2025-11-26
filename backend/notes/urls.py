from django.urls import path
from . import views

urlpatterns = [
    path("", views.NoteListView.as_view(), name="notes"),
    path("create/", views.NoteCreateView.as_view(), name="note-create"),
    path("delete/<int:pk>/", views.NoteDelete.as_view(), name="note-delete"),
]