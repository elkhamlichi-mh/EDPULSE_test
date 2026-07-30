import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // timestamp epoch ms
}

/**
 * Cache en mémoire générique avec TTL.
 *
 * Responsabilité unique : stocker/récupérer des valeurs indexées par clé,
 * en gérant l'expiration. Agnostique du domaine « produits » (réutilisable
 * pour n'importe quelle donnée) — Single Responsibility + Open/Closed.
 */
@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  /** TTL par défaut : 60 secondes. */
  private readonly defaultTtlMs = 60_000;

  /**
   * Récupère une valeur si elle existe et n'est pas expirée.
   * Renvoie undefined en cas de miss ou d'expiration (nettoyage paresseux).
   */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }
    if (entry.expiresAt <= this.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  /** Enregistre une valeur avec un TTL optionnel (ms). */
  set<T>(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    this.store.set(key, { value, expiresAt: this.now() + ttlMs });
  }

  /**
   * Renvoie la valeur en cache, ou l'exécute via `factory` puis la met en cache.
   * Pattern « cache-aside » qui garde les appelants concis.
   */
  wrap<T>(key: string, factory: () => T, ttlMs?: number): T {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }
    const value = factory();
    this.set(key, value, ttlMs);
    return value;
  }

  /** Vide entièrement le cache (utile en test ou après mutation des données). */
  clear(): void {
    this.store.clear();
  }

  /** Nombre d'entrées actuellement stockées (diagnostic). */
  get size(): number {
    return this.store.size;
  }

  private now(): number {
    return Date.now();
  }
}
