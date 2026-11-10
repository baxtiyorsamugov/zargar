from django.db.models import Prefetch
from rest_framework import viewsets

from .filters import ProductFilter
from .models import Category, Collection, Product, ProductImage, ProductVariant
from .queries import with_prices
from .serializers import (
    CategorySerializer,
    CollectionSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    lookup_field = "slug"
    pagination_class = None
    queryset = Category.objects.filter(is_active=True).select_related("parent")


class CollectionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CollectionSerializer
    lookup_field = "slug"
    pagination_class = None
    queryset = Collection.objects.filter(is_active=True)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ("name_uz", "name_ru", "name_en", "sku")
    ordering_fields = ("price_from", "created_at", "sort_order")
    ordering = ("sort_order", "-created_at")

    def get_queryset(self):
        qs = with_prices(
            Product.objects.filter(is_active=True, category__is_active=True).select_related(
                "category", "collection"
            )
        ).prefetch_related(
            Prefetch("images", queryset=ProductImage.objects.order_by("sort_order", "id"))
        )
        if self.action == "retrieve":
            qs = qs.prefetch_related(
                Prefetch("variants", queryset=ProductVariant.objects.order_by("size")),
                "inserts__stone",
                "category__parent",
            )
        return qs

    def get_serializer_class(self):
        return ProductDetailSerializer if self.action == "retrieve" else ProductListSerializer
