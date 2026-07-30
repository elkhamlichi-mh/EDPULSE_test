import { useProductsStore } from '../store/products.store';
import type { PaginationMeta } from '../types/product';

interface PaginationProps {
  meta: PaginationMeta;
}

/**
 * Contrôles de pagination : Précédent / Suivant + numéros de page.
 * La fenêtre de numéros est bornée pour rester lisible sur mobile.
 */
export function Pagination({ meta }: PaginationProps) {
  const setPage = useProductsStore((s) => s.setPage);
  const { page, totalPages, hasPreviousPage, hasNextPage } = meta;

  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageWindow(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => setPage(page - 1)}
        disabled={!hasPreviousPage}
      >
        ← Précédent
      </button>

      <ul className="pagination__pages">
        {pages.map((p, i) =>
          p === ELLIPSIS ? (
            <li key={`gap-${i}`} className="pagination__ellipsis">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={`pagination__page ${p === page ? 'is-active' : ''}`}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="pagination__btn"
        onClick={() => setPage(page + 1)}
        disabled={!hasNextPage}
      >
        Suivant →
      </button>
    </nav>
  );
}

const ELLIPSIS = -1;

/**
 * Construit une fenêtre de pages compacte autour de la page courante,
 * avec des ellipses (ex : 1 … 4 5 [6] 7 8 … 16).
 */
function buildPageWindow(current: number, total: number): number[] {
  const delta = 1;
  const range: number[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push(ELLIPSIS);
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push(ELLIPSIS);
  if (total > 1) range.push(total);

  return range;
}
