"""Отправка SMS через подключаемый адаптер (settings.SMS_BACKEND).

Провайдер выбирается на этапе 06 — тогда добавится, например, EskizSmsBackend.
"""

import logging

from django.conf import settings
from django.utils.module_loading import import_string

logger = logging.getLogger(__name__)

# Для тестов: LocmemSmsBackend складывает сообщения сюда
outbox: list[tuple[str, str]] = []


class ConsoleSmsBackend:
    """Разработка: SMS пишется в лог сервера."""

    def send(self, phone: str, text: str) -> None:
        logger.warning("SMS to %s: %s", phone, text)


class LocmemSmsBackend:
    def send(self, phone: str, text: str) -> None:
        outbox.append((phone, text))


def send_sms(phone: str, text: str) -> None:
    backend = import_string(settings.SMS_BACKEND)()
    backend.send(phone, text)
