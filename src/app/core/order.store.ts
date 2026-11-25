import { Injectable, computed, signal } from '@angular/core';
import { CartLine, DeliveryMode, Product, RESTAURANTS, Restaurant } from './catalog';
import { normalizedQuantity, orderTotals } from './order-utils';

@Injectable({ providedIn: 'root' })
export class OrderStore {
  readonly restaurants = signal<Restaurant[]>(RESTAURANTS.map(r => ({ ...r })));
  readonly selectedRestaurant = signal<Restaurant>(RESTAURANTS[0]);
  readonly lines = signal<CartLine[]>([]);
  readonly deliveryMode = signal<DeliveryMode>('delivery');
  readonly address = signal('');
  readonly confirmed = signal(false);
  readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly totals = computed(() => orderTotals(this.lines(), this.deliveryMode()));
  readonly lastReviewed = signal<string | null>(null);

  selectRestaurant(restaurant: Restaurant): void {
    if (this.selectedRestaurant().id !== restaurant.id) {
      this.clear();
    }
    this.selectedRestaurant.set(restaurant);
  }

  add(product: Product): void {
    this.confirmed.set(false);
    this.lines.update(lines => {
      const found = lines.find(line => line.product.id === product.id);

      if (!found) {
        return [...lines, { product, quantity: 1 }];
      }

      return lines.map(line => {
        if (line.product.id !== product.id) {
          return line;
        }

        return { ...line, quantity: normalizedQuantity(line.quantity + 1) };
      });
    });
  }

  setQuantity(id: string, quantity: number): void {
    this.confirmed.set(false);
    const value = normalizedQuantity(quantity);

    this.lines.update(lines => {
      if (value === 0) {
        return lines.filter(line => line.product.id !== id);
      }

      return lines.map(line => {
        if (line.product.id !== id) {
          return line;
        }

        return { ...line, quantity: value };
      });
    });
  }

  remove(id: string): void {
    this.setQuantity(id, 0);
  }

  setMode(mode: DeliveryMode): void {
    this.deliveryMode.set(mode);
    this.confirmed.set(false);
  }

  setAddress(value: string): void {
    this.address.set(value);
    this.confirmed.set(false);
  }

  clear(): void {
    this.lines.set([]);
    this.confirmed.set(false);
  }

  async refreshCatalog(): Promise<void> {
    const response = await fetch('assets/data/restaurantes.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('No se pudo revisar la lista.');
    }

    const catalog: unknown = await response.json();
    if (
      !Array.isArray(catalog) ||
      catalog.length !== 3 ||
      catalog.some(item => typeof item?.id !== 'string' || typeof item?.name !== 'string')
    ) {
      throw new Error('La lista no está disponible.');
    }

    this.restaurants.set(catalog as Restaurant[]);
    this.lastReviewed.set(new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }));
  }
}
