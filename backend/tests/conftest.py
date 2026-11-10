import pytest
from django.core.management import call_command


@pytest.fixture
def demo(db):
    call_command("seed_demo", verbosity=0)


@pytest.fixture
def api():
    from rest_framework.test import APIClient

    return APIClient()
