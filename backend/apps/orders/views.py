from django.db import transaction
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import (
    CartRequestSerializer,
    CheckoutSerializer,
    OrderSerializer,
    cart_payload,
)
from .services import CartInvalid, build_cart, create_order
from .tasks import order_created


class CartView(APIView):
    """POST /cart/ — актуальные цены и наличие для корзины из браузера (ADR-0009)."""

    def post(self, request):
        s = CartRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        return Response(cart_payload(build_cart(s.validated_data["items"]), request))


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = OrderSerializer
    lookup_field = "number"

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_throttles(self):
        self.throttle_scope = "checkout" if self.action == "create" else None
        return super().get_throttles()

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")

    def create(self, request):
        s = CheckoutSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = dict(s.validated_data)
        items = data.pop("items")
        try:
            order = create_order(
                items=items, user=request.user, language=request.LANGUAGE_CODE, **data
            )
        except CartInvalid as e:
            return Response(
                {"code": "cart_invalid", "cart": cart_payload(e.cart, request)},
                status=status.HTTP_409_CONFLICT,
            )
        transaction.on_commit(lambda: order_created.delay(order.pk))
        return Response(
            {"number": order.number, "total": str(order.total), "status": order.status},
            status=status.HTTP_201_CREATED,
        )
