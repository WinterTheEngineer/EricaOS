from . import views
from django.urls import path, include

urlpatterns = [
    
    path('register/', views.CreateUserView.as_view(), name="register"),
]
