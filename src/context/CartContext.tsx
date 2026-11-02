'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getStoredTokens } from '@/lib/api';
import { ApiCart, ApiCartItem } from '@/types/orders';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

export interface LocalCartItem {
  product: Product;
  quantity: number;
  apiItemId?: number;
}

interface CartContextValue {
  items: LocalCartItem[];
  itemCount: number;
  totalPrice: number;
  depositRequired: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, delta: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);

  const hasAuth = !!getStoredTokens()?.access;

  // Live Cart from Django when authenticated
  const { data: serverCart } = useQuery<ApiCart>({
    queryKey: ['cart'],
    queryFn: () => api.get<ApiCart>('/orders/cart/'),
    enabled: hasAuth,
    staleTime: 10 * 1000,
  });

  // Map server items to LocalCartItem format
  const cartItems: LocalCartItem[] = useMemo(() => {
    if (hasAuth && serverCart && Array.isArray(serverCart.items)) {
      return serverCart.items.map((item: ApiCartItem) => {
        const foundProduct =
          PRODUCTS.find((p) => p.id === String(item.product) || p.name === item.product_name) || {
            id: String(item.product),
            name: item.product_name,
            category: 'cardigans',
            price: parseFloat(item.unit_price),
            rating: 5,
            reviewsCount: 1,
            tag: 'Handmade',
            image:
              'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
            hoverImage:
              'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
            description: item.product_name,
            yarnType: 'Wool Blend',
            handcraftedHours: 12,
            colorway: ['#D4A373', '#EFEBE4'],
            stock: 5,
            productionDays: 3,
          };

        return {
          product: foundProduct,
          quantity: item.quantity,
          apiItemId: item.id,
        };
      });
    }
    return localItems;
  }, [hasAuth, serverCart, localItems]);

  const itemCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const depositRequired = useMemo(() => totalPrice * 0.5, [totalPrice]);

  const addMutation = useMutation({
    mutationFn: (vars: { productId: number; quantity: number }) =>
      api.post('/orders/cart/items/', {
        product_id: vars.productId,
        quantity: vars.quantity,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { itemId: number; quantity: number }) =>
      api.patch(`/orders/cart/items/${vars.itemId}/`, {
        quantity: vars.quantity,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => api.delete(`/orders/cart/items/${itemId}/`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const addToCart = useCallback(
    async (product: Product, quantity = 1) => {
      const numId = parseInt(product.id, 10);
      if (hasAuth && !isNaN(numId)) {
        await addMutation.mutateAsync({ productId: numId, quantity });
      } else {
        setLocalItems((prev) => {
          const idx = prev.findIndex((i) => i.product.id === product.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
            return next;
          }
          return [...prev, { product, quantity }];
        });
      }
      setIsCartOpen(true);
    },
    [hasAuth, addMutation]
  );

  const updateQuantity = useCallback(
    async (productId: string, delta: number) => {
      const item = cartItems.find((i) => i.product.id === productId);
      if (!item) return;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        if (hasAuth && item.apiItemId) {
          await deleteMutation.mutateAsync(item.apiItemId);
        } else {
          setLocalItems((prev) => prev.filter((i) => i.product.id !== productId));
        }
      } else {
        if (hasAuth && item.apiItemId) {
          await updateMutation.mutateAsync({ itemId: item.apiItemId, quantity: newQty });
        } else {
          setLocalItems((prev) =>
            prev.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
          );
        }
      }
    },
    [cartItems, hasAuth, deleteMutation, updateMutation]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const item = cartItems.find((i) => i.product.id === productId);
      if (!item) return;

      if (hasAuth && item.apiItemId) {
        await deleteMutation.mutateAsync(item.apiItemId);
      } else {
        setLocalItems((prev) => prev.filter((i) => i.product.id !== productId));
      }
    },
    [cartItems, hasAuth, deleteMutation]
  );

  const clearCart = useCallback(() => {
    setLocalItems([]);
    if (hasAuth) {
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  }, [hasAuth, queryClient]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const value = useMemo(
    () => ({
      items: cartItems,
      itemCount,
      totalPrice,
      depositRequired,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      cartItems,
      itemCount,
      totalPrice,
      depositRequired,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
