'use client';

import { useState } from 'react';
import ProductImage from '@/components/products/ProductImage';

export default function ProductGallery({ images, title }) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [null];
  const current = list[Math.min(index, list.length - 1)];

  return (
    <div>
      <ProductImage src={current} alt={title} className="aspect-square w-full rounded-lg border border-line" />
      {list.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <li key={`${src}-${i}`}>
              <button type="button" onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}`} aria-current={i === index}
                className={`block w-full overflow-hidden rounded-md border-2 ${i === index ? 'border-brand' : 'border-transparent'}`}>
                <ProductImage src={src} alt="" className="aspect-square w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
