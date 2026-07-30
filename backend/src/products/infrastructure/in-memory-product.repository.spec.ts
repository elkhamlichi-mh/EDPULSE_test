import { StockStatus } from '../domain/product.entity';
import { InMemoryProductRepository } from './in-memory-product.repository';

describe('InMemoryProductRepository', () => {
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
  });

  it('pagine correctement (page 1, limit 10)', () => {
    const { items, total } = repository.findAll({ page: 1, limit: 10 });
    expect(items).toHaveLength(10);
    expect(total).toBe(48);
    expect(items[0].id).toBe(1);
  });

  it('renvoie la bonne tranche pour la page 2', () => {
    const page1 = repository.findAll({ page: 1, limit: 10 }).items;
    const page2 = repository.findAll({ page: 2, limit: 10 }).items;
    expect(page2[0].id).toBe(11);
    expect(page1).not.toContainEqual(page2[0]);
  });

  it('filtre par catégorie (insensible à la casse) et garde la pagination', () => {
    const { items, total } = repository.findAll({
      page: 1,
      limit: 5,
      category: 'electronics',
    });
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.every((p) => p.category === 'Electronics')).toBe(true);
    expect(total).toBeGreaterThan(0);
  });

  it('filtre par statut de stock', () => {
    const { items } = repository.findAll({
      page: 1,
      limit: 100,
      stock_status: StockStatus.OUT_OF_STOCK,
    });
    expect(items.every((p) => p.stock_status === StockStatus.OUT_OF_STOCK)).toBe(
      true,
    );
  });

  it('combine filtre catégorie + statut', () => {
    const { items } = repository.findAll({
      page: 1,
      limit: 100,
      category: 'Food',
      stock_status: StockStatus.IN_STOCK,
    });
    expect(
      items.every(
        (p) => p.category === 'Food' && p.stock_status === StockStatus.IN_STOCK,
      ),
    ).toBe(true);
  });

  it('renvoie une page vide au-delà des résultats', () => {
    const { items, total } = repository.findAll({ page: 999, limit: 10 });
    expect(items).toHaveLength(0);
    expect(total).toBe(48);
  });
});
