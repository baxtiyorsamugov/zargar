from rest_framework import serializers

from .models import (
    Category,
    Collection,
    Product,
    ProductImage,
    ProductInsert,
    ProductVariant,
)


class CategorySerializer(serializers.ModelSerializer):
    parent = serializers.SlugRelatedField(slug_field="slug", read_only=True)

    class Meta:
        model = Category
        fields = ("slug", "name", "parent", "description", "image", "seo_title", "seo_description")


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ("slug", "name", "description", "image", "seo_title", "seo_description")


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("image", "alt")


class VariantSerializer(serializers.ModelSerializer):
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ("id", "sku", "size", "weight", "price", "old_price", "in_stock")


class InsertSerializer(serializers.ModelSerializer):
    stone = serializers.CharField(source="stone.name")

    class Meta:
        model = ProductInsert
        fields = ("stone", "count", "carat", "color", "clarity")


class ProductListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.slug")
    price_from = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    old_price_from = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    in_stock = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "slug",
            "sku",
            "name",
            "category",
            "metal",
            "metal_color",
            "purity",
            "is_new",
            "price_from",
            "old_price_from",
            "in_stock",
            "image",
        )

    def get_in_stock(self, obj) -> bool:
        return bool(getattr(obj, "total_stock", 0))

    def get_image(self, obj):
        images = obj.images.all()  # prefetch_related в queryset
        if not images:
            return None
        first = images[0]
        request = self.context.get("request")
        url = first.image.url
        return {"url": request.build_absolute_uri(url) if request else url, "alt": first.alt}


class ProductDetailSerializer(ProductListSerializer):
    category = CategorySerializer(read_only=True)
    collection = CollectionSerializer(read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    inserts = InsertSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = (
            *ProductListSerializer.Meta.fields,
            "collection",
            "gender",
            "description",
            "care",
            "video_url",
            "variants",
            "inserts",
            "images",
            "seo_title",
            "seo_description",
        )
