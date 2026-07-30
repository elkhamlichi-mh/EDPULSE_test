/**
 * Statut de stock d'un produit.
 * Utilisé côté DTO (validation) et côté domaine.
 */
export enum StockStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

/**
 * Représentation d'un produit du catalogue.
 * Les données sont stockées en mémoire (aucune base de données).
 */
export interface Product {
  id: number;
  name: string;
  category: string; // ex : 'Electronics', 'Clothing', 'Food'
  price: number;
  stock_status: StockStatus;
}
