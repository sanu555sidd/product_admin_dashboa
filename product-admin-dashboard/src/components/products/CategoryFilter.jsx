import { formatCategory } from '@/lib/format';

export default function CategoryFilter({ value, categories, status, onChange, onRetry }) {
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-danger">Categories didn't load.</span>
        <button type="button" onClick={onRetry} className="btn btn-secondary btn-sm">Retry</button>
      </div>
    );
  }

  // Keep an unknown category from the URL selectable so the <select> stays truthful.
  const known = categories.some((c) => c.slug === value);

  return (
    <div>
      <label htmlFor="category" className="sr-only">Filter by category</label>
      <select id="category" value={value} onChange={(e) => onChange(e.target.value)} disabled={status === 'loading'} className="input">
        <option value="">{status === 'loading' ? 'Loading categories…' : 'All categories'}</option>
        {value && !known && <option value={value}>{formatCategory(value)}</option>}
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
