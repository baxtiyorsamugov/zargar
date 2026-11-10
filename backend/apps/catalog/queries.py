from django.db.models import Min, OuterRef, Subquery, Sum
from django.db.models.functions import Coalesce

from .models import Product, ProductVariant


def _variant_agg(agg):
    """Агрегат по вариантам изделия как скалярный подзапрос.

    Подзапрос, а не JOIN: фильтры по размерам и камням добавляют свои JOIN,
    и агрегаты через JOIN посчитались бы с дублями.
    """
    return Subquery(
        ProductVariant.objects.filter(product=OuterRef("pk"))
        .values("product")
        .annotate(v=agg)
        .values("v")[:1]
    )


def with_prices(qs=None):
    """Добавляет price_from, old_price_from, total_stock."""
    qs = Product.objects.all() if qs is None else qs
    return qs.annotate(
        price_from=_variant_agg(Min("price")),
        old_price_from=_variant_agg(Min("old_price")),
        total_stock=Coalesce(_variant_agg(Sum("stock")), 0),
    )
