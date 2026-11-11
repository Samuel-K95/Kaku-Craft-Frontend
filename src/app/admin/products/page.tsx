'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, PackageMinus, PackagePlus, UploadCloud } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SlideOverForm, adminInputClass, adminLabelClass } from '@/components/admin/SlideOverForm';
import { useAdminStore } from '@/context/AdminStoreContext';
import { api, normalizeError } from '@/lib/api';
import { ApiCategory, ApiProduct } from '@/types/products';
import { AdminProduct, MockCategory, MockColor } from '@/types';

type InnerTab = 'products' | 'categories' | 'colors';

const emptyProduct = (): AdminProduct => ({
  id: `prod-${Date.now()}`,
  name: '',
  description: '',
  price: 0,
  image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
  hoverImage:
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
  categoryId: '',
  colorIds: [],
  stock: 0,
  estimatedDays: 7,
  assignedExpertId: null,
  active: true,
});

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const {
    products: mockProducts,
    categories: mockCategories,
    colors,
    users,
    upsertProduct,
    deleteProduct,
    adjustStock,
    setProductActive,
    upsertCategory,
    deleteCategory,
    upsertColor,
    deleteColor,
  } = useAdminStore();

  const experts = users.filter((u) => u.role === 'EXPERT');
  const [tab, setTab] = useState<InnerTab>('products');
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [catEdit, setCatEdit] = useState<MockCategory | null>(null);
  const [colorEdit, setColorEdit] = useState<MockColor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; name: string } | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');

  // Live queries from backend
  const { data: serverProducts = [] } = useQuery<ApiProduct[]>({
    queryKey: ['admin-products'],
    queryFn: () => api.get<ApiProduct[]>('/products/items/'),
    staleTime: 30 * 1000,
  });

  const { data: serverCategories = [] } = useQuery<ApiCategory[]>({
    queryKey: ['admin-categories'],
    queryFn: () => api.get<ApiCategory[]>('/products/categories/'),
    staleTime: 30 * 1000,
  });

  const products = useMemo(() => {
    if (serverProducts.length > 0) {
      return serverProducts.map((p) => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        image: p.images?.[0]?.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
        hoverImage: p.images?.[1]?.image || p.images?.[0]?.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop',
        categoryId: String(p.category),
        colorIds: [],
        stock: p.status === 'out_of_stock' ? 0 : 5,
        estimatedDays: 4,
        assignedExpertId: null,
        active: p.is_active && p.status === 'active',
      }));
    }
    return mockProducts;
  }, [serverProducts, mockProducts]);

  const categories = useMemo(() => {
    if (serverCategories.length > 0) {
      return serverCategories.map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
      }));
    }
    return mockCategories;
  }, [serverCategories, mockCategories]);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );
  const colorMap = useMemo(() => Object.fromEntries(colors.map((c) => [c.id, c])), [colors]);
  const expertMap = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (p: AdminProduct) => {
      const catId = parseInt(p.categoryId, 10);
      const payload = {
        name: p.name,
        category: !isNaN(catId) ? catId : (serverCategories[0]?.id || 1),
        description: p.description,
        price: p.price,
        size: 'One Size',
        status: p.stock > 0 ? 'active' : 'out_of_stock',
      };
      const created = await api.post<ApiProduct>('/products/items/', payload);

      if (imageFile && created.slug) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('is_primary', 'true');
        await api.upload(`/products/items/${created.slug}/images/`, formData);
      }
      return created;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditing(null);
      setImageFile(null);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (cat: { name: string; slug?: string }) =>
      api.post<ApiCategory>('/products/categories/', {
        name: cat.name,
        description: '',
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatEdit(null);
    },
  });

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!editing || !editing.name) return;

    try {
      await createProductMutation.mutateAsync(editing);
    } catch {
      // Fallback to local store mutation
      upsertProduct(editing);
      setEditing(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products Studio"
        description="Create stock, edit items, manage categories and colors, and assign artisans."
        actions={
          tab === 'products' ? (
            <button
              type="button"
              onClick={() => {
                setEditing({
                  ...emptyProduct(),
                  categoryId: categories[0]?.id || '',
                  assignedExpertId: experts[0]?.id || null,
                });
                setImageFile(null);
                setFormError('');
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B85D43] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Product
            </button>
          ) : tab === 'categories' ? (
            <button
              type="button"
              onClick={() =>
                setCatEdit({ id: `cat-${Date.now()}`, name: '', slug: '' })
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B85D43] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Category
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setColorEdit({ id: `col-${Date.now()}`, name: '', hex: '#D4A373' })
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2C302E] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#B85D43] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Color
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#EFEBE4]/85 border border-[#EFEBE4] mb-6">
        {(
          [
            ['products', 'Products'],
            ['categories', 'Categories'],
            ['colors', 'Colors'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors ${
              tab === id ? 'bg-[#B85D43] text-white shadow-sm' : 'text-[#2C302E]/70 hover:bg-[#FDFBF7]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p.id}
              className={`rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] p-5 sm:p-6 hover:border-[#D4A373]/50 transition-all shadow-sm ${
                !p.active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row gap-5">
                <div className="relative w-full md:w-24 h-28 rounded-t-[32px] rounded-b-[14px] overflow-hidden shrink-0 bg-[#EFEBE4]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C302E]">{p.name}</h3>
                      <p className="text-xs font-medium text-[#2C302E]/50 mt-1">
                        {categoryMap[p.categoryId]?.name || 'Crochet Piece'} · ${p.price} ·{' '}
                        {p.estimatedDays} days ETA
                      </p>
                    </div>
                    <p className="font-mono text-sm font-bold text-[#2C302E]">
                      Stock: {p.stock}
                      {!p.active && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-[#B85D43]">
                          Out of stock
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.colorIds.map((cid) => (
                      <span
                        key={cid}
                        className="w-5 h-5 rounded-full border border-black/10"
                        style={{ backgroundColor: colorMap[cid]?.hex || '#ccc' }}
                        title={colorMap[cid]?.name}
                      />
                    ))}
                    <span className="text-xs font-medium text-[#2C302E]/50 ml-2">
                      Expert:{' '}
                      {p.assignedExpertId
                        ? expertMap[p.assignedExpertId]?.fullName || '—'
                        : 'Addis Artisan'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...p })}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 hover:bg-[#EFEBE4]"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustStock(p.id, 1)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 hover:bg-[#EFEBE4]"
                    >
                      <PackagePlus className="w-3 h-3" /> Add Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        adjustStock(p.id, -1);
                        if (p.stock <= 1) setProductActive(p.id, false);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 hover:bg-[#EFEBE4]"
                    >
                      <PackageMinus className="w-3 h-3" /> Remove Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete({ type: 'product', id: p.id, name: p.name })}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#B85D43] border border-[#B85D43]/20 hover:bg-[#B85D43]/10"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'categories' && (
        <div className="rounded-[28px] border border-[#EFEBE4] bg-[#FDFBF7] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EFEBE4] text-[10px] uppercase tracking-widest font-bold text-[#2C302E]/50">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-[#EFEBE4]/70 last:border-0">
                  <td className="px-6 py-4 font-serif text-lg font-bold">{c.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{c.slug}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setCatEdit({ ...c })}
                      className="px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10 hover:bg-[#EFEBE4]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({ type: 'category', id: c.id, name: c.name })
                      }
                      className="px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#B85D43] border border-[#B85D43]/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'colors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c) => (
            <div
              key={c.id}
              className="rounded-[24px] border border-[#EFEBE4] bg-[#FDFBF7] p-5 flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="font-serif text-lg font-bold">{c.name}</p>
                  <p className="font-mono text-xs text-[#2C302E]/50">{c.hex}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setColorEdit({ ...c })}
                  className="px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-[#2C302E]/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete({ type: 'color', id: c.id, name: c.name })}
                  className="px-3 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#B85D43] border border-[#B85D43]/20"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Product Editor */}
      <SlideOverForm
        open={!!editing}
        title={editing && products.some((p) => p.id === editing.id) ? 'Edit Product' : 'New Product'}
        onClose={() => setEditing(null)}
        widthClass="max-w-xl"
      >
        {editing && (
          <form className="space-y-5" onSubmit={saveProduct}>
            {formError && (
              <div className="rounded-2xl bg-[#B85D43]/10 border border-[#B85D43]/20 px-4 py-3 text-xs font-bold text-[#B85D43]">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <label className={adminLabelClass}>Name</label>
              <input
                className={adminInputClass}
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={adminLabelClass}>Description</label>
              <textarea
                className={adminInputClass}
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={adminLabelClass}>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className={adminInputClass}
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className={adminLabelClass}>Stock</label>
                <input
                  type="number"
                  className={adminInputClass}
                  value={editing.stock}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      stock: Number(e.target.value),
                      active: Number(e.target.value) > 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={adminLabelClass}>Category</label>
              <select
                className={adminInputClass}
                value={editing.categoryId}
                onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className={adminLabelClass}>Product Photo</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 border border-[#2C302E]/15 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#EFEBE4]">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {imageFile && (
                  <span className="text-xs font-mono text-[#52796F] truncate">{imageFile.name}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="w-full py-3.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-[#9c4d37] transition-colors disabled:opacity-50"
            >
              {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        )}
      </SlideOverForm>

      {/* Slide-over Category Editor */}
      <SlideOverForm
        open={!!catEdit}
        title="Category"
        onClose={() => setCatEdit(null)}
      >
        {catEdit && (
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await createCategoryMutation.mutateAsync({ name: catEdit.name });
              } catch {
                upsertCategory(catEdit);
                setCatEdit(null);
              }
            }}
          >
            <div className="space-y-2">
              <label className={adminLabelClass}>Category Name</label>
              <input
                className={adminInputClass}
                value={catEdit.name}
                onChange={(e) => setCatEdit({ ...catEdit, name: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className="w-full py-3.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
            >
              Save Category
            </button>
          </form>
        )}
      </SlideOverForm>

      {/* Slide-over Color Editor */}
      <SlideOverForm open={!!colorEdit} title="Color" onClose={() => setColorEdit(null)}>
        {colorEdit && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              upsertColor(colorEdit);
              setColorEdit(null);
            }}
          >
            <div className="space-y-2">
              <label className={adminLabelClass}>Name</label>
              <input
                className={adminInputClass}
                value={colorEdit.name}
                onChange={(e) => setColorEdit({ ...colorEdit, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className={adminLabelClass}>Hex</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={colorEdit.hex}
                  onChange={(e) => setColorEdit({ ...colorEdit, hex: e.target.value })}
                  className="w-12 h-12 rounded-xl border border-[#EFEBE4] bg-transparent"
                />
                <input
                  className={adminInputClass}
                  value={colorEdit.hex}
                  onChange={(e) => setColorEdit({ ...colorEdit, hex: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#B85D43] text-white text-[10px] uppercase tracking-widest font-bold"
            >
              Save Color
            </button>
          </form>
        )}
      </SlideOverForm>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete"
        message={
          confirmDelete
            ? `Delete "${confirmDelete.name}"?`
            : ''
        }
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.type === 'product') deleteProduct(confirmDelete.id);
          if (confirmDelete.type === 'category') deleteCategory(confirmDelete.id);
          if (confirmDelete.type === 'color') deleteColor(confirmDelete.id);
          setConfirmDelete(null);
        }}
      />
    </div>
  );
}
