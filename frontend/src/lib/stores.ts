"use client";

import { useSyncExternalStore } from "react";

// Корзина и избранное в localStorage (ADR-0009). Хранятся только ID, без цен.
// Синхронизация между вкладками — через событие storage.

function createStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; value: T } | null = null;

  function read(): T {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      raw = null;
    }
    if (cache && cache.raw === raw) return cache.value;
    let value = fallback;
    try {
      value = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      value = fallback;
    }
    cache = { raw, value };
    return value;
  }

  function write(value: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // приватный режим / запрет хранилища — корзина живёт до перезагрузки
      cache = { raw: JSON.stringify(value), value };
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === key && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => fallback);
  }

  return { read, write, useValue };
}

// --- Корзина ---

export type CartItem = { variant_id: number; quantity: number };
export const MAX_QTY = 10;

const cartStore = createStore<CartItem[]>("sz-cart", []);
export const useCart = cartStore.useValue;

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function addToCart(variantId: number, quantity = 1) {
  const items = [...cartStore.read()];
  const existing = items.find((i) => i.variant_id === variantId);
  if (existing) {
    const next = { ...existing, quantity: Math.min(existing.quantity + quantity, MAX_QTY) };
    items[items.indexOf(existing)] = next;
  } else {
    items.push({ variant_id: variantId, quantity: Math.min(quantity, MAX_QTY) });
  }
  cartStore.write(items);
}

export function setQuantity(variantId: number, quantity: number) {
  if (quantity <= 0) return removeFromCart(variantId);
  cartStore.write(
    cartStore
      .read()
      .map((i) =>
        i.variant_id === variantId ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i,
      ),
  );
}

export function removeFromCart(variantId: number) {
  cartStore.write(cartStore.read().filter((i) => i.variant_id !== variantId));
}

export function clearCart() {
  cartStore.write([]);
}

// --- Избранное ---

const favStore = createStore<string[]>("sz-favorites", []);
export const useFavorites = favStore.useValue;

export function toggleFavorite(slug: string) {
  const list = favStore.read();
  favStore.write(list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
}
