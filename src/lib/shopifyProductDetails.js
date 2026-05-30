import {
  SHOPIFY_API_VERSION,
  SHOPIFY_PUBLIC_ACCESS_TOKEN,
  SHOPIFY_STORE_DOMAIN,
} from './shopifyConfig';

const ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const MEDIA_LABELS = [
  'Hero',
  'Front',
  'Walk',
  'Twirl',
  'Embroidery',
  'Embroidery',
  'Dupatta',
  'Lifestyle',
  'Reel',
];

const PRODUCT_DETAIL_QUERY = `
  query ProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      productType
      descriptionHtml
      tags
      selectedOrFirstAvailableVariant {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
      }
      variants(first: 30) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
      media(first: 12) {
        nodes {
          __typename
          mediaContentType
          alt
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
          ... on Video {
            previewImage {
              url
              altText
              width
              height
            }
            sources {
              url
              mimeType
              format
              width
              height
            }
          }
          ... on ExternalVideo {
            embedUrl
            originUrl
            host
            previewImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const executeGraphQL = async (query, variables = {}) => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_PUBLIC_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
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

const getBestVideoSource = (sources = []) => {
  if (!Array.isArray(sources) || sources.length === 0) return null;
  return sources.find((source) => source?.mimeType === 'video/mp4') || sources[0];
};

const mapMedia = (media, index) => {
  const label = MEDIA_LABELS[index] || `View ${index + 1}`;

  if (media?.__typename === 'Video') {
    const source = getBestVideoSource(media.sources);
    if (!source?.url) return null;

    return {
      type: 'video',
      label,
      url: source.url,
      poster: media.previewImage?.url || '',
      alt: media.alt || media.previewImage?.altText || label,
    };
  }

  if (media?.__typename === 'ExternalVideo') {
    return {
      type: 'externalVideo',
      label,
      url: media.embedUrl || media.originUrl || '',
      poster: media.previewImage?.url || '',
      alt: media.alt || media.previewImage?.altText || label,
    };
  }

  const image = media?.image;
  if (!image?.url) return null;

  return {
    type: 'image',
    label,
    url: image.url,
    poster: image.url,
    alt: media.alt || image.altText || label,
    width: image.width,
    height: image.height,
  };
};

const mapProduct = (product) => {
  if (!product) return null;

  const variants = (product.variants?.nodes || []).filter(Boolean);
  const selectedVariant = product.selectedOrFirstAvailableVariant || variants[0] || null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    productType: product.productType,
    descriptionHtml: product.descriptionHtml || '',
    tags: product.tags || [],
    selectedVariant,
    variants,
    media: (product.media?.nodes || [])
      .map((media, index) => mapMedia(media, index))
      .filter(Boolean),
  };
};

const fetchProductDetails = async (handle) => {
  if (!handle) {
    throw new Error('Missing product handle.');
  }

  const data = await executeGraphQL(PRODUCT_DETAIL_QUERY, { handle });
  const product = mapProduct(data?.product || null);

  if (!product) {
    throw new Error('Product details are not available.');
  }

  return product;
};

export { fetchProductDetails };
