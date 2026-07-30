import { Inject, Injectable } from '@nestjs/common';
import { CacheService } from '../common/cache/cache.service';
import {
  buildPaginationMeta,
  PaginatedResponse,
} from '../common/dto/paginated-response.dto';
import { Product } from './domain/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from './domain/product-repository.interface';
import { QueryProductsDto } from './dto/query-products.dto';

/**
 * Orchestration métier des produits.
 *
 * Dépend d'abstractions (ProductRepository, CacheService) et non
 * d'implémentations concrètes → Dependency Inversion Principle.
 *
 * Le cache est indexé par la combinaison exacte (page, limit, filtres),
 * comme demandé dans l'énoncé.
 */
@Injectable()
export class ProductsService {
  /** TTL du cache produits : 60 s. */
  private readonly cacheTtlMs = 60_000;

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
    private readonly cache: CacheService,
  ) {}

  findAll(query: QueryProductsDto): PaginatedResponse<Product> {
    const criteria = {
      page: query.page,
      limit: query.limit,
      category: query.category,
      stock_status: query.stock_status,
    };

    const cacheKey = this.buildCacheKey(criteria);

    return this.cache.wrap(
      cacheKey,
      () => {
        const { items, total } = this.repository.findAll(criteria);
        return {
          data: items,
          meta: buildPaginationMeta(criteria.page, criteria.limit, total),
        };
      },
      this.cacheTtlMs,
    );
  }

  /**
   * Construit une clé de cache déterministe et normalisée à partir des
   * critères. Les filtres absents sont représentés par '*' pour éviter
   * toute collision entre « pas de filtre » et une valeur vide.
   */
  private buildCacheKey(criteria: {
    page: number;
    limit: number;
    category?: string;
    stock_status?: string;
  }): string {
    const category = (criteria.category ?? '*').toLowerCase();
    const stock = criteria.stock_status ?? '*';
    return `products:page=${criteria.page}:limit=${criteria.limit}:category=${category}:stock=${stock}`;
  }
}
