import { useEffect, useState } from 'react';
import { ApiError, fetchProducts } from '../api/products.api';
import { useProductsStore } from '../store/products.store';
import type { PaginationMeta, Product } from '../types/product';

interface UseProductsResult {
  products: Product[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  /** Force un rechargement (utile pour un bouton « Réessayer »). */
  reload: () => void;
}

/**
 * Hook de récupération des produits.
 *
 * Réagit aux changements de pagination/filtres du store, annule les requêtes
 * obsolètes (AbortController) pour éviter les « race conditions », et expose
 * un état loading/error propre à l'UI.
 */
export function useProducts(): UseProductsResult {
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const category = useProductsStore((s) => s.category);
  const stock_status = useProductsStore((s) => s.stock_status);

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setIsLoading(true);
    setError(null);

    fetchProducts({ page, limit, category, stock_status }, controller.signal)
      .then((response) => {
        if (!active) return;
        setProducts(response.data);
        setMeta(response.meta);
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return;
        const message =
          err instanceof ApiError
            ? err.message
            : 'Impossible de contacter le serveur. Réessayez.';
        setError(message);
        setProducts([]);
        setMeta(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, limit, category, stock_status, reloadToken]);

  return {
    products,
    meta,
    isLoading,
    error,
    reload: () => setReloadToken((t) => t + 1),
  };
}
