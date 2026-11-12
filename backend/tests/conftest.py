import pytest
from django.core.cache import cache
from django.core.management import call_command


@pytest.fixture(autouse=True)
def _isolation(settings):
    """Чистый кэш (счётчики throttling) и SMS в памяти для каждого теста."""
    from apps.accounts import sms

    settings.SMS_BACKEND = "apps.accounts.sms.LocmemSmsBackend"
    cache.clear()
    sms.outbox.clear()
    yield
    cache.clear()


@pytest.fixture
def demo(db):
    call_command("seed_demo", verbosity=0)


@pytest.fixture
def api():
    from rest_framework.test import APIClient

    return APIClient()
