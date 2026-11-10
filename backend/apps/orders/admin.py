from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Order, OrderItem


class ItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("product_name", "sku", "size", "price", "quantity", "line_total")
    readonly_fields = ("line_total",)

    @admin.display(description=_("сумма"))
    def line_total(self, obj):
        return obj.line_total if obj.pk else "—"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "number",
        "created_at",
        "customer_name",
        "customer_phone",
        "total",
        "status",
        "payment_status",
        "delivery_method",
    )
    list_filter = ("status", "payment_status", "payment_method", "delivery_method", "created_at")
    search_fields = ("number", "customer_name", "customer_phone", "customer_email")
    date_hierarchy = "created_at"
    readonly_fields = ("number", "created_at", "updated_at", "subtotal", "total")
    raw_id_fields = ("user",)
    inlines = (ItemInline,)
    fieldsets = (
        (None, {"fields": ("number", "status", "created_at", "updated_at")}),
        (_("Клиент"), {"fields": ("user", "customer_name", "customer_phone", "customer_email")}),
        (_("Получение"), {"fields": ("delivery_method", "address", "comment")}),
        (
            _("Оплата"),
            {"fields": ("payment_method", "payment_status", "subtotal", "delivery_cost", "total")},
        ),
        (_("Интеграции"), {"fields": ("onec_id", "bitrix_deal_id", "language")}),
    )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.recalc_totals()
