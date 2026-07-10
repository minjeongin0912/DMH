import { polar, sendJson, getQueryParam } from './_polar.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  const checkoutId = getQueryParam(req, 'checkout_id');

  if (!checkoutId) {
    sendJson(res, 400, { error: 'checkout_id is required' });
    return;
  }

  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });

    sendJson(res, 200, {
      status: checkout.status,
      productName: checkout.product?.name,
      totalAmount: checkout.totalAmount,
      currency: checkout.currency,
      customerEmail: checkout.customerEmail,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
