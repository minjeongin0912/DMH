import { polar, sendJson } from './_polar.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const result = await polar.products.list({ isArchived: false });
    const products = [];

    for await (const page of result) {
      products.push(...page.result.items);
    }

    sendJson(res, 200, {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        isRecurring: product.isRecurring,
        prices: product.prices,
      })),
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
