export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>" +
      "<rect width='160' height='160' fill='#E6F0EA'/>" +
      "<path d='M48 108l22-26 16 18 12-14 14 22z' fill='#A9BDB3'/>" +
      "<circle cx='58' cy='58' r='9' fill='#A9BDB3'/></svg>"
  );

export function formatPrice(value) {
  const n = Number(value);
  return Number.isFinite(n)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
    : '—';
}

// "mens-shirts" -> "Mens Shirts"
export function formatCategory(slug = '') {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
