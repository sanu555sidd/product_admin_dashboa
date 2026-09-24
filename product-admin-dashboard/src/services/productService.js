import { api } from '@/lib/axios';

// Optional artificial latency for testing stale responses (see README).
const DELAY = process.env.NEXT_PUBLIC_API_DELAY;
const withDelay = (params) => (DELAY ? { ...params, delay: DELAY } : params);

// Picks the right endpoint. Search and category are never combined (see README).
export async function fetchProducts({ page, limit, q, category, sort, order }, signal) {
  const params = { limit, skip: (page - 1) * limit };
  if (sort) {
    params.sortBy = sort;
    params.order = order;
  }

  let url = '/products';
  if (q) {
    url = '/products/search';
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const { data } = await api.get(url, { params: withDelay(params), signal });
  return { products: data.products, total: data.total };
}

export async function fetchProduct(id, signal) {
  const { data } = await api.get(`/products/${id}`, { params: withDelay({}), signal });
  return data;
}

export async function fetchCategories(signal) {
  const { data } = await api.get('/products/categories', { signal });
  // Newer API returns [{ slug, name, url }]; be tolerant of plain strings too.
  return data.map((c) => (typeof c === 'string' ? { slug: c, name: c } : { slug: c.slug, name: c.name }));
}

// The API accepts these calls but does NOT store the result.
export const createProduct = (payload) => api.post('/products/add', payload).then((r) => r.data);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
