// Does a product match the current search / category filter?
// Used so local changes only affect the lists they belong in.
function matches(product, { q, category }) {
  if (q) {
    const needle = q.toLowerCase();
    return [product.title, product.brand, product.category, product.description].some(
      (field) => field && String(field).toLowerCase().includes(needle)
    );
  }
  if (category) return product.category === category;
  return true;
}

// data: { products, total } from the API for the current page.
// changes: { added: [], edited: {id: product}, deleted: {id: product} } kept in the browser.
export function applyOverlay(data, changes, params) {
  const { added, edited, deleted } = changes;

  const visible = data.products.filter((p) => !deleted[p.id]).map((p) => edited[p.id] ?? p);
  const removed = Object.values(deleted).filter((p) => matches(p, params)).length;
  const created = added.filter((p) => matches(p, params));

  return {
    // New products appear at the top of page 1 only.
    products: params.page === 1 ? [...created, ...visible] : visible,
    total: Math.max(data.total - removed + created.length, 0),
  };
}
