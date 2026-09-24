import Link from 'next/link';
import ProductImage from '@/components/products/ProductImage';
import Rating from '@/components/products/Rating';
import RowActions from '@/components/products/RowActions';
import StockBadge from '@/components/products/StockBadge';
import { formatCategory, formatPrice } from '@/lib/format';

// Desktop layout (hidden below the md breakpoint; ProductCards handles mobile).
export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-line bg-surface md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-paper text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Image</th>
            <th scope="col" className="px-4 py-3 font-medium">Title</th>
            <th scope="col" className="px-4 py-3 font-medium">Category</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">Price</th>
            <th scope="col" className="px-4 py-3 font-medium">Rating</th>
            <th scope="col" className="px-4 py-3 font-medium">Stock</th>
            <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-paper/60">
              <td className="px-4 py-2">
                <ProductImage src={p.thumbnail} alt="" className="h-12 w-12 rounded-md" />
              </td>
              <td className="max-w-xs px-4 py-2">
                <Link href={`/products/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
              </td>
              <td className="px-4 py-2">{formatCategory(p.category)}</td>
              <td className="px-4 py-2 text-right tabular-nums">{formatPrice(p.price)}</td>
              <td className="px-4 py-2"><Rating value={p.rating} /></td>
              <td className="px-4 py-2"><StockBadge stock={p.stock} /></td>
              <td className="px-4 py-2"><RowActions product={p} onEdit={onEdit} onDelete={onDelete} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
