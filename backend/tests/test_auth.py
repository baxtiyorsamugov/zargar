import re
from datetime import timedelta

from django.utils import timezone

from apps.accounts import sms
from apps.accounts.models import PhoneCode, User
from apps.orders.models import Order

PHONE = "+998901234567"


def last_code() -> str:
    return re.search(r"\d{6}", sms.outbox[-1][1]).group()


def request_code(api, phone="90 123 45 67", lang="ru"):
    return api.post(
        "/api/v1/auth/otp/request/", {"phone": phone}, format="json", HTTP_ACCEPT_LANGUAGE=lang
    )


def test_request_sends_sms_and_stores_only_hash(api, db):
    r = request_code(api)
    assert r.status_code == 200
    assert r.json()["resend_in"] == 60
    phone, text = sms.outbox[-1]
    assert phone == PHONE and "SOFIZAR" in text
    code = last_code()
    assert not PhoneCode.objects.filter(code_hash__contains=code).exists()


def test_sms_language(api, db):
    request_code(api, lang="uz")
    assert "kirish kodi" in sms.outbox[-1][1]


def test_invalid_phone(api, db):
    r = request_code(api, phone="12345")
    assert r.status_code == 400
    assert "phone" in r.json()


def test_resend_too_soon(api, db):
    request_code(api)
    r = request_code(api)
    assert r.status_code == 429
    assert r.json()["code"] == "too_soon"
    assert 0 < r.json()["retry_after"] <= 61


def test_hourly_limit(api, db):
    for _ in range(5):
        request_code(api)
        PhoneCode.objects.update(created_at=timezone.now() - timedelta(minutes=2))
    r = request_code(api)
    assert r.json()["code"] == "too_many"


def test_verify_logs_in_and_creates_user(api, db):
    request_code(api)
    r = api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": last_code()}, format="json")
    assert r.status_code == 200
    assert r.json()["phone"] == PHONE
    user = User.objects.get(phone=PHONE)
    assert not user.has_usable_password()
    assert api.get("/api/v1/auth/me/").json()["phone"] == PHONE


def test_code_is_single_use(api, db):
    request_code(api)
    code = last_code()
    api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": code}, format="json")
    api.post("/api/v1/auth/logout/")
    r = api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": code}, format="json")
    assert r.json()["code"] == "expired"


def test_wrong_code_attempts_limit(api, db):
    request_code(api)
    good = last_code()
    bad = "000000" if good != "000000" else "111111"
    for _ in range(5):
        r = api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": bad}, format="json")
        assert r.json()["code"] == "invalid_code"
    r = api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": good}, format="json")
    assert r.json()["code"] == "too_many_attempts"


def test_expired_code(api, db):
    request_code(api)
    PhoneCode.objects.update(created_at=timezone.now() - timedelta(minutes=6))
    r = api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": last_code()}, format="json")
    assert r.json()["code"] == "expired"


def test_guest_orders_attached_after_login(api, db):
    guest = Order.objects.create(customer_name="A", customer_phone=PHONE)
    other = Order.objects.create(customer_name="B", customer_phone="+998907777777")
    request_code(api)
    api.post("/api/v1/auth/otp/verify/", {"phone": PHONE, "code": last_code()}, format="json")
    guest.refresh_from_db()
    other.refresh_from_db()
    assert guest.user is not None and other.user is None


def test_me_requires_login_and_patch(api, db):
    assert api.get("/api/v1/auth/me/").status_code == 403
    user = User.objects.create_user(PHONE)
    api.force_login(user)
    r = api.patch(
        "/api/v1/auth/me/", {"first_name": "Sofiya", "phone": "+998900000000"}, format="json"
    )
    assert r.status_code == 200
    user.refresh_from_db()
    assert user.first_name == "Sofiya" and user.phone == PHONE


def test_csrf_enforced_for_logged_in_session(db):
    from rest_framework.test import APIClient

    api = APIClient(enforce_csrf_checks=True)
    api.force_login(User.objects.create_user(PHONE))
    r = api.patch("/api/v1/auth/me/", {"first_name": "X"}, format="json")
    assert r.status_code == 403
    api.get("/api/v1/auth/csrf/")
    token = api.cookies["csrftoken"].value
    r = api.patch("/api/v1/auth/me/", {"first_name": "X"}, format="json", HTTP_X_CSRFTOKEN=token)
    assert r.status_code == 200


def test_otp_ip_throttle(api, db):
    # не больше 10 запросов кода в час с одного IP (защита от рассылки SMS по чужим номерам)
    for i in range(10):
        request_code(api, phone=f"+99890000{i:04d}")
    r = request_code(api, phone="+998909999999")
    assert r.status_code == 429
