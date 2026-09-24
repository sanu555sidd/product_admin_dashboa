import { notFound } from 'next/navigation';
import ProductDetail from '@/components/products/ProductDetail';

export const metadata = { title: 'Product details · Product Admin' };

export default function ProductPage({ params }) {
  // Ids like "abc", "-1" or "1.5" can never exist: show "not found" straight away.
  if (!/^\d+$/.test(params.id)) notFound();
  return <ProductDetail id={Number(params.id)} />;
}
