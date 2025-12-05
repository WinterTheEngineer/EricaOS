from . import views
from django.urls import path, include

urlpatterns = [
    path('register/', views.SignupView.as_view(), name="register"),
    path("validate/<str:field>/", views.ValidateFieldView.as_view(), name="validate-field"),
]
