from . import views
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', views.SignupView.as_view(), name="register"),
    path("validate/<str:field>/", views.ValidateFieldView.as_view(), name="validate-field"),
    path("token/create", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]
