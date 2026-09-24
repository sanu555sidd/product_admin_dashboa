import { Suspense } from 'react';
import Loader from '@/components/ui/Loader';
import ProductListView from '@/components/products/ProductListView';

export const metadata = { title: 'Products · Product Admin' };

export default function ProductsPage() {
  // useSearchParams() needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<Loader label="Loading products…" />}>
      <ProductListView />
    </Suspense>
  );
}
