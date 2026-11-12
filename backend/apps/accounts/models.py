"""Своя модель пользователя: логин — телефон (ADR-0007)."""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .phone import normalize_phone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, phone, password, **extra):
        user = self.model(phone=normalize_phone(phone), **extra)
        if extra.get("email"):
            user.email = self.normalize_email(extra["email"])
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(phone, password, **extra)

    def create_superuser(self, phone, password=None, **extra):
        extra["is_staff"] = True
        extra["is_superuser"] = True
        return self._create_user(phone, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(_("телефон"), max_length=13, unique=True)
    email = models.EmailField(_("email"), blank=True)
    first_name = models.CharField(_("имя"), max_length=150, blank=True)
    last_name = models.CharField(_("фамилия"), max_length=150, blank=True)
    is_staff = models.BooleanField(_("сотрудник"), default=False)
    is_active = models.BooleanField(_("активен"), default=True)
    date_joined = models.DateTimeField(_("дата регистрации"), default=timezone.now)
    bitrix_contact_id = models.CharField(_("ID контакта в Bitrix24"), max_length=32, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        verbose_name = _("пользователь")
        verbose_name_plural = _("пользователи")

    def __str__(self):
        full = f"{self.first_name} {self.last_name}".strip()
        return f"{full} ({self.phone})" if full else self.phone

    def clean(self):
        super().clean()
        if self.phone:
            self.phone = normalize_phone(self.phone)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name


class PhoneCode(models.Model):
    """Одноразовый код входа (ADR-0010). Сам код не хранится — только HMAC-хеш."""

    phone = models.CharField(_("телефон"), max_length=13, db_index=True)
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("код входа")
        verbose_name_plural = _("коды входа")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.phone} {self.created_at:%Y-%m-%d %H:%M}"
