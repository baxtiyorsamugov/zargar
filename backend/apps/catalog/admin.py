from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from modeltranslation.admin import TabbedTranslationAdmin, TranslationTabularInline

from .models import (
    Category,
    Collection,
    Product,
    ProductImage,
    ProductInsert,
    ProductVariant,
    Stone,
)
from .queries import with_prices


@admin.register(Category)
class CategoryAdmin(TabbedTranslationAdmin):
    list_display = ("name", "parent", "slug", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active", "parent")
    search_fields = ("name", "slug", "external_id")
    prepopulated_fields = {"slug": ("name_ru",)}


@admin.register(Collection)
class CollectionAdmin(TabbedTranslationAdmin):
    list_display = ("name", "slug", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name_ru",)}


@admin.register(Stone)
class StoneAdmin(TabbedTranslationAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name_ru",)}


class VariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ("size", "sku", "weight", "price", "old_price", "stock", "external_id")


class InsertInline(admin.TabularInline):
    model = ProductInsert
    extra = 0
    autocomplete_fields = ("stone",)


class ImageInline(TranslationTabularInline):
    model = ProductImage
    extra = 1
    fields = ("preview", "image", "alt", "sort_order")
    readonly_fields = ("preview",)

    @admin.display(description=_("превью"))
    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html(
                '<img src="{}" style="height:60px;border-radius:6px">', obj.image.url
            )
        return "—"


@admin.register(Product)
class ProductAdmin(TabbedTranslationAdmin):
    list_display = (
        "name",
        "sku",
        "category",
        "metal",
        "purity",
        "price_from",
        "total_stock",
        "is_new",
        "is_active",
    )
    list_filter = (
        "is_active",
        "is_new",
        "category",
        "collection",
        "metal",
        "metal_color",
        "gender",
    )
    list_editable = ("is_new", "is_active")
    search_fields = ("name", "sku", "external_id", "variants__sku")
    prepopulated_fields = {"slug": ("sku",)}
    autocomplete_fields = ("category", "collection")
    inlines = (VariantInline, InsertInline, ImageInline)
    fieldsets = (
        (None, {"fields": ("name", "sku", "slug", "category", "collection", "gender")}),
        (_("Металл"), {"fields": ("metal", "metal_color", "purity")}),
        (_("Описание"), {"fields": ("description", "care", "video_url")}),
        (_("Показ"), {"fields": ("is_active", "is_new", "sort_order")}),
        (_("SEO"), {"fields": ("seo_title", "seo_description"), "classes": ("collapse",)}),
        (_("1С"), {"fields": ("external_id",), "classes": ("collapse",)}),
    )

    def get_queryset(self, request):
        return with_prices(super().get_queryset(request).select_related("category"))

    @admin.display(description=_("цена от"), ordering="price_from")
    def price_from(self, obj):
        return obj.price_from

    @admin.display(description=_("остаток"), ordering="total_stock")
    def total_stock(self, obj):
        return obj.total_stock or 0
