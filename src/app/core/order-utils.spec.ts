import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './catalog';
import { addressRequired, normalizedQuantity, orderTotals } from './order-utils';
import { distance, movedOutsidePress, pinchScale } from '../gestures/gesture-utils';

const twoProducts = PRODUCTS.map(product => ({ product, quantity: 1 }));
describe('revisión de un pedido', () => {
  it('muestra 400 de comida y 80 de delivery antes de confirmar', () => {
    expect(orderTotals(twoProducts, 'delivery')).toEqual({ subtotal: 400, delivery: 80, total: 480 });
  });
  it('quita el costo de entrega al elegir recoger y nunca cobra envío a un carrito vacío', () => {
    expect(orderTotals(twoProducts, 'pickup').total).toBe(400);
    expect(orderTotals([], 'delivery')).toEqual({ subtotal: 0, delivery: 0, total: 0 });
  });
  it('actualiza el importe al cambiar cantidades', () => {
    expect(orderTotals([{ product: PRODUCTS[0], quantity: 2 }, { product: PRODUCTS[1], quantity: 3 }], 'delivery').total).toBe(980);
  });
  it('impide cantidades negativas, infinitas o superiores al límite', () => {
    expect([-3, 0, 1.8, 21, Infinity, NaN].map(normalizedQuantity)).toEqual([0, 0, 1, 20, 0, 0]);
  });
  it('solo exige dirección con delivery y rechaza espacios en blanco', () => {
    expect(addressRequired('delivery', '       ')).toBe(true);
    expect(addressRequired('delivery', 'Calle Ejemplo 12')).toBe(false);
    expect(addressRequired('pickup', '')).toBe(false);
  });
});
describe('límites de gestos táctiles', () => {
  it('amplía con dos puntos que se separan y conserva el rango 1–3', () => {
    expect(distance({ clientX: 0, clientY: 0 }, { clientX: 30, clientY: 40 })).toBe(50);
    expect(pinchScale(100, 180, 1)).toBeCloseTo(1.8);
    expect(pinchScale(100, 600, 1)).toBe(3);
    expect(pinchScale(100, 30, 2)).toBe(1);
    expect(pinchScale(0, 100, 1.5)).toBe(1.5);
  });
  it('cancela la presión al arrastrar incluso en diagonal y tolera el pequeño temblor del dedo', () => {
    expect(movedOutsidePress(6, 6)).toBe(false);
    expect(movedOutsidePress(8, 8)).toBe(true);
    expect(movedOutsidePress(0, 11)).toBe(true);
  });
});
