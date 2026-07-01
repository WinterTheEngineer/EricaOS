import requests
import pycountry
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CurrencyCard


# Create your views here.
def serialize_currency(code: str):
    currency = pycountry.currencies.get(alpha_3=code)
    return {"name": currency.name, "currency_code": currency.alpha_3} if currency else code


def fetch_rates(base):
    url = f"https://fxapi.app/api/{base}.json"

    res = requests.get(url)

    res.raise_for_status()
    return res.json().get("rates", {})


class CurrencyCardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        card, _ = CurrencyCard.objects.get_or_create(user=request.user)

        base = card.base_currency
        symbols = list(
            card.currencies.values_list("currency", flat=True)
        )

        if not symbols:
            return Response({
                "base": serialize_currency(base),
                "rates": []
            })
        
        rates = fetch_rates(base)

        return Response({
            "base": serialize_currency(base),
            "rates": [
                {
                    "code": code,
                    "name": serialize_currency(code)["name"],
                    "value": rates.get(code)
                }
                for code in symbols
            ]
        })