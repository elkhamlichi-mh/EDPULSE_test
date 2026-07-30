import { Injectable } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import {
  FindProductsCriteria,
  PaginatedProducts,
  ProductRepository,
} from '../domain/product-repository.interface';
import { PRODUCTS_SEED } from './products.seed';

/**
 * Implémentation en mémoire du ProductRepository.
 * Responsabilité unique : filtrer + paginer le tableau de produits.
 */
@Injectable()
export class InMemoryProductRepository implements ProductRepository {
  private readonly products: readonly Product[] = PRODUCTS_SEED;

  findAll(criteria: FindProductsCriteria): PaginatedProducts {
    const filtered = this.applyFilters(this.products, criteria);
    const total = filtered.length;

    const start = (criteria.page - 1) * criteria.limit;
    const items = filtered.slice(start, start + criteria.limit);

    return { items, total };
  }

  private applyFilters(
    products: readonly Product[],
    { category, stock_status }: FindProductsCriteria,
  ): readonly Product[] {
    return products.filter((product) => {
      if (category && product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (stock_status && product.stock_status !== stock_status) {
        return false;
      }
      return true;
    });
  }
}
