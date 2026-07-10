import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'sandbox',
});

export function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function getQueryParam(req, name) {
  if (req.query && name in req.query) return req.query[name];

  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get(name);
}
