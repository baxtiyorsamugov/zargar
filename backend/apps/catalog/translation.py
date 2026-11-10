from modeltranslation.translator import TranslationOptions, register

from .models import Category, Collection, Product, ProductImage, Stone

SEO = ("seo_title", "seo_description")


@register(Category)
class CategoryTR(TranslationOptions):
    fields = ("name", "description", *SEO)


@register(Collection)
class CollectionTR(TranslationOptions):
    fields = ("name", "description", *SEO)


@register(Product)
class ProductTR(TranslationOptions):
    fields = ("name", "description", "care", *SEO)


@register(Stone)
class StoneTR(TranslationOptions):
    fields = ("name",)


@register(ProductImage)
class ProductImageTR(TranslationOptions):
    fields = ("alt",)
