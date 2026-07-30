import { Product } from './product.entity';

/**
 * Critères de récupération des produits (déjà normalisés depuis le DTO).
 */
export interface FindProductsCriteria {
  page: number;
  limit: number;
  category?: string;
  stock_status?: string;
}

/**
 * Résultat paginé renvoyé par le repository.
 */
export interface PaginatedProducts {
  items: Product[];
  total: number; // nombre total d'éléments APRÈS filtrage (avant pagination)
}

/**
 * Token d'injection pour le repository (Dependency Inversion Principle).
 * Le service dépend de l'abstraction, pas de l'implémentation concrète.
 */
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

/**
 * Contrat de persistance des produits.
 * Permet de remplacer le stockage en mémoire par une vraie base de données
 * sans modifier la couche service (Open/Closed Principle).
 */
export interface ProductRepository {
  findAll(criteria: FindProductsCriteria): PaginatedProducts;
}
