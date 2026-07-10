// Currencies Stripe/Polar store as whole units, not cents.
const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw',
  'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
]);

export function formatMoney(amount, currency) {
  const normalized = (currency || '').toLowerCase();
  const value = ZERO_DECIMAL_CURRENCIES.has(normalized) ? amount : amount / 100;
  return `${value.toLocaleString()} ${normalized.toUpperCase()}`;
}
