'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import ProductGallery from '@/components/products/ProductGallery';
import Rating from '@/components/products/Rating';
import ReviewList from '@/components/products/ReviewList';
import StockBadge from '@/components/products/StockBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorState from '@/components/ui/ErrorState';
import Loader from '@/components/ui/Loader';
import { useLocalChanges } from '@/context/LocalChangesContext';
import { useToast } from '@/context/ToastContext';
import { useProduct } from '@/hooks/useProduct';
import { useProductActions } from '@/hooks/useProductActions';
import { formatCategory, formatPrice } from '@/lib/format';
import { isLocalId } from '@/lib/localProducts';

const FACTS = [
  ['SKU', 'sku'],
  ['Weight', 'weight'],
  ['Warranty', 'warrantyInformation'],
  ['Shipping', 'shippingInformation'],
  ['Availability', 'availabilityStatus'],
  ['Returns', 'returnPolicy'],
];

export default function ProductDetail({ id }) {
  const router = useRouter();
  const toast = useToast();
  const actions = useProductActions();
  const { changes, ready } = useLocalChanges();

  // Products created in this app only exist locally, so we don't ask the API for them.
  const local = isLocalId(id);
  const remote = useProduct(local ? null : id);

  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);
  const lastProduct = useRef(null);

  // Resolve the product: API data + local edits, or the locally created one. Deleted => null.
  let product = null;
  if (ready) {
    if (local) product = changes.added.find((p) => p.id === id) ?? null;
    else if (remote.status === 'success' && !changes.deleted[id]) product = changes.edited[id] ?? remote.product;
  }
  if (product) lastProduct.current = product;
  // While a delete is finishing we keep showing the last product, so users don't see a "not found" flash.
  const shown = product ?? (removing ? lastProduct.current : null);

  if (!ready || remote.status === 'loading') return <Loader label="Loading product…" />;
  if (remote.status === 'error') return <ErrorState message={remote.error} onRetry={remote.retry} />;
  if (!shown) notFound(); // unknown id (API 404), deleted product, or missing local product

  function goBack() {
    if (window.history.length > 1) router.back(); // keeps the list's page / search / filters
    else router.push('/products');
  }

  async function handleSave(values) {
    await actions.update(shown, values);
    toast.show('Product updated. Changes are kept in this browser only.');
  }

  async function handleDelete() {
    setRemoving(true);
    try {
      await actions.remove(shown);
    } catch (err) {
      setRemoving(false);
      throw err; // ConfirmDialog shows the message
    }
    toast.show('Product deleted. Changes are kept in this browser only.');
    router.replace('/products');
  }

  const facts = FACTS.filter(([, key]) => shown[key]);

  return (
    <article className="space-y-8">
      <button type="button" onClick={goBack} className="text-sm text-muted underline underline-offset-2 hover:text-ink">
        ← Back to products
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={shown.images?.length ? shown.images : [shown.thumbnail].filter(Boolean)} title={shown.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted">
              <Link href={`/products?category=${encodeURIComponent(shown.category)}`} className="underline underline-offset-2 hover:text-ink">
                {formatCategory(shown.category)}
              </Link>
              {shown.brand && <> · {shown.brand}</>}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{shown.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-2xl font-semibold tabular-nums">{formatPrice(shown.price)}</p>
            {shown.discountPercentage > 0 && (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-dark">
                {Math.round(shown.discountPercentage)}% off
              </span>
            )}
            <Rating value={shown.rating} />
            <span className="text-sm">Stock: <StockBadge stock={shown.stock} /></span>
          </div>

          <p className="max-w-prose text-sm leading-relaxed">{shown.description}</p>

          {shown.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {shown.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{tag}</li>
              ))}
            </ul>
          )}

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-line bg-surface p-4 text-sm">
              {facts.map(([label, key]) => (
                <div key={key}>
                  <dt className="text-muted">{label}</dt>
                  <dd>{shown[key]}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>
            <button type="button" className="btn btn-secondary text-danger" onClick={() => setConfirming(true)}>Delete</button>
          </div>
        </div>
      </div>

      <section aria-labelledby="reviews-heading" className="space-y-3">
        <h2 id="reviews-heading" className="text-lg font-semibold">Reviews ({shown.reviews?.length ?? 0})</h2>
        <ReviewList reviews={shown.reviews} />
      </section>

      {editing && <ProductForm product={shown} onSubmit={handleSave} onClose={() => setEditing(false)} />}
      {confirming && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${shown.title}" will be removed. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </article>
  );
}
