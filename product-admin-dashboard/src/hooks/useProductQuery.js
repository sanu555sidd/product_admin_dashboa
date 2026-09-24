'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { buildUrl, parseParams } from '@/lib/query';

// Reads list state (page, limit, q, category, sort, order) from the URL and
// gives back update(patch) which writes it back to the URL.
export function useProductQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.toString();

  const params = useMemo(() => parseParams(new URLSearchParams(raw)), [raw]);

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      const url = buildUrl(pathname, { ...params, ...patch });
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [params, pathname, router]
  );

  return { params, update };
}
