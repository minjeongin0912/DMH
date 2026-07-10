import { polar, sendJson, readJsonBody } from './_polar.js';

async function resolveProductId({ productId, title }) {
  if (productId) return productId;
  if (!title) return null;

  // Polar's `query` filter doesn't match non-Latin text reliably, so fetch
  // the full catalog and match the title exactly on our side instead.
  const result = await polar.products.list({ isArchived: false, limit: 100 });

  for await (const page of result) {
    const exact = page.result.items.find((product) => product.name === title);
    if (exact) return exact.id;
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const productId = await resolveProductId(body);

    if (!productId) {
      sendJson(res, 400, { error: '해당 상품을 Polar 샌드박스에서 찾을 수 없습니다.' });
      return;
    }

    const origin = req.headers.origin || `http://${req.headers.host}`;

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${origin}/success?checkout_id={CHECKOUT_ID}`,
    });

    sendJson(res, 200, { url: checkout.url });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
