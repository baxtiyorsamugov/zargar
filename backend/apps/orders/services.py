"""Оформление заказа: проверка корзины и создание заказа (ADR-0009)."""

from collections import OrderedDict
from dataclasses import dataclass, field
from decimal import Decimal

from django.db import transaction

from apps.catalog.models import ProductVariant

from .models import Order, OrderItem

MAX_QTY_PER_ITEM = 10


@dataclass
class CartLine:
    variant: ProductVariant | None
    variant_id: int
    quantity: int
    error: str | None = None  # not_found | out_of_stock | not_enough

    @property
    def line_total(self) -> Decimal:
        return self.variant.price * self.quantity if self.variant and not self.error else Decimal(0)


@dataclass
class Cart:
    lines: list[CartLine] = field(default_factory=list)

    @property
    def total(self) -> Decimal:
        return sum((ln.line_total for ln in self.lines), start=Decimal(0))

    @property
    def is_valid(self) -> bool:
        return bool(self.lines) and not any(ln.error for ln in self.lines)


def _merge(items: list[dict]) -> "OrderedDict[int, int]":
    merged: OrderedDict[int, int] = OrderedDict()
    for it in items:
        vid = int(it["variant_id"])
        merged[vid] = min(merged.get(vid, 0) + int(it["quantity"]), MAX_QTY_PER_ITEM)
    return merged


def build_cart(items: list[dict], *, lock: bool = False) -> Cart:
    """Актуальные цены и наличие для позиций из браузера. Цене клиента не доверяем."""
    merged = _merge(items)
    qs = ProductVariant.objects.select_related("product", "product__category").filter(
        pk__in=merged.keys(), product__is_active=True, product__category__is_active=True
    )
    if lock:
        qs = qs.select_for_update(of=("self",))
    variants = {v.pk: v for v in qs.prefetch_related("product__images")}
    cart = Cart()
    for vid, qty in merged.items():
        v = variants.get(vid)
        if v is None:
            cart.lines.append(CartLine(None, vid, qty, "not_found"))
        elif v.stock <= 0:
            cart.lines.append(CartLine(v, vid, qty, "out_of_stock"))
        elif v.stock < qty:
            cart.lines.append(CartLine(v, vid, qty, "not_enough"))
        else:
            cart.lines.append(CartLine(v, vid, qty))
    return cart


class CartInvalid(Exception):
    def __init__(self, cart: Cart):
        super().__init__("cart_invalid")
        self.cart = cart


@transaction.atomic
def create_order(*, items: list[dict], user=None, language: str = "ru", **fields) -> Order:
    cart = build_cart(items, lock=True)
    if not cart.is_valid:
        raise CartInvalid(cart)
    order = Order.objects.create(
        user=user if user and user.is_authenticated else None, language=language, **fields
    )
    OrderItem.objects.bulk_create(
        OrderItem.from_variant(order, ln.variant, ln.quantity) for ln in cart.lines
    )
    order.recalc_totals()
    return order
