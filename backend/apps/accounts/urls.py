from django.urls import path

from .views import CsrfView, LogoutView, MeView, OtpRequestView, OtpVerifyView

urlpatterns = [
    path("csrf/", CsrfView.as_view(), name="auth-csrf"),
    path("otp/request/", OtpRequestView.as_view(), name="auth-otp-request"),
    path("otp/verify/", OtpVerifyView.as_view(), name="auth-otp-verify"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("me/", MeView.as_view(), name="auth-me"),
]
