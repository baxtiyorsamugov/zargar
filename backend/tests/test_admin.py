import pytest

from apps.accounts.models import User
from apps.catalog.models import Product
from apps.orders.models import Order

pytestmark = pytest.mark.usefixtures("demo")


@pytest.fixture
def staff_client(client):
    user = User.objects.create_superuser("+998900000001", password="pass")
    client.force_login(user)
    return client


@pytest.mark.parametrize(
    "url",
    [
        "/admin/",
        "/admin/catalog/product/",
        "/admin/catalog/product/add/",
        "/admin/catalog/category/",
        "/admin/orders/order/",
        "/admin/accounts/user/",
        "/admin/accounts/user/add/",
    ],
)
def test_admin_pages(staff_client, url):
    assert staff_client.get(url).status_code == 200


def test_admin_change_pages(staff_client):
    p = Product.objects.first()
    assert staff_client.get(f"/admin/catalog/product/{p.pk}/change/").status_code == 200
    o = Order.objects.create(customer_name="A", customer_phone="+998901234567")
    assert staff_client.get(f"/admin/orders/order/{o.pk}/change/").status_code == 200
