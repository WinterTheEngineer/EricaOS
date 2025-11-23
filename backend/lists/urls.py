from . import views
from django.urls import path


urlpatterns = [
    path("lists/", views.ListView.as_view(), name="list-list"),               # GET /lists/ → list all
    path("lists/create/", views.ListCreate.as_view(), name="list-create"),    # POST /lists/create/ → create
    path("lists/<int:pk>/", views.ListDetail.as_view(), name="list-detail"),  # GET/PUT/DELETE /lists/<id>/ → detail, update, delete
    path("lists/<int:pk>/delete/", views.ListDelete.as_view(), name="list-delete"), # optional if you like separate delete
]