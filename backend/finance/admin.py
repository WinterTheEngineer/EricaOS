from django.contrib import admin
from .models import CurrencyCard, WatchedCurrency

# Register your models here.
admin.site.register(CurrencyCard)
admin.site.register(WatchedCurrency)