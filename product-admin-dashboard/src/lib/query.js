// The URL is the single source of truth for page / limit / search / category / sort.
// parseParams() turns ANY query string (even garbage like ?page=abc) into safe values.
export const PAGE_SIZES = [10, 20, 50];
export const SORT_FIELDS = ['price', 'rating', 'title'];
const DEFAULT_LIMIT = 10;
const MAX_PAGE = 100000;

function toPositiveInt(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? Math.min(n, MAX_PAGE) : fallback;
}

export function parseParams(searchParams) {
  const page = toPositiveInt(searchParams.get('page'), 1);

  const limitRaw = Number(searchParams.get('limit'));
  const limit = PAGE_SIZES.includes(limitRaw) ? limitRaw : DEFAULT_LIMIT;

  const q = (searchParams.get('q') ?? '').trim().slice(0, 100);
  // Search and category are mutually exclusive (see README). If both are in the URL, search wins.
  const category = q ? '' : (searchParams.get('category') ?? '').trim().slice(0, 60);

  const sortRaw = searchParams.get('sort');
  const sort = SORT_FIELDS.includes(sortRaw) ? sortRaw : '';
  const order = sort && searchParams.get('order') === 'desc' ? 'desc' : 'asc';

  return { page, limit, q, category, sort, order };
}

// Build a clean URL: defaults are left out so links stay short.
export function buildUrl(pathname, params) {
  const sp = new URLSearchParams();
  if (params.page > 1) sp.set('page', String(params.page));
  if (params.limit !== DEFAULT_LIMIT) sp.set('limit', String(params.limit));
  if (params.q) sp.set('q', params.q);
  else if (params.category) sp.set('category', params.category);
  if (params.sort) {
    sp.set('sort', params.sort);
    if (params.order === 'desc') sp.set('order', 'desc');
  }
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
