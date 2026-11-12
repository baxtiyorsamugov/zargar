from django.contrib.auth import login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order

from . import otp
from .models import User
from .serializers import MeSerializer, OtpRequestSerializer, OtpVerifySerializer


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """Ставит cookie csrftoken — фронтенд вызывает один раз при загрузке форм."""

    def get(self, request):
        return Response({"ok": True})


class OtpRequestView(APIView):
    throttle_scope = "otp"

    def post(self, request):
        s = OtpRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        try:
            resend_in = otp.request_code(s.validated_data["phone"], request.LANGUAGE_CODE)
        except otp.OtpError as e:
            return Response(
                {"code": e.code, "retry_after": e.retry_after},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        return Response({"sent": True, "resend_in": resend_in})


class OtpVerifyView(APIView):
    throttle_scope = "otp_verify"

    def post(self, request):
        s = OtpVerifySerializer(data=request.data)
        s.is_valid(raise_exception=True)
        phone = s.validated_data["phone"]
        result = otp.verify_code(phone, s.validated_data["code"])
        if not result.ok:
            return Response({"code": result.error}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(phone=phone)
        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])
        if not user.is_active:
            return Response({"code": "inactive"}, status=status.HTTP_403_FORBIDDEN)
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        # Телефон подтверждён — привязываем заказы, оформленные на него без входа
        Order.objects.filter(user__isnull=True, customer_phone=phone).update(user=user)
        return Response(MeSerializer(user).data)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = MeSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "patch"]

    def get_object(self):
        return self.request.user
