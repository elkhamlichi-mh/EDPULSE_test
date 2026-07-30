import { useProductsStore } from '../store/products.store';
import {
  CATEGORIES,
  STOCK_STATUS_LABELS,
  type StockStatus,
} from '../types/product';

const STOCK_OPTIONS = Object.entries(STOCK_STATUS_LABELS) as [
  StockStatus,
  string,
][];

/**
 * Barre de filtres : catégorie et statut de stock (dropdowns).
 * Modifier un filtre remet automatiquement la pagination à la page 1 (store).
 */
export function Filters() {
  const category = useProductsStore((s) => s.category);
  const stockStatus = useProductsStore((s) => s.stock_status);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setStockStatus = useProductsStore((s) => s.setStockStatus);
  const resetFilters = useProductsStore((s) => s.resetFilters);

  const hasActiveFilter = Boolean(category || stockStatus);

  return (
    <div className="filters">
      <div className="filters__field">
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          value={category ?? ''}
          onChange={(e) => setCategory(e.target.value || undefined)}
        >
          <option value="">Toutes</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label htmlFor="stock">Statut de stock</label>
        <select
          id="stock"
          value={stockStatus ?? ''}
          onChange={(e) =>
            setStockStatus((e.target.value as StockStatus) || undefined)
          }
        >
          <option value="">Tous</option>
          {STOCK_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="filters__reset"
        onClick={resetFilters}
        disabled={!hasActiveFilter}
      >
        Réinitialiser
      </button>
    </div>
  );
}
