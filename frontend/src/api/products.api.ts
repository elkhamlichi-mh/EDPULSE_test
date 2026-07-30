import type {
  PaginatedResponse,
  Product,
  ProductFilters,
} from '../types/product';

/**
 * Base de l'API.
 * - En dev : vide → utilise le proxy Vite (/api → backend).
 * - En prod : définir VITE_API_URL (ex : https://edpulse-api.onrender.com).
 */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export interface FetchProductsParams extends ProductFilters {
  page: number;
  limit: number;
}

/** Erreur applicative portant le message renvoyé par l'API. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Récupère une page de produits depuis GET /api/products.
 * Construit la query string en n'incluant que les filtres réellement définis.
 */
export async function fetchProducts(
  params: FetchProductsParams,
  signal?: AbortSignal,
): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  query.set('page', String(params.page));
  query.set('limit', String(params.limit));
  if (params.category) {
    query.set('category', params.category);
  }
  if (params.stock_status) {
    query.set('stock_status', params.stock_status);
  }

  const response = await fetch(`${API_BASE}/api/products?${query.toString()}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as PaginatedResponse<Product>;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    const raw = body?.message ?? body?.error;
    if (Array.isArray(raw)) {
      return raw.join(', ');
    }
    if (typeof raw === 'string') {
      return raw;
    }
  } catch {
    // corps non-JSON : on retombe sur un message générique
  }
  return `Erreur ${response.status} lors de la récupération des produits.`;
}
