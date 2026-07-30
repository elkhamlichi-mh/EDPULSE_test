import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

/**
 * Grille de produits gérant les 4 états : chargement, erreur, vide, données.
 */
export function ProductList({
  products,
  isLoading,
  error,
  onRetry,
}: ProductListProps) {
  if (isLoading) {
    return (
      <div className="grid" aria-busy="true" aria-live="polite">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card card--skeleton" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <p>⚠️ {error}</p>
        <button type="button" className="btn" onClick={onRetry}>
          Réessayer
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="state state--empty">
        <p>Aucun produit ne correspond à ces critères.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
