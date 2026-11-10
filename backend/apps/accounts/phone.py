"""Нормализация телефонных номеров Узбекистана к формату E.164 (+998XXXXXXXXX)."""

import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

UZ_E164 = re.compile(r"^\+998\d{9}$")


def normalize_phone(raw: str) -> str:
    """Принимает «90 123 45 67», «+998 (90) 123-45-67», «998901234567» и т.п.

    Возвращает «+998901234567» или выбрасывает ValidationError.
    """
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 9:
        digits = "998" + digits
    phone = "+" + digits
    if not UZ_E164.match(phone):
        raise ValidationError(_("Введите номер в формате +998 XX XXX XX XX"), code="invalid_phone")
    return phone
