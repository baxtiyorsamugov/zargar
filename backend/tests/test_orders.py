from decimal import Decimal

import pytest

from apps.catalog.models import ProductVariant
from apps.orders.models import Order, OrderItem

pytestmark = pytest.mark.usefixtures("demo")


def test_order_number_and_totals():
    order = Order.objects.create(customer_name="Test", customer_phone="+998901234567")
    assert order.number == f"SZ-{order.pk:06d}"
    v = ProductVariant.objects.get(sku="SZ-W-001-17")
    OrderItem.from_variant(order, v, quantity=2).save()
    order.delivery_cost = Decimal("50000")
    order.recalc_totals()
    order.refresh_from_db()
    assert order.subtotal == v.price * 2
    assert order.total == v.price * 2 + Decimal("50000")


def test_item_snapshot_survives_price_change():
    order = Order.objects.create(customer_name="Test", customer_phone="+998901234567")
    v = ProductVariant.objects.get(sku="SZ-W-001-17")
    item = OrderItem.from_variant(order, v)
    item.save()
    old = v.price
    v.price = old + 1
    v.save()
    item.refresh_from_db()
    assert item.price == old
