from . import views
from django.urls import path


urlpatterns = [
    path("", views.ListView.as_view(), name="list-list"),               # GET /lists/ → list all
    path("create/", views.ListCreate.as_view(), name="list-create"),    # POST /lists/create/ → create
    # path("<int:pk>/", views.ListDetail.as_view(), name="list-detail"),
    path("<int:pk>/delete/", views.ListDelete.as_view(), name="list-delete"), # optional if you like separate delete
]