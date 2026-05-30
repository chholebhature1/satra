import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from './shopifyConfig';

const CART_ID_KEY = 'satrangi_cart_id';
const CART_SNAPSHOT_KEY = 'satrangi_cart_snapshot';

const CART_UPDATED_EVENT = 'satrangi-cart-updated';
const CART_OPEN_EVENT = 'satrangi-cart-open';

const ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const CART_SNAPSHOT_FRAGMENT = `
  fragment CartSnapshotFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            __typename
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              product {
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

const isBrowser = typeof window !== 'undefined';

const toNumber = (value) => {
  const parsedValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const readStorage = (key) => {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (_) {
    return null;
  }
};

const writeStorage = (key, value) => {
  if (!isBrowser) return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, value);
  } catch (_) {
    // Ignore storage failures in private mode.
  }
};

const readJsonStorage = (key) => {
  const rawValue = readStorage(key);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch (_) {
    return null;
  }
};

const storeSnapshot = (snapshot) => {
  if (!snapshot) return;
  writeStorage(CART_ID_KEY, snapshot.id);
  writeStorage(CART_SNAPSHOT_KEY, JSON.stringify(snapshot));
};

const clearStoredCart = () => {
  writeStorage(CART_ID_KEY, null);
  writeStorage(CART_SNAPSHOT_KEY, null);
};

const broadcastSnapshot = (snapshot) => {
  if (!isBrowser) return;
  storeSnapshot(snapshot);
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { snapshot } }));
};

const broadcastOpen = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
};

const executeGraphQL = async (query, variables = {}) => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_PUBLIC_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: `${CART_SNAPSHOT_FRAGMENT}\n${query}`, variables }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || `Shopify request failed (${response.status})`);
  }

  if (json?.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(' '));
  }

  return json.data;
};

const mapLine = (line) => {
  const merchandise = line?.merchandise;
  if (!merchandise || merchandise.__typename !== 'ProductVariant') {
    return null;
  }

  return {
    id: line.id,
    quantity: Math.max(0, Math.trunc(toNumber(line.quantity))),
    merchandiseId: merchandise.id,
    title: merchandise.product?.title || merchandise.title || 'Product',
    variantTitle: merchandise.title || 'Default',
    imageUrl: merchandise.image?.url || '',
    imageAlt: merchandise.image?.altText || merchandise.product?.title || 'Product image',
    priceAmount: merchandise.price?.amount || '0',
    currencyCode: merchandise.price?.currencyCode || 'INR',
    productHandle: merchandise.product?.handle || '',
  };
};

const normalizeSnapshot = (snapshot) => {
  if (!snapshot) return null;

  const normalizedLines = (snapshot.lines || [])
    .map((line) => {
      const quantity = Math.max(0, Math.trunc(toNumber(line?.quantity)));
      if (quantity <= 0) {
        return null;
      }

      return {
        ...line,
        quantity,
        priceAmount: String(line?.priceAmount ?? line?.price?.amount ?? '0'),
        currencyCode:
          line?.currencyCode
          || line?.price?.currencyCode
          || snapshot?.subtotalAmount?.currencyCode
          || snapshot?.totalAmount?.currencyCode
          || 'INR',
      };
    })
    .filter(Boolean);

  const totalQuantity = normalizedLines.reduce((sum, line) => sum + line.quantity, 0);
  const currencyCode =
    normalizedLines[0]?.currencyCode
    || snapshot?.subtotalAmount?.currencyCode
    || snapshot?.totalAmount?.currencyCode
    || 'INR';

  const subtotalValue = normalizedLines.reduce(
    (sum, line) => sum + (toNumber(line.priceAmount) * line.quantity),
    0
  );

  return {
    ...snapshot,
    totalQuantity,
    subtotalAmount: normalizedLines.length ? { amount: String(subtotalValue), currencyCode } : null,
    totalAmount: normalizedLines.length ? { amount: String(subtotalValue), currencyCode } : null,
    lines: normalizedLines,
  };
};

const mapCart = (cart) => {
  if (!cart) return null;

  return normalizeSnapshot({
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity || 0,
    subtotalAmount: cart.cost?.subtotalAmount || null,
    totalAmount: cart.cost?.totalAmount || null,
    lines: (cart.lines?.edges || [])
      .map((edge) => mapLine(edge.node))
      .filter(Boolean),
  });
};

const getCachedCartSnapshot = () => normalizeSnapshot(readJsonStorage(CART_SNAPSHOT_KEY));

const getStoredCartId = () => readStorage(CART_ID_KEY);

const fetchCartById = async (cartId) => {
  const data = await executeGraphQL(
    `query CartById($id: ID!) {
      cart(id: $id) {
        ...CartSnapshotFields
      }
    }`,
    { id: cartId }
  );

  return mapCart(data?.cart || null);
};

const createCart = async (lines = []) => {
  const data = await executeGraphQL(
    `mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartSnapshotFields
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      input: {
        buyerIdentity: {
          countryCode: 'IN',
        },
        lines,
      },
    }
  );

  const payload = data?.cartCreate;
  const firstError = payload?.userErrors?.[0];
  if (firstError) {
    throw new Error(firstError.message);
  }

  const snapshot = mapCart(payload?.cart || null);
  if (snapshot) {
    broadcastSnapshot(snapshot);
  }
  return snapshot;
};

