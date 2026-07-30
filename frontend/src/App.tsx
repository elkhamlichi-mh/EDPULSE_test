import { Filters } from './components/Filters';
import { Pagination } from './components/Pagination';
import { ProductList } from './components/ProductList';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const { products, meta, isLoading, error, reload } = useProducts();

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            ◆
          </span>
          <div>
            <h1>Catalogue EdPulse</h1>
            <p className="app__subtitle">
              Consultation des produits — pagination &amp; filtres
            </p>
          </div>
        </div>
      </header>

      <main className="app__main">
        <section className="toolbar">
          <Filters />
          {meta && !error && (
            <p className="toolbar__count" aria-live="polite">
              {meta.total} produit{meta.total > 1 ? 's' : ''}
              {meta.totalPages > 0 && (
                <>
                  {' '}
                  · page {meta.page}/{meta.totalPages}
                </>
              )}
            </p>
          )}
        </section>

        <ProductList
          products={products}
          isLoading={isLoading}
          error={error}
          onRetry={reload}
        />

        {meta && !error && !isLoading && <Pagination meta={meta} />}
      </main>

      <footer className="app__footer">
        <span>Test technique EdPulse · NestJS + React + TypeScript</span>
      </footer>
    </div>
  );
}
