"""Каталог: категории, коллекции, изделия, варианты по размеру, вставки, фото.

Модель данных описана в docs/lld/data-model.md, вариант по размеру — ADR-0008.
"""

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.core.models import SeoModel, TimeStampedModel


class Category(SeoModel, TimeStampedModel):
    parent = models.ForeignKey(
        "self",
        verbose_name=_("родительская категория"),
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="children",
    )
    name = models.CharField(_("название"), max_length=120)
    slug = models.SlugField(_("slug (адрес)"), max_length=140, unique=True)
    description = models.TextField(_("описание"), blank=True)
    image = models.ImageField(_("изображение"), upload_to="categories/", blank=True)
    external_id = models.CharField(_("ID в 1С"), max_length=64, blank=True, db_index=True)
    sort_order = models.PositiveIntegerField(_("порядок"), default=0)
    is_active = models.BooleanField(_("показывать на сайте"), default=True)

    class Meta:
        verbose_name = _("категория")
        verbose_name_plural = _("категории")
        ordering = ("sort_order", "name")

    def __str__(self):
        return self.name


class Collection(SeoModel, TimeStampedModel):
    name = models.CharField(_("название"), max_length=120)
    slug = models.SlugField(_("slug (адрес)"), max_length=140, unique=True)
    description = models.TextField(_("описание"), blank=True)
    image = models.ImageField(_("обложка"), upload_to="collections/", blank=True)
    sort_order = models.PositiveIntegerField(_("порядок"), default=0)
    is_active = models.BooleanField(_("показывать на сайте"), default=True)

    class Meta:
        verbose_name = _("коллекция")
        verbose_name_plural = _("коллекции")
        ordering = ("sort_order", "name")

    def __str__(self):
        return self.name


class Stone(models.Model):
    """Справочник камней для вставок (бриллиант, сапфир, фианит…)."""

    name = models.CharField(_("название"), max_length=80)
    slug = models.SlugField(_("slug"), max_length=80, unique=True)

    class Meta:
        verbose_name = _("камень")
        verbose_name_plural = _("камни")
        ordering = ("name",)

    def __str__(self):
        return self.name


class Product(SeoModel, TimeStampedModel):
    class Gender(models.TextChoices):
        WOMEN = "women", _("Женское")
        MEN = "men", _("Мужское")
        UNISEX = "unisex", _("Унисекс")
        KIDS = "kids", _("Детское")

    class Metal(models.TextChoices):
        GOLD = "gold", _("Золото")
        SILVER = "silver", _("Серебро")
        PLATINUM = "platinum", _("Платина")

    class MetalColor(models.TextChoices):
        YELLOW = "yellow", _("Жёлтое")
        WHITE = "white", _("Белое")
        RED = "red", _("Красное")
        COMBINED = "combined", _("Комбинированное")

    sku = models.CharField(_("артикул"), max_length=64, unique=True)
    external_id = models.CharField(_("ID в 1С"), max_length=64, blank=True, db_index=True)
    name = models.CharField(_("название"), max_length=200)
    slug = models.SlugField(_("slug (адрес)"), max_length=220, unique=True, blank=True)
    category = models.ForeignKey(
        Category, verbose_name=_("категория"), on_delete=models.PROTECT, related_name="products"
    )
    collection = models.ForeignKey(
        Collection,
        verbose_name=_("коллекция"),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    gender = models.CharField(_("для кого"), max_length=10, choices=Gender, default=Gender.WOMEN)
    metal = models.CharField(_("металл"), max_length=10, choices=Metal, default=Metal.GOLD)
    metal_color = models.CharField(_("цвет металла"), max_length=10, choices=MetalColor, blank=True)
    purity = models.PositiveSmallIntegerField(_("проба"), null=True, blank=True)
    description = models.TextField(_("описание"), blank=True)
    care = models.TextField(_("уход за изделием"), blank=True)
    video_url = models.URLField(_("видео"), blank=True)
    is_new = models.BooleanField(_("новинка"), default=False)
    is_active = models.BooleanField(_("показывать на сайте"), default=True)
    sort_order = models.PositiveIntegerField(_("порядок"), default=0)

    class Meta:
        verbose_name = _("изделие")
        verbose_name_plural = _("изделия")
        ordering = ("sort_order", "-created_at")
        indexes = [models.Index(fields=["is_active", "category"])]

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.sku)
        super().save(*args, **kwargs)


class ProductVariant(TimeStampedModel):
    """Конкретный размер изделия: свой вес, цена и остаток (ADR-0008)."""

    product = models.ForeignKey(
        Product, verbose_name=_("изделие"), on_delete=models.CASCADE, related_name="variants"
    )
    sku = models.CharField(_("артикул варианта"), max_length=64, unique=True)
    external_id = models.CharField(_("ID в 1С"), max_length=64, blank=True, db_index=True)
    size = models.CharField(_("размер"), max_length=16, blank=True)
    weight = models.DecimalField(_("вес, г"), max_digits=8, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(
        _("цена, сум"), max_digits=14, decimal_places=2, validators=[MinValueValidator(0)]
    )
    old_price = models.DecimalField(
        _("старая цена, сум"), max_digits=14, decimal_places=2, null=True, blank=True
    )
    stock = models.PositiveIntegerField(_("остаток"), default=0)

    class Meta:
        verbose_name = _("вариант (размер)")
        verbose_name_plural = _("варианты (размеры)")
        ordering = ("product", "size")
        constraints = [
            models.UniqueConstraint(fields=["product", "size"], name="uniq_variant_size"),
        ]

    def __str__(self):
        return f"{self.product.name} — {self.size or 'б/р'}"

    @property
    def in_stock(self) -> bool:
        return self.stock > 0


class ProductInsert(models.Model):
    """Вставка (камень) в изделии."""

    product = models.ForeignKey(
        Product, verbose_name=_("изделие"), on_delete=models.CASCADE, related_name="inserts"
    )
    stone = models.ForeignKey(Stone, verbose_name=_("камень"), on_delete=models.PROTECT)
    count = models.PositiveSmallIntegerField(_("количество"), default=1)
    carat = models.DecimalField(_("карат"), max_digits=6, decimal_places=3, null=True, blank=True)
    color = models.CharField(_("цвет"), max_length=32, blank=True)
    clarity = models.CharField(_("чистота"), max_length=32, blank=True)

    class Meta:
        verbose_name = _("вставка")
        verbose_name_plural = _("вставки")

    def __str__(self):
        return f"{self.stone} × {self.count}"


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, verbose_name=_("изделие"), on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(_("файл"), upload_to="products/")
    alt = models.CharField(_("alt-текст"), max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(_("порядок"), default=0)

    class Meta:
        verbose_name = _("фото")
        verbose_name_plural = _("фото")
        ordering = ("sort_order", "id")

    def __str__(self):
        return self.image.name
