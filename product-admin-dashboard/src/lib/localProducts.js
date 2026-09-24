// DummyJSON doesn't persist new products, so products created in this app get
// their own ids. Real DummyJSON ids are < 200, so anything >= 100000 is "local".
export const LOCAL_ID_START = 100000;

export const isLocalId = (id) => Number(id) >= LOCAL_ID_START;

export function nextLocalId(added) {
  return Math.max(LOCAL_ID_START, ...added.map((p) => p.id)) + 1;
}

export function buildLocalProduct(values, id) {
  return {
    id,
    ...values,
    rating: 0,
    images: values.thumbnail ? [values.thumbnail] : [],
    tags: [],
    reviews: [],
  };
}
