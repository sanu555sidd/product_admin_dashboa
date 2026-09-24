import Link from 'next/link';
import ProductImage from '@/components/products/ProductImage';
import Rating from '@/components/products/Rating';
import RowActions from '@/components/products/RowActions';
import StockBadge from '@/components/products/StockBadge';
import { formatCategory, formatPrice } from '@/lib/format';

// Mobile layout (hidden from the md breakpoint up; ProductTable handles desktop).
export default function ProductCards({ products, onEdit, onDelete }) {
  return (
    <ul className="space-y-3 md:hidden">
      {products.map((p) => (
        <li key={p.id} className="flex gap-3 rounded-lg border border-line bg-surface p-3">
          <ProductImage src={p.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1">
            <Link href={`/products/${p.id}`} className="line-clamp-2 font-medium hover:underline">{p.title}</Link>
            <p className="text-xs text-muted">{formatCategory(p.category)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium tabular-nums">{formatPrice(p.price)}</span>
              <Rating value={p.rating} />
              <StockBadge stock={p.stock} />
            </div>
            <div className="mt-3"><RowActions product={p} onEdit={onEdit} onDelete={onDelete} /></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
