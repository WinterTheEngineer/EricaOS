import pycountry
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


CURRENCY_CODES = sorted(
    [
        (c.alpha_3, f"{c.alpha_3} - {c.name}")
        for c in pycountry.currencies
        if hasattr(c, "alpha_3")
    ],
    key=lambda x: x[0]
)

# Create your models here.
class CurrencyCard(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="currency_card"
    )

    base_currency = models.CharField(max_length=3, choices=CURRENCY_CODES, default="ZAR")


class WatchedCurrency(models.Model):
    base_currency = models.ForeignKey(
        CurrencyCard,
        on_delete=models.CASCADE,
        related_name="currencies"
    )

    currency = models.CharField(max_length=3, choices=CURRENCY_CODES)

    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("base_currency", "currency")
        ordering = ["display_order"]