import type { Product } from '../types/product';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  product: Product;
}

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

/** Carte d'affichage d'un produit. */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <div className="card__header">
        <span className="card__category">{product.category}</span>
        <StockBadge status={product.stock_status} />
      </div>
      <h3 className="card__name">{product.name}</h3>
      <div className="card__footer">
        <span className="card__price">{priceFormatter.format(product.price)}</span>
        <span className="card__id">#{product.id}</span>
      </div>
    </article>
  );
}
