from decimal import Decimal

import pytest

from apps.accounts.models import User
from apps.catalog.models import Product, ProductVariant
from apps.orders.models import Order
from apps.orders.tasks import order_created

pytestmark = pytest.mark.usefixtures("demo")


def vid(sku):
    return ProductVariant.objects.get(sku=sku).pk


def checkout(api, items, **over):
    data = {
        "customer_name": "Dilnoza",
        "customer_phone": "90 123 45 67",
        "delivery_method": "courier",
        "address": "Toshkent, Chilonzor 5",
        "payment_method": "on_receipt",
        "items": items,
        **over,
    }
    return api.post("/api/v1/orders/", data, format="json", HTTP_ACCEPT_LANGUAGE="uz")


def test_cart_quote_uses_server_prices(api):
    r = api.post(
        "/api/v1/cart/",
        {
            "items": [
                {"variant_id": vid("SZ-W-001-17"), "quantity": 2},
                {"variant_id": 999999, "quantity": 1},
            ]
        },
        format="json",
    )
    data = r.json()
    assert r.status_code == 200
    ok, missing = data["lines"]
    v = ProductVariant.objects.get(sku="SZ-W-001-17")
    assert Decimal(ok["line_total"]) == v.price * 2
    assert ok["product"]["slug"] == "sz-w-001" and ok["product"]["size"] == "17"
    assert missing["error"] == "not_found"
    assert data["is_valid"] is False
    assert Decimal(data["total"]) == v.price * 2


def test_cart_merges_duplicates(api):
    v = vid("SZ-W-001-17")
    r = api.post("/api/v1/cart/", {"items": [{"variant_id": v, "quantity": 1}] * 2}, format="json")
    assert [ln["quantity"] for ln in r.json()["lines"]] == [2]


def test_checkout_guest_creates_order(api):
    v = ProductVariant.objects.get(sku="SZ-W-001-17")
    r = checkout(api, [{"variant_id": v.pk, "quantity": 2}])
    assert r.status_code == 201, r.json()
    order = Order.objects.get(number=r.json()["number"])
    assert order.user is None
    assert order.customer_phone == "+998901234567"
    assert order.language == "uz"
    assert order.total == v.price * 2
    item = order.items.get()
    assert (item.sku, item.size, item.quantity) == (v.sku, "17", 2)


def test_checkout_logged_in_links_user(api):
    user = User.objects.create_user("+998901112233")
    api.force_login(user)
    r = checkout(api, [{"variant_id": vid("SZ-E-001"), "quantity": 1}])
    assert Order.objects.get(number=r.json()["number"]).user == user


def test_checkout_address_required_for_courier(api):
    r = checkout(api, [{"variant_id": vid("SZ-E-001"), "quantity": 1}], address="")
    assert r.status_code == 400 and "address" in r.json()
    r = checkout(
        api, [{"variant_id": vid("SZ-E-001"), "quantity": 1}], address="", delivery_method="pickup"
    )
    assert r.status_code == 201


@pytest.mark.parametrize(
    ("setup", "error"),
    [
        (lambda: ProductVariant.objects.filter(sku="SZ-E-001").update(stock=0), "out_of_stock"),
        (lambda: ProductVariant.objects.filter(sku="SZ-E-001").update(stock=1), "not_enough"),
        (lambda: Product.objects.filter(sku="SZ-E-001").update(is_active=False), "not_found"),
    ],
)
def test_checkout_rejects_invalid_cart(api, setup, error):
    setup()
    r = checkout(api, [{"variant_id": vid("SZ-E-001"), "quantity": 2}])
    assert r.status_code == 409
    assert r.json()["cart"]["lines"][0]["error"] == error
    assert Order.objects.count() == 0


def test_checkout_validation(api):
    assert checkout(api, []).status_code == 400
    assert checkout(api, [{"variant_id": vid("SZ-E-001"), "quantity": 11}]).status_code == 400
    assert (
        checkout(
            api, [{"variant_id": vid("SZ-E-001"), "quantity": 1}], customer_phone="1"
        ).status_code
        == 400
    )


def test_my_orders_only_mine(api):
    me = User.objects.create_user("+998901112233")
    mine = Order.objects.create(user=me, customer_name="A", customer_phone=me.phone)
    other = Order.objects.create(customer_name="B", customer_phone="+998907777777")
    assert api.get("/api/v1/orders/").status_code == 403
    api.force_login(me)
    numbers = [o["number"] for o in api.get("/api/v1/orders/").json()["results"]]
    assert numbers == [mine.number]
    assert api.get(f"/api/v1/orders/{other.number}/").status_code == 404
    detail = api.get(f"/api/v1/orders/{mine.number}/").json()
    assert detail["status_display"] and detail["items"] == []


def test_order_created_task_runs():
    order = Order.objects.create(customer_name="A", customer_phone="+998901234567")
    order_created.apply(args=[order.pk]).get()


def test_favorites_filter(api):
    r = api.get("/api/v1/products/?slugs=sz-r-001,sz-e-002,missing")
    assert {p["slug"] for p in r.json()["results"]} == {"sz-r-001", "sz-e-002"}
