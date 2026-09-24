'use client';

import { useEffect, useState } from 'react';
import { isCancel } from '@/lib/axios';
import { fetchProducts } from '@/services/productService';

// Loads one page of products for the given URL params.
//
// Race-condition safety: every run of the effect creates its own AbortController.
// When params change (or the component unmounts) React runs the cleanup, which aborts
// the previous request. An aborted request rejects with a cancel error that we ignore,
// so an old, slow response can never overwrite the results of a newer one.
export function useProducts(params) {
  const { page, limit, q, category, sort, order } = params;
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: '' });

    fetchProducts({ page, limit, q, category, sort, order }, controller.signal)
      .then((data) => setState({ status: 'success', data, error: '' }))
      .catch((err) => {
        if (isCancel(err)) return; // superseded by a newer request
        setState({ status: 'error', data: null, error: err.message });
      });

    return () => controller.abort();
  }, [page, limit, q, category, sort, order, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
