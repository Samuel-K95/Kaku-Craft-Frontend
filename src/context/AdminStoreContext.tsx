'use client';

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import {
  AdminProduct,
  AdminRole,
  AdminUser,
  CmsContent,
  MockCategory,
  MockColor,
  MockDiscount,
  MockOrder,
  OrderStatus,
} from '@/types';
import {
  ADMIN_CATEGORIES,
  ADMIN_CMS,
  ADMIN_COLORS,
  ADMIN_DISCOUNTS,
  ADMIN_ORDERS,
  ADMIN_PRODUCTS,
  ADMIN_USERS,
  CURRENT_ADMIN_ID,
} from '@/data/admin/seed';

interface AdminStoreValue {
  currentAdmin: AdminUser;
  users: AdminUser[];
  categories: MockCategory[];
  colors: MockColor[];
  products: AdminProduct[];
  orders: MockOrder[];
  cms: CmsContent;
  discounts: MockDiscount[];
  setUserRole: (userId: string, role: AdminRole) => void;
  upsertCategory: (category: MockCategory) => void;
  deleteCategory: (id: string) => void;
  upsertColor: (color: MockColor) => void;
  deleteColor: (id: string) => void;
  upsertProduct: (product: AdminProduct) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  setProductActive: (id: string, active: boolean) => void;
  updateOrder: (id: string, patch: Partial<MockOrder>) => void;
  setCms: (cms: CmsContent) => void;
  upsertDiscount: (discount: MockDiscount) => void;
  deleteDiscount: (id: string) => void;
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [categories, setCategories] = useState<MockCategory[]>(ADMIN_CATEGORIES);
  const [colors, setColors] = useState<MockColor[]>(ADMIN_COLORS);
  const [products, setProducts] = useState<AdminProduct[]>(ADMIN_PRODUCTS);
  const [orders, setOrders] = useState<MockOrder[]>(ADMIN_ORDERS);
  const [cms, setCms] = useState<CmsContent>(ADMIN_CMS);
  const [discounts, setDiscounts] = useState<MockDiscount[]>(ADMIN_DISCOUNTS);

  const currentAdmin = useMemo(
    () => users.find((u) => u.id === CURRENT_ADMIN_ID) ?? users[0],
    [users]
  );

  const setUserRole = useCallback((userId: string, role: AdminRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  }, []);

  const upsertCategory = useCallback((category: MockCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const upsertColor = useCallback((color: MockColor) => {
    setColors((prev) => {
      const exists = prev.some((c) => c.id === color.id);
      return exists ? prev.map((c) => (c.id === color.id ? color : c)) : [...prev, color];
    });
  }, []);

  const deleteColor = useCallback((id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const upsertProduct = useCallback((product: AdminProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [...prev, product];
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const adjustStock = useCallback((id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  }, []);

  const setProductActive = useCallback((id: string, active: boolean) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
  }, []);

  const updateOrder = useCallback((id: string, patch: Partial<MockOrder>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }, []);

  const upsertDiscount = useCallback((discount: MockDiscount) => {
    setDiscounts((prev) => {
      const exists = prev.some((d) => d.id === discount.id);
      return exists
        ? prev.map((d) => (d.id === discount.id ? discount : d))
        : [...prev, discount];
    });
  }, []);

  const deleteDiscount = useCallback((id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const value: AdminStoreValue = {
    currentAdmin,
    users,
    categories,
    colors,
    products,
    orders,
    cms,
    discounts,
    setUserRole,
    upsertCategory,
    deleteCategory,
    upsertColor,
    deleteColor,
    upsertProduct,
    deleteProduct,
    adjustStock,
    setProductActive,
    updateOrder,
    setCms,
    upsertDiscount,
    deleteDiscount,
  };

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
};

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used within AdminStoreProvider');
  return ctx;
}

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending_payment':
      return 'Pending';
    case 'payment_submitted':
      return 'Prepayment Paid';
    case 'payment_verified':
      return 'Verified';
    case 'in_progress':
      return 'In Progress';
    case 'delivered':
      return 'Delivered';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export const ROLE_LADDER: AdminRole[] = ['USER', 'EXPERT', 'ADMIN'];

export function nextRole(role: AdminRole): AdminRole | null {
  const i = ROLE_LADDER.indexOf(role);
  if (i < 0 || i >= ROLE_LADDER.length - 1) return null;
  return ROLE_LADDER[i + 1];
}

export function prevRole(role: AdminRole): AdminRole | null {
  const i = ROLE_LADDER.indexOf(role);
  if (i <= 0) return null;
  return ROLE_LADDER[i - 1];
}
