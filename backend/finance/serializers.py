from rest_framework import serializers
from .models import CurrencyCard, WatchedCurrency


class WatchedCurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchedCurrency
        fields = ["id", "currency", "display_order"]


class CurrencyCardSerializer(serializers.ModelSerializer):
    currencies = WatchedCurrencySerializer(many=True, read_only=True)

    class Meta:
        model = CurrencyCard
        fields = ["base_currency", "currencies"]