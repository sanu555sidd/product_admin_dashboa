'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useCategories } from '@/hooks/useCategories';
import { toPayload, validateProduct } from '@/lib/validation';

const EMPTY = { title: '', description: '', category: '', brand: '', price: '', stock: '', thumbnail: '' };

function toFormValues(product) {
  if (!product) return EMPTY;
  return {
    title: product.title ?? '',
    description: product.description ?? '',
    category: product.category ?? '',
    brand: product.brand ?? '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    thumbnail: product.thumbnail ?? '',
  };
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

// Add / edit form in a modal. `product` = null means "add".
// onSubmit(payload) may be async; errors it throws are shown inside the form.
export default function ProductForm({ product, onSubmit, onClose }) {
  const { categories, status: catStatus, retry } = useCategories();
  const [values, setValues] = useState(() => toFormValues(product));
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const lock = useRef(false);

  const errors = validateProduct(values); // derived on every render
  const showError = (name) => (touched[name] || attempted ? errors[name] : undefined);

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));
  const inputProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': !!showError(name),
    'aria-describedby': showError(name) ? `${name}-error` : undefined,
    className: `input ${showError(name) ? 'input-error' : ''}`,
    disabled: submitting,
  });

  // Make sure the current category is selectable even if the list hasn't loaded / lacks it.
  const options = values.category && !categories.some((c) => c.slug === values.category)
    ? [{ slug: values.category, name: values.category }, ...categories]
    : categories;

  async function handleSubmit(e) {
    e.preventDefault();
    if (lock.current) return; // blocks rapid double-clicks on Save
    setAttempted(true);
    if (Object.keys(errors).length > 0) return;

    lock.current = true;
    setSubmitting(true);
    setServerError('');
    try {
      await onSubmit(toPayload(values));
      onClose();
    } catch (err) {
      setServerError(err.message);
      lock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Modal title={product ? 'Edit product' : 'Add product'} onClose={submitting ? () => {} : onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 px-5 py-5">
        {serverError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{serverError}</p>
        )}

        <Field id="title" label="Title" error={showError('title')}>
          <input {...inputProps('title')} autoComplete="off" />
        </Field>

        <Field id="description" label="Description" error={showError('description')}>
          <textarea {...inputProps('description')} rows={3} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="category" label="Category" error={showError('category')}>
            <select {...inputProps('category')}>
              <option value="">{catStatus === 'loading' ? 'Loading…' : 'Choose a category'}</option>
              {options.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            {catStatus === 'error' && (
              <p className="mt-1 text-xs text-danger">
                Categories didn't load.{' '}
                <button type="button" onClick={retry} className="underline">Retry</button>
              </p>
            )}
          </Field>

          <Field id="brand" label="Brand (optional)" error={showError('brand')}>
            <input {...inputProps('brand')} autoComplete="off" />
          </Field>

          <Field id="price" label="Price (USD)" error={showError('price')}>
            <input {...inputProps('price')} inputMode="decimal" />
          </Field>

          <Field id="stock" label="Stock" error={showError('stock')}>
            <input {...inputProps('stock')} inputMode="numeric" />
          </Field>
        </div>

        <Field id="thumbnail" label="Image URL (optional)" error={showError('thumbnail')}>
          <input {...inputProps('thumbnail')} inputMode="url" placeholder="https://…" />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
