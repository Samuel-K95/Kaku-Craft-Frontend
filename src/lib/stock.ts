import { AdminProduct, FulfillmentType, MockOrder, MockOrderItem, Product } from '@/types';

/** In-stock items ship quickly after payment is verified. */
export const IN_STOCK_MIN_DAYS = 1;
export const IN_STOCK_MAX_DAYS = 2;

export type AvailabilityFilter = 'all' | 'in_stock' | 'pre_order';

export function isInStock(product: Pick<Product, 'stock'> | Pick<AdminProduct, 'stock'>): boolean {
  return (product.stock ?? 0) > 0;
}

export function promisedDaysForProduct(
  product: Pick<Product, 'stock' | 'productionDays'> | Pick<AdminProduct, 'stock' | 'estimatedDays'>
): number {
  if (isInStock(product)) return IN_STOCK_MAX_DAYS;
  if ('productionDays' in product) return product.productionDays || 14;
  return product.estimatedDays || 14;
}

export function buildOrderItem(
  product: Product | AdminProduct,
  quantity: number
): MockOrderItem {
  const inStock = isInStock(product);
  const days =
    'productionDays' in product
      ? promisedDaysForProduct(product as Product)
      : promisedDaysForProduct(product as AdminProduct);
  return {
    productId: product.id,
    quantity,
    fulfillment: inStock ? 'in_stock' : 'pre_order',
    promisedDays: days,
  };
}

export function orderFulfillmentType(items: MockOrderItem[]): FulfillmentType {
  const hasIn = items.some((i) => i.fulfillment === 'in_stock');
  const hasPre = items.some((i) => i.fulfillment === 'pre_order');
  if (hasIn && hasPre) return 'mixed';
  if (hasPre) return 'pre_order';
  return 'in_stock';
}

export function orderMaxPromisedDays(order: Pick<MockOrder, 'items'>): number {
  return Math.max(0, ...order.items.map((i) => i.promisedDays));
}

export function fulfillmentLabel(type: FulfillmentType): string {
  switch (type) {
    case 'in_stock':
      return 'In Stock';
    case 'pre_order':
      return 'Pre-Order';
    case 'mixed':
      return 'Mixed';
  }
}

export function availabilityLabel(product: Product): string {
  if (isInStock(product)) return 'In Stock';
  return 'Pre-Order';
}

export function deliveryLabel(product: Product): string {
  if (isInStock(product)) {
    return `Ready in ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days`;
  }
  return `Made in about ${product.productionDays} days`;
}

export function cartCtaLabel(product: Product): string {
  return isInStock(product) ? 'Add to Cart' : 'Pre-Order';
}

/** Longest wait among cart lines (for checkout summary). */
export function cartMaxWaitDays(
  items: { product: Product; quantity: number }[]
): { maxDays: number; hasPreOrder: boolean; hasInStock: boolean } {
  let maxDays = 0;
  let hasPreOrder = false;
  let hasInStock = false;

  for (const item of items) {
    if (isInStock(item.product)) {
      hasInStock = true;
      maxDays = Math.max(maxDays, IN_STOCK_MAX_DAYS);
    } else {
      hasPreOrder = true;
      maxDays = Math.max(maxDays, item.product.productionDays || 14);
    }
  }

  return { maxDays, hasPreOrder, hasInStock };
}

export function cartFulfillmentNote(
  items: { product: Product; quantity: number }[]
): string {
  const { maxDays, hasPreOrder, hasInStock } = cartMaxWaitDays(items);
  if (!items.length) return '';

  if (hasPreOrder && hasInStock) {
    return `Mixed cart: in-stock items ship in ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days. Pre-order items take up to about ${maxDays} days after your deposit is verified.`;
  }
  if (hasPreOrder) {
    return `Pre-order: making starts after your 50% deposit is verified. Expect about ${maxDays} days.`;
  }
  return `In stock: ready in ${IN_STOCK_MIN_DAYS}–${IN_STOCK_MAX_DAYS} days after your 50% deposit is verified. Remaining 50% is paid on delivery.`;
}
