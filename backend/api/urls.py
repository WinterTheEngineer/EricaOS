from . import views
from django.urls import path, include

urlpatterns = [
    path('search/', views.Search.as_view(), name="search"),
    path('heartbeat/', views.LookAlive.as_view(), name="heartbeat"),
]