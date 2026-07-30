# AI_USAGE.md — Utilisation de Claude

Ce document décrit comment j'ai utilisé **Claude** (via **Claude Code**) pour
réaliser ce test technique, dans un esprit de collaboration : Claude comme
copilote pour accélérer le squelette et le code répétitif, moi comme décideur
sur l'architecture, les compromis et la validation finale.

---

## 1. Ce que j'ai demandé à Claude

### Tâches déléguées

| Domaine | Ce que j'ai délégué |
| --- | --- |
| **Cadrage** | Lecture et synthèse du PDF de l'énoncé pour extraire les exigences (endpoint unique, pas de BDD, cache, SOLID, filtres + pagination). |
| **Scaffolding backend** | Génération de la structure NestJS (modules, controller, service, DTO, `main.ts`) sans passer par le CLI interactif. |
| **Boilerplate répétitif** | DTO `class-validator`, filtre d'exception global, enveloppe de réponse paginée, jeu de données de démo. |
| **Frontend** | Squelette React/Vite : composants (carte, liste, filtres, pagination), store Zustand, hook de fetch, feuille de style responsive. |
| **Tests** | Première passe de tests unitaires (repository + service/cache). |
| **Docs & déploiement** | Rédaction du README, du `render.yaml` et du Dockerfile. |

### Problèmes concrets que j'ai cherché à résoudre avec Claude

- **Cache indexé par requête** : comment construire une clé de cache stable
  couvrant `page + limit + filtres` sans collisions (cas « filtre absent » vs
  « filtre vide », casse de la catégorie).
- **Pagination cohérente avec le filtrage** : garantir que `total` reflète le
  nombre d'éléments *après* filtrage mais *avant* découpage de page.
- **Race conditions frontend** : éviter qu'une réponse lente d'une requête
  annulée n'écrase les données d'une requête plus récente.
- **Conformité SOLID** : structurer le backend pour que le passage à une vraie
  base de données ne touche pas la couche métier.

---

## 2. Comment j'ai utilisé les suggestions de Claude

### Adopté directement

- **Le découpage `domain / infrastructure`** côté backend (interface
  `ProductRepository` + token d'injection `PRODUCT_REPOSITORY`). La proposition
  correspondait exactement à l'intention SOLID visée (Dependency Inversion).
- **Le filtre d'exception global** unifiant `HttpException` et erreurs
  inattendues dans un même JSON — repris tel quel.
- **Le hook `useProducts` avec `AbortController`** pour annuler les requêtes
  obsolètes : c'est la bonne réponse au problème de race condition.
- **Les skeletons de chargement** et la fenêtre de pagination avec ellipses,
  bons pour l'UX sans surcoût.

### Adapté ou modifié

- **Clé de cache** : la version initiale concaténait juste les paramètres.
  Je l'ai fait renforcer pour **normaliser les filtres absents en `*`** et
  **neutraliser la casse** de la catégorie, afin que `?category=Food` et
  `?category=food` partagent la même entrée de cache. Un test dédié verrouille
  ce comportement.
- **`ValidationPipe`** : j'ai ajouté `forbidNonWhitelisted: true` (au-delà du
  `whitelist` proposé) pour **rejeter explicitement** les query params inconnus,
  plutôt que de les ignorer silencieusement — retour d'erreur plus clair pour un
  consommateur d'API.
- **Jeu de données** : j'ai imposé un catalogue **déterministe** (pas de
  `Math.random`) pour que le cache et les tests soient reproductibles.
- **Séparation état / fetch** côté front : le store Zustand ne contient que
  l'état de la requête (filtres + pagination) ; le chargement des données vit
  dans le hook. Cela garde le store testable et évite de coupler l'UI au réseau.

### Vérifié systématiquement

Rien n'a été considéré comme acquis : j'ai **compilé, lancé les tests
(10/10) et testé l'API au curl** (pagination, filtres combinés, erreurs de
validation, param inconnu), puis **validé l'UI dans le navigateur** (filtrage en
direct, mise à jour du compteur, responsive mobile et desktop).

---

## 3. Ce que j'ai rejeté et pourquoi

- **Ajouter `@nestjs/cache-manager`** : rejeté. L'énoncé demande un cache *en
  mémoire* et met l'accent sur la maîtrise du mécanisme. Un `CacheService`
  maison (Map + TTL, ~50 lignes) est plus démonstratif et sans dépendance
  superflue.
- **Introduire une vraie base de données / TypeORM** : rejeté, hors périmètre
  (« Pas de base de données requise »). L'abstraction repository laisse toutefois
  la porte ouverte sans dette.
- **Créer plusieurs endpoints** (par catégorie, par statut…) : rejeté. L'énoncé
  impose **un seul endpoint GET** ; le filtrage se fait par query params.
- **Une grille de filtres trop riche** (multi-sélection, recherche texte,
  tri) : écarté pour rester fidèle à la demande (« catégorie **OU** statut ») et
  ne pas sur-concevoir l'UI.
- **State management lourd (Redux Toolkit)** : rejeté au profit de **Zustand**,
  suffisant et plus léger pour ce périmètre, tout en restant une option listée
  par l'énoncé.
- **Suggestions de style trop génériques** (thème clair basique) : adaptées vers
  un design plus soigné (thème sombre, badges de statut, micro-interactions)
  pour l'exigence « Interface et UX optimisés ».

### Logique de décision

À chaque suggestion, trois questions : *(1)* est-ce **conforme à l'énoncé** et à
ses contraintes ? *(2)* est-ce le **niveau de complexité juste** (ni sous- ni
sur-ingénierie) ? *(3)* puis-je le **vérifier** (test, exécution réelle) ? Une
suggestion n'était retenue que si elle passait ces trois filtres — sinon elle
était adaptée ou abandonnée.
