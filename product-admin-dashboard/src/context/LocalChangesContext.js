'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { isLocalId } from '@/lib/localProducts';

// DummyJSON doesn't save add / edit / delete. To make them visible anyway, we keep
// the changes here (persisted in localStorage) and lay them over API responses.
//   added:   products created in the app (array, newest first)
//   edited:  { [id]: full edited product }  (for products that exist on the API)
//   deleted: { [id]: product snapshot }     (snapshot lets us adjust totals correctly)mj
const STORAGE_KEY = 'product-admin:local-changes';
const EMPTY = { added: [], edited: {}, deleted: {} };

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'add':
      return { ...state, added: [action.product, ...state.added] };
    case 'edit': {
      const product = action.product;
      if (isLocalId(product.id)) {
        return { ...state, added: state.added.map((p) => (p.id === product.id ? product : p)) };
      }
      return { ...state, edited: { ...state.edited, [product.id]: product } };
    }
    case 'delete': {
      const product = action.product;
      if (isLocalId(product.id)) {
        return { ...state, added: state.added.filter((p) => p.id !== product.id) };
      }
      const edited = { ...state.edited };
      delete edited[product.id];
      return { ...state, edited, deleted: { ...state.deleted, [product.id]: product } };
    }
    case 'reset':
      return EMPTY;
    default:
      return state;
  }
}

function readStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && Array.isArray(parsed.added) && parsed.edited && parsed.deleted) return parsed;
  } catch {}
  return EMPTY;
}

const LocalChangesContext = createContext(null);

export function LocalChangesProvider({ children }) {
  const [changes, dispatch] = useReducer(reducer, EMPTY);
  // `ready` becomes true after we've read localStorage, so pages don't flash un-patched data.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch({ type: 'hydrate', state: readStorage() });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    } catch {}
  }, [changes, ready]);

  const value = useMemo(() => ({ changes, dispatch, ready }), [changes, ready]);
  return <LocalChangesContext.Provider value={value}>{children}</LocalChangesContext.Provider>;
}

export function useLocalChanges() {
  const ctx = useContext(LocalChangesContext);
  if (!ctx) throw new Error('useLocalChanges must be used inside <LocalChangesProvider>');
  return ctx;
}
