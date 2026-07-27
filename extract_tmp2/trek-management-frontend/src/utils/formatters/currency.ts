/**
 * Formats a number as Indian Rupees (INR) using the browser-native Intl API.
 * Outputs e.g. ₹18,500 — no decimal places for whole-rupee amounts.
 *
 * The formatter is instantiated once at module level so Intl.NumberFormat
 * is not reconstructed on every call.
 */
const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}
