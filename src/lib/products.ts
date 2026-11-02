import { useQuery } from '@tanstack/react-query';
import { ApiCategory, ApiProduct } from '@/types/products';
import { Product, ProductCategory } from '@/types';
import { PRODUCTS } from '@/data/products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function mapApiProductToUiProduct(p: ApiProduct): Product {
  const primaryImage = p.images?.find((img) => img.is_primary)?.image || p.images?.[0]?.image || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80';
  const hoverImage = p.images?.find((img) => !img.is_primary)?.image || p.images?.[1]?.image || primaryImage;

  return {
    id: String(p.id),
    name: p.name,
    category: (p.category_slug as Exclude<ProductCategory, 'all'>) || 'cardigans',
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
    rating: 5,
    reviewsCount: 1,
    tag: p.category_name || 'Handcrafted',
    image: primaryImage,
    hoverImage: hoverImage,
    description: p.description || '',
    yarnType: 'Premium Wool Blend',
    handcraftedHours: 14,
    colorway: ['#D4A373', '#CCD5AE', '#EFEBE4'],
    dimensions: p.size || undefined,
    stock: p.status === 'out_of_stock' ? 0 : 5,
    productionDays: 4,
  };
}

// Server Component / Direct Fetchers
export async function getLiveCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as ApiCategory[];
  } catch {
    return [];
  }
}

export async function getLiveProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.search) {
      query.set('search', params.search);
    }

    const qs = query.toString();
    const url = `${API_BASE_URL}/products/items/${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return PRODUCTS;
    const data = (await res.json()) as ApiProduct[];
    if (!Array.isArray(data) || data.length === 0) {
      return PRODUCTS;
    }
    return data.map(mapApiProductToUiProduct);
  } catch {
    return PRODUCTS;
  }
}

export async function getLiveProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/items/${encodeURIComponent(idOrSlug)}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      const fallback = PRODUCTS.find((p) => p.id === idOrSlug);
      return fallback || null;
    }
    const data = (await res.json()) as ApiProduct;
    return mapApiProductToUiProduct(data);
  } catch {
    return PRODUCTS.find((p) => p.id === idOrSlug) || null;
  }
}

// TanStack Query Client Hooks for Background Revalidation
export function useCategoriesQuery(initialData?: ApiCategory[]) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/products/categories/`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return (await res.json()) as ApiCategory[];
    },
    initialData,
    staleTime: 60 * 1000,
  });
}

export function useProductsQuery(filters?: { category?: string; search?: string }, initialData?: Product[]) {
  return useQuery({
    queryKey: ['products', filters?.category || 'all', filters?.search || ''],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (filters?.category && filters?.category !== 'all') {
        query.set('category', filters.category);
      }
      if (filters?.search) {
        query.set('search', filters.search);
      }
      const qs = query.toString();
      const res = await fetch(`${API_BASE_URL}/products/items/${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = (await res.json()) as ApiProduct[];
      if (!Array.isArray(data) || data.length === 0) {
        return PRODUCTS;
      }
      return data.map(mapApiProductToUiProduct);
    },
    initialData,
    staleTime: 60 * 1000,
  });
}

