import pytest
from django.core.exceptions import ValidationError

from apps.accounts.models import User
from apps.accounts.phone import normalize_phone


@pytest.mark.parametrize(
    "raw",
    ["+998 90 123 45 67", "998901234567", "90 123-45-67", "+998(90)1234567"],
)
def test_normalize_phone(raw):
    assert normalize_phone(raw) == "+998901234567"


@pytest.mark.parametrize("raw", ["", "12345", "+7 912 123 45 67", "+99890123456789"])
def test_normalize_phone_invalid(raw):
    with pytest.raises(ValidationError):
        normalize_phone(raw)


def test_create_user_normalizes_phone(db):
    u = User.objects.create_user("90 123 45 67", password="x")
    assert u.phone == "+998901234567"
    assert u.check_password("x")
    assert not u.is_staff


def test_create_superuser(db):
    u = User.objects.create_superuser("+998901112233", password="x")
    assert u.is_staff and u.is_superuser
