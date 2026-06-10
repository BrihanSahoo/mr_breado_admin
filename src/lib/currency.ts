export function formatCurrency(value: unknown): string {
  const n = Number(value);
  return `₹${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
}
