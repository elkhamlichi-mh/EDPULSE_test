/** Statut de stock — miroir de l'enum backend. */
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ProductFilters {
  category?: string;
  stock_status?: StockStatus;
}

/** Libellés lisibles pour l'UI. */
export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: 'En stock',
  low_stock: 'Stock faible',
  out_of_stock: 'Rupture',
};

/** Catégories connues (utilisées pour le dropdown de filtre). */
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Books',
  'Home',
] as const;
