from . import views
from django.urls import path

urlpatterns = [
    path('exchange-rate-card/', views.CurrencyCardView.as_view())
]