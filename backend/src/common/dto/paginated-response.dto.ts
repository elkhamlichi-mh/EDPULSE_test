/**
 * Métadonnées de pagination renvoyées avec chaque page de résultats.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number; // total d'éléments après filtrage
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Enveloppe générique de réponse paginée.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Construit les métadonnées de pagination de façon cohérente.
 */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
