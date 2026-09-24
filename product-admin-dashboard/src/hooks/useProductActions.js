'use client';

import { useLocalChanges } from '@/context/LocalChangesContext';
import { buildLocalProduct, isLocalId, nextLocalId } from '@/lib/localProducts';
import { createProduct, deleteProduct, updateProduct } from '@/services/productService';

// Each action: (1) call the API, so real error handling still applies,
// (2) if it succeeds, record the change locally so the UI reflects it.
// Products created in this app don't exist on the API, so we skip the API call for them.
export function useProductActions() {
  const { changes, dispatch } = useLocalChanges();

  return {
    async create(values) {
      await createProduct(values);
      const product = buildLocalProduct(values, nextLocalId(changes.added));
      dispatch({ type: 'add', product });
      return product;
    },

    async update(product, values) {
      if (!isLocalId(product.id)) await updateProduct(product.id, values);
      const merged = { ...product, ...values };
      dispatch({ type: 'edit', product: merged });
      return merged;
    },

    async remove(product) {
      if (!isLocalId(product.id)) await deleteProduct(product.id);
      dispatch({ type: 'delete', product });
    },
  };
}
