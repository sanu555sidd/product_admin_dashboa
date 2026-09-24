'use client';

import { useEffect, useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/format';

// <img> with a placeholder fallback for missing or broken URLs.
export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={failed || !src ? PLACEHOLDER_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-brand-soft object-cover ${className}`}
    />
  );
}
