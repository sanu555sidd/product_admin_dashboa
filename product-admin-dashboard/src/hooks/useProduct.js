'use client';

import { useEffect, useState } from 'react';
import { isCancel } from '@/lib/axios';
import { fetchProduct } from '@/services/productService';

// Loads one product. Pass id = null to skip (used for locally created products).
export function useProduct(id) {
  const [state, setState] = useState({ status: id == null ? 'idle' : 'loading', product: null, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (id == null) {
      setState({ status: 'idle', product: null, error: '' });
      return undefined;
    }
    const controller = new AbortController();
    setState({ status: 'loading', product: null, error: '' });

    fetchProduct(id, controller.signal)
      .then((product) => setState({ status: 'success', product, error: '' }))
      .catch((err) => {
        if (isCancel(err)) return;
        setState({ status: err.status === 404 ? 'notfound' : 'error', product: null, error: err.message });
      });

    return () => controller.abort();
  }, [id, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
