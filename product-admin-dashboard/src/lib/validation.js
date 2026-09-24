// Hand-written form validation. Returns an object of { field: message }; empty = valid.
function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateProduct(values) {
  const errors = {};

  const title = values.title.trim();
  if (!title) errors.title = 'Enter a title.';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.';

  const description = values.description.trim();
  if (!description) errors.description = 'Enter a description.';
  else if (description.length < 10) errors.description = 'Description must be at least 10 characters.';
  else if (description.length > 500) errors.description = 'Description must be 500 characters or fewer.';

  if (!values.category) errors.category = 'Choose a category.';

  if (values.brand.trim().length > 50) errors.brand = 'Brand must be 50 characters or fewer.';

  const priceText = values.price.trim();
  const price = Number(priceText);
  if (!priceText) errors.price = 'Enter a price.';
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'Price must be greater than 0.';
  else if (price > 1000000) errors.price = 'Price must be 1,000,000 or less.';

  const stockText = values.stock.trim();
  const stock = Number(stockText);
  if (!stockText) errors.stock = 'Enter the stock count.';
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = 'Stock must be a whole number, 0 or more.';

  const thumbnail = values.thumbnail.trim();
  if (thumbnail && !isHttpUrl(thumbnail)) {
    errors.thumbnail = 'Enter a valid image URL starting with http:// or https://.';
  }

  return errors;
}

// Convert validated form strings into the payload we send / store.
export function toPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    brand: values.brand.trim(),
    price: Math.round(Number(values.price) * 100) / 100,
    stock: Number(values.stock),
    thumbnail: values.thumbnail.trim(),
  };
}
