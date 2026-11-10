from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _

from .models import User
from .phone import normalize_phone


class PhoneCleanMixin:
    def clean_phone(self):
        return normalize_phone(self.cleaned_data["phone"])


class UserCreateForm(PhoneCleanMixin, UserCreationForm):
    class Meta:
        model = User
        fields = ("phone",)


class UserEditForm(PhoneCleanMixin, UserChangeForm):
    phone = forms.CharField(label=_("телефон"))

    class Meta:
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form = UserCreateForm
    form = UserEditForm
    ordering = ("-date_joined",)
    list_display = ("phone", "first_name", "last_name", "email", "is_staff", "date_joined")
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("phone", "first_name", "last_name", "email")
    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        (_("Личные данные"), {"fields": ("first_name", "last_name", "email")}),
        (_("Интеграции"), {"fields": ("bitrix_contact_id",)}),
        (
            _("Права"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        (_("Даты"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("phone", "password1", "password2")}),)
