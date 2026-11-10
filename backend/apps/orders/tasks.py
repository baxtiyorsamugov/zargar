import logging

from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=5, default_retry_delay=60)
def order_created(self, order_id: int) -> None:
    """Точка расширения после оформления заказа.

    Этап 04 — передача заказа в 1С, этап 05 — сделка в Bitrix24,
    этап 06 — уведомление клиенту. Каждая интеграция — отдельная идемпотентная задача.
    """
    from .models import Order

    order = Order.objects.get(pk=order_id)
    logger.info(
        "Order %s created: %s items, total %s", order.number, order.items.count(), order.total
    )
