from . import views
from django.urls import path, include

urlpatterns = [
    path('', views.Search.as_view(), name="search"),
]