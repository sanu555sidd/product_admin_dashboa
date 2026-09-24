'use client';

import { useEffect, useState } from 'react';
import { isCancel } from '@/lib/axios';
import { fetchCategories } from '@/services/productService';

let cache = null; // categories rarely change, so fetch once per page load

export function useCategories() {
  const [state, setState] = useState(
    cache ? { status: 'success', data: cache } : { status: 'loading', data: [] }
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (cache) return undefined;
    const controller = new AbortController();
    setState({ status: 'loading', data: [] });

    fetchCategories(controller.signal)
      .then((data) => {
        cache = data;
        setState({ status: 'success', data });
      })
      .catch((err) => {
        if (isCancel(err)) return;
        setState({ status: 'error', data: [] });
      });

    return () => controller.abort();
  }, [attempt]);

  return { categories: state.data, status: state.status, retry: () => setAttempt((n) => n + 1) };
}
