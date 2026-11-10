import django_filters as df
from django.db.models import Q

from .models import Category, Product


class ProductFilter(df.FilterSet):
    category = df.CharFilter(method="filter_category", label="slug категории (с подкатегориями)")
    collection = df.CharFilter(field_name="collection__slug")
    metal = df.MultipleChoiceFilter(choices=Product.Metal.choices)
    metal_color = df.MultipleChoiceFilter(choices=Product.MetalColor.choices)
    gender = df.MultipleChoiceFilter(choices=Product.Gender.choices)
    purity = df.BaseInFilter(field_name="purity")
    stone = df.BaseInFilter(field_name="inserts__stone__slug", distinct=True)
    size = df.BaseInFilter(field_name="variants__size", distinct=True)
    price_min = df.NumberFilter(field_name="price_from", lookup_expr="gte")
    price_max = df.NumberFilter(field_name="price_from", lookup_expr="lte")
    in_stock = df.BooleanFilter(method="filter_in_stock")
    is_new = df.BooleanFilter()

    class Meta:
        model = Product
        fields: list[str] = []

    def filter_category(self, qs, name, value):
        slugs = [value]
        frontier = [value]
        # Подкатегории (дерево неглубокое, 2–3 уровня)
        while frontier:
            children = list(
                Category.objects.filter(parent__slug__in=frontier).values_list("slug", flat=True)
            )
            slugs += children
            frontier = children
        return qs.filter(category__slug__in=slugs)

    def filter_in_stock(self, qs, name, value):
        cond = Q(total_stock__gt=0)
        return qs.filter(cond) if value else qs.exclude(cond)
