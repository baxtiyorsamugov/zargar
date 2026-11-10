from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(_("создано"), auto_now_add=True)
    updated_at = models.DateTimeField(_("изменено"), auto_now=True)

    class Meta:
        abstract = True


class SeoModel(models.Model):
    """SEO-поля страницы. Переводятся через modeltranslation."""

    seo_title = models.CharField(_("SEO title"), max_length=160, blank=True)
    seo_description = models.CharField(_("SEO description"), max_length=320, blank=True)

    class Meta:
        abstract = True
