"""Заказы. Статусы — по КП (раздел «Статусы заказа»)."""

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.catalog.models import ProductVariant
from apps.core.models import TimeStampedModel


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", _("Новый")
        CONFIRMED = "confirmed", _("Подтверждён")
        PAID = "paid", _("Оплачен")
        PACKING = "packing", _("Комплектуется")
        SHIPPED = "shipped", _("Передан в доставку")
        DELIVERED = "delivered", _("Доставлен")
        COMPLETED = "completed", _("Завершён")
        CANCELLED = "cancelled", _("Отменён")
        RETURNED = "returned", _("Возврат")

    class Delivery(models.TextChoices):
        COURIER = "courier", _("Доставка курьером")
        PICKUP = "pickup", _("Самовывоз")

    class PaymentMethod(models.TextChoices):
        UZQR = "uzqr", _("UZQR")
        ON_RECEIPT = "on_receipt", _("При получении")

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", _("Ожидает оплаты")
        PAID = "paid", _("Оплачен")
        FAILED = "failed", _("Ошибка оплаты")
        REFUNDED = "refunded", _("Возвращён")

    number = models.CharField(_("номер"), max_length=20, unique=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("клиент"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    status = models.CharField(
        _("статус"), max_length=16, choices=Status, default=Status.NEW, db_index=True
    )

    # Контакты — копия на момент заказа, даже если клиент без аккаунта
    customer_name = models.CharField(_("имя"), max_length=150)
    customer_phone = models.CharField(_("телефон"), max_length=13)
    customer_email = models.EmailField(_("email"), blank=True)

    delivery_method = models.CharField(
        _("способ получения"), max_length=10, choices=Delivery, default=Delivery.COURIER
    )
    address = models.TextField(_("адрес доставки"), blank=True)
    comment = models.TextField(_("комментарий клиента"), blank=True)

    payment_method = models.CharField(
        _("способ оплаты"), max_length=12, choices=PaymentMethod, default=PaymentMethod.UZQR
    )
    payment_status = models.CharField(
        _("статус оплаты"), max_length=10, choices=PaymentStatus, default=PaymentStatus.PENDING
    )

    subtotal = models.DecimalField(_("сумма товаров"), max_digits=14, decimal_places=2, default=0)
    delivery_cost = models.DecimalField(_("доставка"), max_digits=14, decimal_places=2, default=0)
    total = models.DecimalField(_("итого"), max_digits=14, decimal_places=2, default=0)

    language = models.CharField(_("язык сайта"), max_length=2, default="ru")

    # Интеграции
    onec_id = models.CharField(_("ID в 1С"), max_length=64, blank=True)
    bitrix_deal_id = models.CharField(_("ID сделки в Bitrix24"), max_length=32, blank=True)

    class Meta:
        verbose_name = _("заказ")
        verbose_name_plural = _("заказы")
        ordering = ("-created_at",)

    def __str__(self):
        return self.number or f"#{self.pk}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.number:
            self.number = f"SZ-{self.pk:06d}"
            super().save(update_fields=["number"])

    def recalc_totals(self, save=True):
        self.subtotal = sum((i.line_total for i in self.items.all()), start=0)
        self.total = self.subtotal + self.delivery_cost
        if save:
            self.save(update_fields=["subtotal", "total", "updated_at"])


class OrderItem(models.Model):
    """Позиция заказа. Название, артикул и цена копируются: каталог может измениться."""

    order = models.ForeignKey(
        Order, verbose_name=_("заказ"), on_delete=models.CASCADE, related_name="items"
    )
    variant = models.ForeignKey(
        ProductVariant,
        verbose_name=_("вариант"),
        on_delete=models.SET_NULL,
        null=True,
        related_name="order_items",
    )
    product_name = models.CharField(_("название"), max_length=200)
    sku = models.CharField(_("артикул"), max_length=64)
    size = models.CharField(_("размер"), max_length=16, blank=True)
    price = models.DecimalField(_("цена"), max_digits=14, decimal_places=2)
    quantity = models.PositiveIntegerField(_("количество"), default=1)

    class Meta:
        verbose_name = _("позиция")
        verbose_name_plural = _("позиции")

    def __str__(self):
        return f"{self.product_name} × {self.quantity}"

    @property
    def line_total(self):
        return self.price * self.quantity

    @classmethod
    def from_variant(cls, order, variant, quantity=1):
        return cls(
            order=order,
            variant=variant,
            product_name=variant.product.name,
            sku=variant.sku,
            size=variant.size,
            price=variant.price,
            quantity=quantity,
        )
