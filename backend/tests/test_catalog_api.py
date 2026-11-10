from decimal import Decimal

import pytest

from apps.catalog.models import Product

pytestmark = pytest.mark.usefixtures("demo")


def slugs(resp):
    return {p["slug"] for p in resp.json()["results"]}


def test_health(api):
    r = api.get("/api/health/")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "db": True}


def test_product_list(api):
    r = api.get("/api/v1/products/")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == 12
    first = data["results"][0]
    assert {"slug", "name", "price_from", "in_stock", "image"} <= set(first)


def test_inactive_hidden(api):
    Product.objects.filter(sku="SZ-R-001").update(is_active=False)
    assert "sz-r-001" not in slugs(api.get("/api/v1/products/"))
    assert api.get("/api/v1/products/sz-r-001/").status_code == 404


def test_category_filter_includes_children(api):
    s = slugs(api.get("/api/v1/products/?category=rings"))
    assert {"sz-r-001", "sz-w-001"} <= s
    assert not any(x.startswith("sz-e") for x in s)


def test_price_from_is_min_variant(api):
    r = api.get("/api/v1/products/sz-r-001/")
    assert Decimal(r.json()["price_from"]) == Decimal("6800000")
    assert len(r.json()["variants"]) == 3


def test_aggregates_not_duplicated_by_joins(api):
    # фильтр по размеру делает JOIN на варианты — сумма остатков не должна задвоиться
    r = api.get("/api/v1/products/?size=16,17&stone=diamond&ordering=price_from")
    assert r.status_code == 200
    found = {p["slug"]: p for p in r.json()["results"]}
    assert "sz-r-001" in found
    assert Decimal(found["sz-r-001"]["price_from"]) == Decimal("6800000")
    assert len(found) == len(r.json()["results"])  # без дублей строк


def test_price_and_stock_filters(api):
    s = slugs(api.get("/api/v1/products/?price_max=1000000"))
    assert s == {"sz-e-003"}
    assert "sz-r-003" not in slugs(api.get("/api/v1/products/?in_stock=true"))
    assert slugs(api.get("/api/v1/products/?in_stock=false")) == {"sz-r-003"}


def test_metal_and_search(api):
    assert slugs(api.get("/api/v1/products/?metal=silver")) == {"sz-e-003"}
    assert "sz-b-002" in slugs(api.get("/api/v1/products/?search=Tennis"))


@pytest.mark.parametrize(
    ("lang", "name"),
    [("uz", "Samarqand uzugi"), ("ru", "Кольцо «Самарканд»"), ("en", "Samarkand ring")],
)
def test_language_from_header(api, lang, name):
    r = api.get("/api/v1/products/sz-r-001/", HTTP_ACCEPT_LANGUAGE=lang)
    assert r.json()["name"] == name


def test_categories_and_collections(api):
    cats = api.get("/api/v1/categories/").json()
    assert {"rings", "wedding-rings"} <= {c["slug"] for c in cats}
    assert next(c for c in cats if c["slug"] == "wedding-rings")["parent"] == "rings"
    assert len(api.get("/api/v1/collections/").json()) == 2
