from django.core.exceptions import ValidationError
from rest_framework import serializers

from .models import User
from .phone import normalize_phone


class PhoneField(serializers.CharField):
    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        try:
            return normalize_phone(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages, code="invalid_phone") from e


class OtpRequestSerializer(serializers.Serializer):
    phone = PhoneField()


class OtpVerifySerializer(serializers.Serializer):
    phone = PhoneField()
    code = serializers.RegexField(r"^\s*\d{4,8}\s*$")


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("phone", "first_name", "last_name", "email")
        read_only_fields = ("phone",)
