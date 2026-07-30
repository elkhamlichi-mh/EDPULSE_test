# EdPulse — Système de consultation de produits

Test technique **Développeur Full Stack Senior**.

API REST (NestJS) + interface web (React) pour consulter un catalogue de
produits avec **pagination**, **filtrage** et **cache en mémoire**. Aucune base
de données : les produits sont stockés dans un tableau TypeScript.

```
EDPULSE/
├── backend/      API NestJS + TypeScript  (GET /api/products)
├── frontend/     UI React + TypeScript + Vite
├── AI_USAGE.md   Documentation de l'utilisation de Claude
├── render.yaml   Blueprint de déploiement PaaS (Render)
└── README.md
```

---

## 🚀 Démarrage rapide (local)

Deux terminaux.

### 1. Backend (port 3000)

```bash
cd backend
npm install
npm run start:dev
```

L'API est disponible sur `http://localhost:3000/api/products`.

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Ouvrir `http://localhost:5173`. En dev, Vite proxifie automatiquement `/api`
vers le backend (`http://localhost:3000`) — aucune config CORS nécessaire.

---

## 🔌 API

### `GET /api/products`

| Paramètre      | Type   | Défaut | Description                                             |
| -------------- | ------ | ------ | ------------------------------------------------------- |
| `page`         | number | `1`    | Numéro de page (≥ 1)                                    |
| `limit`        | number | `10`   | Éléments par page (1–100)                               |
| `category`     | string | —      | Filtre par catégorie (insensible à la casse)           |
| `stock_status` | enum   | —      | `in_stock` \| `low_stock` \| `out_of_stock`             |

La pagination fonctionne **conjointement** avec les filtres.

**Exemple**

```bash
curl "http://localhost:3000/api/products?page=1&limit=5&category=Food"
```

**Réponse**

```json
{
  "data": [
    {
      "id": 3,
      "name": "Organic Coffee #3",
      "category": "Food",
      "price": 16.99,
      "stock_status": "out_of_stock"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

**Erreur (format uniforme)**

```json
{
  "statusCode": 400,
  "message": ["page doit être >= 1"],
  "error": "Bad Request",
  "path": "/api/products?page=0",
  "timestamp": "2026-07-30T15:49:55.382Z"
}
```

---

## 🏗️ Architecture & choix techniques

### Backend — NestJS (principes SOLID)

```
products/
├── domain/                         Abstractions (cœur métier)
│   ├── product.entity.ts           Interface Product + enum StockStatus
│   └── product-repository.interface.ts   Contrat + token d'injection
├── infrastructure/                 Implémentations concrètes
│   ├── products.seed.ts            Catalogue en mémoire (déterministe)
│   └── in-memory-product.repository.ts   Filtrage + pagination
├── dto/query-products.dto.ts       Validation des query params
├── products.service.ts             Orchestration + cache-aside
├── products.controller.ts          Endpoint GET /products
└── products.module.ts             Câblage (DI)

common/
├── cache/          CacheService générique (TTL) + module global
├── dto/            Enveloppe PaginatedResponse + calcul des métadonnées
└── filters/        AllExceptionsFilter (format d'erreur uniforme)
```

- **S**ingle Responsibility : repository (données), service (métier + cache),
  controller (HTTP) et cache (stockage TTL) sont strictement séparés.
- **O**pen/Closed : passer du stockage en mémoire à une vraie base ne demande
  que de changer le `useClass` dans `products.module.ts`.
- **L**iskov / **I**nterface Segregation : le contrat `ProductRepository` est
  minimal et respecté par l'implémentation.
- **D**ependency Inversion : le service dépend du token abstrait
  `PRODUCT_REPOSITORY`, jamais de la classe concrète.

**Cache** — `CacheService` en mémoire avec TTL (60 s). La clé encode la
combinaison exacte `page + limit + category + stock_status`, donc chaque
variante de requête est mise en cache indépendamment ; un filtre non fourni est
normalisé (`*`) pour éviter les collisions, et la casse de la catégorie est
neutralisée.

**Validation & erreurs** — `ValidationPipe` global (`whitelist`,
`forbidNonWhitelisted`, `transform`) + DTO `class-validator`/`class-transformer`.
Toutes les erreurs passent par `AllExceptionsFilter` pour un JSON homogène.

### Frontend — React + Vite

- **État** : store **Zustand** minimal (pagination + filtres) découplé du fetch.
- **Données** : hook `useProducts` avec `AbortController` (anti *race condition*)
  et états `loading` / `error` / `empty` / `data`.
- **UI/UX** : design responsive (mobile + desktop), skeletons de chargement,
  badges de statut colorés, pagination avec fenêtre compacte + ellipses.
- **Typage** : TypeScript strict (`noUnusedLocals`, `strict`, etc.).

---

## 🧪 Tests

```bash
cd backend && npm test
```

10 tests unitaires couvrant la pagination, le filtrage (catégorie/statut, casse,
combinaisons), les pages hors limites et le **comportement du cache**
(réutilisation, invalidation par clé de filtre).

---

## ☁️ Déploiement (PaaS)

Voir [render.yaml](render.yaml) pour un déploiement **Render** en un clic
(backend Web Service + frontend Static Site). Le backend inclut aussi un
[Dockerfile](backend/Dockerfile) multi-stage, compatible Railway / Fly.io /
Heroku.

Étapes résumées :

1. Pousser le dépôt sur GitHub.
2. Render → *New* → *Blueprint* → sélectionner le repo (détecte `render.yaml`).
3. Le frontend reçoit `VITE_API_URL` = URL du backend déployé ; le backend
   reçoit `CORS_ORIGIN` = URL du frontend.

Détails complets dans la section Déploiement de ce README et les
`.env.example` de chaque dossier.
