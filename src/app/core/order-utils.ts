import type { CartLine, DeliveryMode } from './catalog';

export const DELIVERY_FEE = 80;
export const MAX_QUANTITY = 20;
export function normalizedQuantity(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(MAX_QUANTITY, Math.trunc(value))) : 0;
}
export function orderTotals(lines: readonly CartLine[], mode: DeliveryMode) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * normalizedQuantity(line.quantity), 0);
  const delivery = subtotal > 0 && mode === 'delivery' ? DELIVERY_FEE : 0;
  return { subtotal, delivery, total: subtotal + delivery };
}
export function addressRequired(mode: DeliveryMode, address: string): boolean {
  return mode === 'delivery' && address.trim().length < 8;
}
export function money(amount: number): string { return `RD$${amount.toLocaleString('es-DO')}`; }
