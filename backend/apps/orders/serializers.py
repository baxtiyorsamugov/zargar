from rest_framework import serializers

from apps.accounts.serializers import PhoneField

from .models import Order, OrderItem
from .services import MAX_QTY_PER_ITEM, Cart


class CartItemSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=MAX_QTY_PER_ITEM)


class CartRequestSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True, max_length=50)


def cart_payload(cart: Cart, request) -> dict:
    lines = []
    for ln in cart.lines:
        v = ln.variant
        image = None
        if v is not None:
            imgs = list(v.product.images.all())
            if imgs:
                image = {"url": request.build_absolute_uri(imgs[0].image.url), "alt": imgs[0].alt}
        lines.append(
            {
                "variant_id": ln.variant_id,
                "quantity": ln.quantity,
                "error": ln.error,
                "product": None
                if v is None
                else {
                    "slug": v.product.slug,
                    "name": v.product.name,
                    "sku": v.sku,
                    "size": v.size,
                    "price": str(v.price),
                    "stock": v.stock,
                    "image": image,
                },
                "line_total": str(ln.line_total),
            }
        )
    return {"lines": lines, "total": str(cart.total), "is_valid": cart.is_valid}


class CheckoutSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_phone = PhoneField()
    customer_email = serializers.EmailField(required=False, allow_blank=True)
    delivery_method = serializers.ChoiceField(choices=Order.Delivery.choices)
    address = serializers.CharField(required=False, allow_blank=True, max_length=500)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)
    items = CartItemSerializer(many=True, min_length=1, max_length=50)

    def validate(self, attrs):
        if (
            attrs["delivery_method"] == Order.Delivery.COURIER
            and not attrs.get("address", "").strip()
        ):
            raise serializers.ValidationError({"address": ["required"]}, code="required")
        return attrs


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ("product_name", "sku", "size", "price", "quantity", "line_total")


class OrderSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "number",
            "created_at",
            "status",
            "status_display",
            "payment_method",
            "payment_status",
            "delivery_method",
            "address",
            "subtotal",
            "delivery_cost",
            "total",
            "items",
        )