const ensureCartSnapshot = async (variantId, quantity = 1) => {
  const storedCartId = getStoredCartId();

  if (storedCartId) {
    const existingCart = await fetchCartById(storedCartId).catch(() => null);
    if (existingCart) {
      const data = await executeGraphQL(
        `mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              ...CartSnapshotFields
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
          cartId: storedCartId,
          lines: [{ merchandiseId: variantId, quantity }],
        }
      );

      const payload = data?.cartLinesAdd;
      const firstError = payload?.userErrors?.[0];
      if (firstError) {
        throw new Error(firstError.message);
      }

      const snapshot = mapCart(payload?.cart || null);
      if (snapshot) {
        broadcastSnapshot(snapshot);
      }
      return snapshot;
    }
  }

  return createCart([{ merchandiseId: variantId, quantity }]);
};

const loadCartSnapshot = async () => {
  if (!isBrowser) return null;

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    return getCachedCartSnapshot();
  }

  try {
    const snapshot = await fetchCartById(storedCartId);
    if (snapshot) {
      broadcastSnapshot(snapshot);
      return snapshot;
    }
  } catch (_) {
    clearStoredCart();
  }

  return getCachedCartSnapshot();
};

const addVariantToCart = async (variantId, quantity = 1) => {
  if (!variantId) {
    throw new Error('Missing variant information for this product.');
  }

  const snapshot = await ensureCartSnapshot(variantId, quantity);
  if (!snapshot) {
    throw new Error('Could not create a cart.');
  }

  return snapshot;
};

const buyNowVariant = async (variantId, quantity = 1) => {
  const snapshot = await addVariantToCart(variantId, quantity);
  if (isBrowser && snapshot?.checkoutUrl) {
    window.location.assign(snapshot.checkoutUrl);
  }
  return snapshot;
};

const removeCartLine = async (lineId) => {
  if (!lineId) {
    throw new Error('Missing cart line.');
  }

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    throw new Error('Cart not found.');
  }

  const data = await executeGraphQL(
    `mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartSnapshotFields
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      cartId: storedCartId,
      lineIds: [lineId],
    }
  );

  const payload = data?.cartLinesRemove;
  const firstError = payload?.userErrors?.[0];
  if (firstError) {
    throw new Error(firstError.message);
  }

  const snapshot = mapCart(payload?.cart || null);
  if (snapshot) {
    broadcastSnapshot(snapshot);
  }

  return snapshot;
};

const updateCartLineQuantity = async (lineId, quantity) => {
  if (!lineId) {
    throw new Error('Missing cart line.');
  }

  if (quantity <= 0) {
    return removeCartLine(lineId);
  }

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    throw new Error('Cart not found.');
  }

  const data = await executeGraphQL(
    `mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartSnapshotFields
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      cartId: storedCartId,
      lines: [{ id: lineId, quantity }],
    }
  );

  const payload = data?.cartLinesUpdate;
  const firstError = payload?.userErrors?.[0];
  if (firstError) {
    throw new Error(firstError.message);
  }

  const snapshot = mapCart(payload?.cart || null);
  if (snapshot) {
    broadcastSnapshot(snapshot);
  }

  return snapshot;
};

const openCartDrawer = () => {
  broadcastOpen();
};

export {
  CART_OPEN_EVENT,
  CART_UPDATED_EVENT,
  addVariantToCart,
  buyNowVariant,
  getCachedCartSnapshot,
  loadCartSnapshot,
  openCartDrawer,
  removeCartLine,
  updateCartLineQuantity,
};