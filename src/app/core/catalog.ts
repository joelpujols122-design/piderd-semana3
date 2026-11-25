export interface Restaurant { id: string; name: string; description: string; tag: string; time: string; image: string; }
export interface Product { id: string; name: string; description: string; price: number; image: string; category: string; }
export interface CartLine { product: Product; quantity: number; }
export type DeliveryMode = 'delivery' | 'pickup';

export const RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'La Cocina Criolla', description: 'Comida de casa, con todo el sabor de aquí.', tag: 'Criolla', time: '25–35 min', image: 'assets/images/pollo-real.jpg' },
  { id: 'r2', name: 'Sabor del Patio', description: 'Un encuentro con nuestros sabores favoritos.', tag: 'Casera', time: '20–30 min', image: 'assets/images/patio-real.jpg' },
  { id: 'r3', name: 'El Fogón RD', description: 'Platos preparados al momento y mucho sazón.', tag: 'Dominicana', time: '30–40 min', image: 'assets/images/fogon-real.jpg' },
];
export const PRODUCTS: Product[] = [
  { id: 'pollo', name: 'Pollo guisado', description: 'Con arroz blanco, habichuelas y ensalada fresca.', price: 300, image: 'assets/images/pollo-real.jpg', category: 'Plato del día' },
  { id: 'jugo', name: 'Jugo de chinola', description: 'Chinola natural, servido frío. Vaso de 16 oz.', price: 100, image: 'assets/images/chinola-real.jpg', category: 'Para acompañar' },
];
