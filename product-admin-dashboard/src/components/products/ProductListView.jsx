'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryFilter from '@/components/products/CategoryFilter';
import Pagination from '@/components/products/Pagination';
import ProductCards from '@/components/products/ProductCards';
import ProductForm from '@/components/products/ProductForm';
import ProductTable from '@/components/products/ProductTable';
import SearchBox from '@/components/products/SearchBox';
import SortSelect from '@/components/products/SortSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Loader from '@/components/ui/Loader';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { useToast } from '@/context/ToastContext';
import { useCategories } from '@/hooks/useCategories';
import { useProductActions } from '@/hooks/useProductActions';
import { useProductQuery } from '@/hooks/useProductQuery';
import { useProducts } from '@/hooks/useProducts';
import { applyOverlay } from '@/lib/overlay';

export default function ProductListView() {
  const { params, update } = useProductQuery();
  const { status, data, error, retry } = useProducts(params);
  const { changes, ready } = useLocalChanges();
  const { categories, status: catStatus, retry: retryCategories } = useCategories();
  const actions = useProductActions();
  const toast = useToast();

  const [form, setForm] = useState(null); // null | { product: Product | null }
  const [toDelete, setToDelete] = useState(null);

  // API data + local add/edit/delete on top.
  const view = useMemo(
    () => (data && ready ? applyOverlay(data, changes, params) : null),
    [data, changes, ready, params]
  );

  // ?page=999 -> jump to the last real page instead of showing an empty table.
  const totalPages = view ? Math.max(1, Math.ceil(view.total / params.limit)) : 1;
  const outOfRange = !!view && view.total > 0 && params.page > totalPages;
  useEffect(() => {
    if (outOfRange) update({ page: totalPages }, { replace: true });
  }, [outOfRange, totalPages, update]);

  // Any filter change goes back to page 1. Search and category are exclusive: setting one clears the other.
  const setSearch = useCallback((q) => update({ q, category: '', page: 1 }, { replace: true }), [update]);
  const setCategory = (category) => update({ category, q: '', page: 1 });
  const setSort = (value) => {
    const [sort = '', order = 'asc'] = value.split(':');
    update({ sort, order, page: 1 });
  };
  const setLimit = (limit) => update({ limit, page: 1 });
  const clearFilters = () => update({ q: '', category: '', sort: '', order: 'asc', page: 1 });

  async function handleSave(values) {
    if (form.product) {
      await actions.update(form.product, values);
      toast.show('Product updated. Changes are kept in this browser only.');
    } else {
      await actions.create(values);
      toast.show('Product added. Changes are kept in this browser only.');
    }
  }

  async function handleDelete() {
    await actions.remove(toDelete);
    toast.show('Product deleted. Changes are kept in this browser only.');
    setToDelete(null);
  }

  const hasFilters = !!(params.q || params.category || params.sort);
  let body;
  if (status === 'error') {
    body = <ErrorState message={error} onRetry={retry} />;
  } else if (!view || outOfRange) {
    body = <Loader label="Loading products…" />;
  } else if (view.products.length === 0) {
    body = (
      <EmptyState
        title="No products found"
        hint={params.q ? `Nothing matches "${params.q}". Try a different search.` : 'Try a different filter, or add a product.'}
        action={hasFilters && <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>}
      />
    );
  } else {
    body = (
      <>
        <ProductTable products={view.products} onEdit={(p) => setForm({ product: p })} onDelete={setToDelete} />
        <ProductCards products={view.products} onEdit={(p) => setForm({ product: p })} onDelete={setToDelete} />
      </>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted">Search, filter and manage the catalog.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setForm({ product: null })}>
          Add product
        </button>
      </div>

      <div>
        <div className="grid gap-3 md:grid-cols-[1fr_15rem_15rem]">
          <SearchBox value={params.q} onSearch={setSearch} />
          <CategoryFilter value={params.category} categories={categories} status={catStatus} onChange={setCategory} onRetry={retryCategories} />
          <SortSelect sort={params.sort} order={params.order} onChange={setSort} />
        </div>
        <p className="mt-2 text-xs text-muted">Search and category work one at a time: using one clears the other.</p>
      </div>

      {body}

      {view && !outOfRange && view.total > 0 && status === 'success' && (
        <Pagination page={params.page} limit={params.limit} total={view.total} onPage={(page) => update({ page })} onLimit={setLimit} />
      )}

      {form && <ProductForm product={form.product} onSubmit={handleSave} onClose={() => setForm(null)} />}

      {toDelete && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${toDelete.title}" will be removed from the list. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
}
