"""Демо-данные для разработки: категории, коллекции и ~12 изделий на трёх языках.

    python manage.py seed_demo

Повторный запуск не создаёт дублей (update_or_create по slug / артикулу).
"""

from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Category, Collection, Product, ProductInsert, ProductVariant, Stone

CATEGORIES = [
    ("rings", "Uzuklar", "Кольца", "Rings"),
    ("earrings", "Sirg'alar", "Серьги", "Earrings"),
    ("pendants", "Kulonlar", "Подвески", "Pendants"),
    ("bracelets", "Bilaguzuklar", "Браслеты", "Bracelets"),
]
CHILDREN = [("wedding-rings", "rings", "Nikoh uzuklari", "Обручальные кольца", "Wedding rings")]
COLLECTIONS = [
    ("samarkand", "Samarqand", "Самарканд", "Samarkand"),
    ("bridal", "Kelinlik", "Свадебная", "Bridal"),
]
STONES = [
    ("diamond", "Olmos", "Бриллиант", "Diamond"),
    ("sapphire", "Sapfir", "Сапфир", "Sapphire"),
    ("cubic-zirconia", "Fianit", "Фианит", "Cubic zirconia"),
]
# sku, категория, коллекция, (uz, ru, en), металл, цвет, проба, камень, размеры, базовая цена
PRODUCTS = [
    (
        "SZ-R-001",
        "rings",
        "samarkand",
        ("Samarqand uzugi", "Кольцо «Самарканд»", "Samarkand ring"),
        "gold",
        "yellow",
        585,
        "diamond",
        ["16", "17", "18"],
        6_800_000,
    ),
    (
        "SZ-R-002",
        "rings",
        None,
        ("Klassik uzuk", "Кольцо классическое", "Classic ring"),
        "gold",
        "red",
        585,
        None,
        ["16.5", "17.5"],
        3_200_000,
    ),
    (
        "SZ-R-003",
        "rings",
        "bridal",
        ("Sapfirli uzuk", "Кольцо с сапфиром", "Sapphire ring"),
        "gold",
        "white",
        750,
        "sapphire",
        ["16", "17"],
        12_400_000,
    ),
    (
        "SZ-W-001",
        "wedding-rings",
        "bridal",
        ("Nikoh uzugi", "Обручальное кольцо", "Wedding band"),
        "gold",
        "yellow",
        585,
        None,
        ["17", "18", "19", "20"],
        2_900_000,
    ),
    (
        "SZ-W-002",
        "wedding-rings",
        "bridal",
        ("Olmosli nikoh uzugi", "Обручальное кольцо с бриллиантом", "Diamond wedding band"),
        "gold",
        "white",
        585,
        "diamond",
        ["16", "17"],
        5_600_000,
    ),
    (
        "SZ-E-001",
        "earrings",
        "samarkand",
        ("Samarqand sirg'alari", "Серьги «Самарканд»", "Samarkand earrings"),
        "gold",
        "yellow",
        585,
        "cubic-zirconia",
        [""],
        4_100_000,
    ),
    (
        "SZ-E-002",
        "earrings",
        None,
        ("Kichik sirg'alar", "Серьги-пусеты", "Stud earrings"),
        "gold",
        "white",
        585,
        "diamond",
        [""],
        7_300_000,
    ),
    (
        "SZ-E-003",
        "earrings",
        None,
        ("Kumush sirg'alar", "Серьги серебряные", "Silver earrings"),
        "silver",
        "white",
        925,
        "cubic-zirconia",
        [""],
        650_000,
    ),
    (
        "SZ-P-001",
        "pendants",
        "samarkand",
        ("Lola kulon", "Подвеска «Лола»", "Lola pendant"),
        "gold",
        "red",
        585,
        None,
        [""],
        1_900_000,
    ),
    (
        "SZ-P-002",
        "pendants",
        None,
        ("Yurak kulon", "Подвеска «Сердце»", "Heart pendant"),
        "gold",
        "combined",
        585,
        "cubic-zirconia",
        [""],
        2_300_000,
    ),
    (
        "SZ-B-001",
        "bracelets",
        None,
        ("Zanjir bilaguzuk", "Браслет-цепь", "Chain bracelet"),
        "gold",
        "yellow",
        585,
        None,
        ["17", "18", "19"],
        5_200_000,
    ),
    (
        "SZ-B-002",
        "bracelets",
        "bridal",
        ("Tennis bilaguzuk", "Теннисный браслет", "Tennis bracelet"),
        "gold",
        "white",
        750,
        "diamond",
        ["17", "18"],
        24_500_000,
    ),
]


def tr(uz, ru, en, field="name"):
    return {f"{field}_uz": uz, f"{field}_ru": ru, f"{field}_en": en}


class Command(BaseCommand):
    help = "Заполнить каталог демо-данными (для разработки и тестовых карточек)"

    @transaction.atomic
    def handle(self, *args, **opts):
        cats = {}
        for i, (slug, uz, ru, en) in enumerate(CATEGORIES):
            cats[slug], _ = Category.objects.update_or_create(
                slug=slug, defaults={**tr(uz, ru, en), "sort_order": i}
            )
        for slug, parent, uz, ru, en in CHILDREN:
            cats[slug], _ = Category.objects.update_or_create(
                slug=slug, defaults={**tr(uz, ru, en), "parent": cats[parent]}
            )
        cols = {}
        for slug, uz, ru, en in COLLECTIONS:
            cols[slug], _ = Collection.objects.update_or_create(slug=slug, defaults=tr(uz, ru, en))
        stones = {}
        for slug, uz, ru, en in STONES:
            stones[slug], _ = Stone.objects.update_or_create(slug=slug, defaults=tr(uz, ru, en))

        for n, (sku, cat, col, names, metal, color, purity, stone, sizes, price) in enumerate(
            PRODUCTS
        ):
            product, _ = Product.objects.update_or_create(
                sku=sku,
                defaults={
                    **tr(*names),
                    **tr(
                        "Qo'lda ishlangan zargarlik buyumi.",
                        "Ювелирное изделие ручной работы.",
                        "Handcrafted jewelry piece.",
                        field="description",
                    ),
                    "slug": sku.lower(),
                    "category": cats[cat],
                    "collection": cols.get(col),
                    "metal": metal,
                    "metal_color": color,
                    "purity": purity,
                    "is_new": n % 4 == 0,
                },
            )
            for k, size in enumerate(sizes):
                vprice = Decimal(price) + Decimal(k * 150_000)
                ProductVariant.objects.update_or_create(
                    sku=f"{sku}-{size}" if size else sku,
                    defaults={
                        "product": product,
                        "size": size,
                        "price": vprice,
                        "old_price": vprice * Decimal("1.15") if n % 5 == 0 else None,
                        "weight": Decimal("2.10") + Decimal(k) / 4,
                        "stock": 0 if n == 2 else 3 + k,
                    },
                )
            if stone:
                ProductInsert.objects.get_or_create(
                    product=product, stone=stones[stone], defaults={"count": 1}
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Готово: {Category.objects.count()} категорий, {Product.objects.count()} изделий"
            )
        )
