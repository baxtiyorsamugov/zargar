"""Вход по одноразовому коду из SMS (ADR-0010)."""

import hashlib
import hmac
import secrets
from dataclasses import dataclass
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import PhoneCode
from .sms import send_sms

CODE_LENGTH = 6
CODE_TTL = timedelta(minutes=5)
RESEND_INTERVAL = timedelta(seconds=60)
MAX_PER_HOUR = 5
MAX_ATTEMPTS = 5


class OtpError(Exception):
    """code — машинный код ошибки для фронтенда, retry_after — секунды до повтора."""

    def __init__(self, code: str, retry_after: int | None = None):
        super().__init__(code)
        self.code = code
        self.retry_after = retry_after


def _hash(phone: str, code: str) -> str:
    key = settings.SECRET_KEY.encode()
    return hmac.new(key, f"{phone}:{code}".encode(), hashlib.sha256).hexdigest()


def request_code(phone: str, language: str = "ru") -> int:
    """Создаёт и отправляет код. Возвращает, через сколько секунд можно запросить снова."""
    now = timezone.now()
    recent = PhoneCode.objects.filter(phone=phone, created_at__gte=now - timedelta(hours=1))
    last = recent.first()
    if last and now - last.created_at < RESEND_INTERVAL:
        wait = RESEND_INTERVAL - (now - last.created_at)
        raise OtpError("too_soon", retry_after=int(wait.total_seconds()) + 1)
    if recent.count() >= MAX_PER_HOUR:
        raise OtpError("too_many", retry_after=3600)

    code = f"{secrets.randbelow(10**CODE_LENGTH):0{CODE_LENGTH}d}"
    PhoneCode.objects.create(phone=phone, code_hash=_hash(phone, code))
    texts = {
        "uz": f"SOFIZAR: kirish kodi {code}",
        "en": f"SOFIZAR: your login code is {code}",
    }
    send_sms(phone, texts.get(language, f"SOFIZAR: код для входа {code}"))
    return int(RESEND_INTERVAL.total_seconds())


@dataclass
class VerifyResult:
    ok: bool
    error: str | None = None


def verify_code(phone: str, code: str) -> VerifyResult:
    with transaction.atomic():
        entry = (
            PhoneCode.objects.select_for_update()
            .filter(phone=phone, used_at__isnull=True, created_at__gte=timezone.now() - CODE_TTL)
            .first()
        )
        if entry is None:
            return VerifyResult(False, "expired")
        if entry.attempts >= MAX_ATTEMPTS:
            return VerifyResult(False, "too_many_attempts")
        if not hmac.compare_digest(entry.code_hash, _hash(phone, code.strip())):
            entry.attempts += 1
            entry.save(update_fields=["attempts"])
            return VerifyResult(False, "invalid_code")
        entry.used_at = timezone.now()
        entry.save(update_fields=["used_at"])
        return VerifyResult(True)
