import { CacheService } from '../common/cache/cache.service';
import { Product, StockStatus } from './domain/product.entity';
import {
  FindProductsCriteria,
  ProductRepository,
} from './domain/product-repository.interface';
import { QueryProductsDto } from './dto/query-products.dto';
import { ProductsService } from './products.service';

function makeQuery(partial: Partial<QueryProductsDto> = {}): QueryProductsDto {
  const q = new QueryProductsDto();
  return Object.assign(q, partial);
}

const SAMPLE: Product = {
  id: 1,
  name: 'Test',
  category: 'Electronics',
  price: 10,
  stock_status: StockStatus.IN_STOCK,
};

describe('ProductsService', () => {
  let cache: CacheService;
  let repository: ProductRepository & { findAll: jest.Mock };
  let service: ProductsService;

  beforeEach(() => {
    cache = new CacheService();
    repository = {
      findAll: jest.fn((_: FindProductsCriteria) => ({
        items: [SAMPLE],
        total: 1,
      })),
    };
    service = new ProductsService(repository, cache);
  });

  it('renvoie des données paginées avec métadonnées', () => {
    const res = service.findAll(makeQuery({ page: 1, limit: 10 }));
    expect(res.data).toEqual([SAMPLE]);
    expect(res.meta).toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it('met en cache : le repository n’est appelé qu’une fois pour des params identiques', () => {
    service.findAll(makeQuery({ page: 1, limit: 10 }));
    service.findAll(makeQuery({ page: 1, limit: 10 }));
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('des filtres différents produisent des clés de cache différentes', () => {
    service.findAll(makeQuery({ page: 1, limit: 10, category: 'Electronics' }));
    service.findAll(makeQuery({ page: 1, limit: 10, category: 'Food' }));
    expect(repository.findAll).toHaveBeenCalledTimes(2);
  });

  it('la même clé est réutilisée quelle que soit la casse de la catégorie', () => {
    service.findAll(makeQuery({ page: 1, limit: 10, category: 'Electronics' }));
    service.findAll(makeQuery({ page: 1, limit: 10, category: 'electronics' }));
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
