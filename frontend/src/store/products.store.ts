import { create } from 'zustand';
import type { StockStatus } from '../types/product';

const DEFAULT_LIMIT = 12;

interface ProductsQueryState {
  page: number;
  limit: number;
  category?: string;
  stock_status?: StockStatus;

  // Actions — modifier un filtre remet la page à 1 pour rester cohérent.
  setCategory: (category?: string) => void;
  setStockStatus: (status?: StockStatus) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

/**
 * Source de vérité de la requête courante (pagination + filtres).
 * Découplée de la logique de fetch (assurée par le hook useProducts),
 * ce qui rend l'état facilement testable et partageable entre composants.
 */
export const useProductsStore = create<ProductsQueryState>((set) => ({
  page: 1,
  limit: DEFAULT_LIMIT,
  category: undefined,
  stock_status: undefined,

  setCategory: (category) =>
    set({ category: category || undefined, page: 1 }),

  setStockStatus: (stock_status) =>
    set({ stock_status: stock_status || undefined, page: 1 }),

  setPage: (page) => set({ page: Math.max(1, page) }),

  setLimit: (limit) => set({ limit, page: 1 }),

  resetFilters: () =>
    set({ category: undefined, stock_status: undefined, page: 1 }),
}));
