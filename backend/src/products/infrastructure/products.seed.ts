import { Product, StockStatus } from '../domain/product.entity';

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Home'];
const STATUSES: StockStatus[] = [
  StockStatus.IN_STOCK,
  StockStatus.LOW_STOCK,
  StockStatus.OUT_OF_STOCK,
];

const NAMES_BY_CATEGORY: Record<string, string[]> = {
  Electronics: ['Wireless Headphones', 'Smartphone', '4K Monitor', 'Mechanical Keyboard', 'USB-C Hub', 'Bluetooth Speaker'],
  Clothing: ['Cotton T-Shirt', 'Denim Jacket', 'Running Shoes', 'Wool Sweater', 'Leather Belt', 'Baseball Cap'],
  Food: ['Organic Coffee', 'Dark Chocolate', 'Olive Oil', 'Almond Butter', 'Green Tea', 'Honey Jar'],
  Books: ['Clean Architecture', 'The Pragmatic Programmer', 'Refactoring', 'Design Patterns', 'Domain-Driven Design', 'You Don’t Know JS'],
  Home: ['Ceramic Mug', 'Desk Lamp', 'Throw Blanket', 'Scented Candle', 'Wall Clock', 'Plant Pot'],
};

/**
 * Génère un catalogue de produits déterministe stocké en mémoire.
 * Déterministe = pas de Math.random, pour des tests et un cache reproductibles.
 */
function buildProducts(): Product[] {
  const products: Product[] = [];
  let id = 1;

  for (let i = 0; i < 48; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const names = NAMES_BY_CATEGORY[category];
    const name = names[Math.floor(i / CATEGORIES.length) % names.length];
    const stock_status = STATUSES[i % STATUSES.length];
    const price = Math.round((9.99 + i * 3.5) * 100) / 100;

    products.push({
      id: id++,
      name: `${name} #${id - 1}`,
      category,
      price,
      stock_status,
    });
  }

  return products;
}

/** Catalogue immuable partagé (chargé une seule fois au démarrage). */
export const PRODUCTS_SEED: readonly Product[] = Object.freeze(buildProducts());
