import { getPageItems } from '@/lib/pagination';
import { PAGE_SIZES } from '@/lib/query';

export default function Pagination({ page, limit, total, onPage, onLimit }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted">Showing {from}–{to} of {total}</p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          Per page
          <select value={limit} onChange={(e) => onLimit(Number(e.target.value))} className="input w-auto py-1">
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-1">
          <button type="button" className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </button>
          {getPageItems(page, totalPages).map((item, i) =>
            typeof item === 'string' ? (
              <span key={`${item}-${i}`} aria-hidden className="px-1 text-muted">…</span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPage(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={`btn btn-sm min-w-8 ${item === page ? 'btn-primary' : 'btn-secondary'}`}
              >
                {item}
              </button>
            )
          )}
          <button type="button" className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </nav>
  );
}
