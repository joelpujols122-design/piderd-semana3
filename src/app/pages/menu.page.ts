import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonList, IonFab, IonFabButton, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { PRODUCTS, Product } from '../core/catalog';
import { OrderStore } from '../core/order.store';
import { MAX_QUANTITY, money } from '../core/order-utils';
import { LongPressDirective } from '../gestures/long-press.directive';
import { PinchZoomDirective } from '../gestures/pinch-zoom.directive';

@Component({
  selector: 'app-food-menu', standalone: true,
  imports: [IonRouterLink, RouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonList, IonFab, IonFabButton, LongPressDirective, PinchZoomDirective],
  templateUrl: './menu.page.html',
})
export class MenuPage {
  readonly order = inject(OrderStore);
  private readonly sheets = inject(ActionSheetController);
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);
  readonly products = PRODUCTS;
  readonly money = money;
  readonly zoomPercent = signal<Record<string, number>>({});
  private sheetOpen = false;

  setZoom(id: string, value: number): void {
    this.zoomPercent.update(values => ({ ...values, [id]: value }));
  }

  async add(product: Product): Promise<void> {
    const quantity = this.order.lines().find(line => line.product.id === product.id)?.quantity ?? 0;
    if (quantity >= MAX_QUANTITY) {
      const toast = await this.toasts.create({
        message: 'Puedes agregar hasta 20 unidades de cada producto.',
        duration: 2000,
      });
      await toast.present();
      return;
    }
    this.order.add(product);
    const toast = await this.toasts.create({
      message: `${product.name} agregado al carrito.`,
      duration: 1400,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
  async contextMenu(product: Product): Promise<void> {
    if (this.sheetOpen) {
      return;
    }
    this.sheetOpen = true;
    try {
      const sheet = await this.sheets.create({
        header: product.name,
        subHeader: money(product.price),
        buttons: [
          {
            text: 'Agregar al carrito',
            icon: 'bag-handle-outline',
            handler: () => { void this.add(product); },
          },
          {
            text: 'Ver descripción',
            icon: 'restaurant-outline',
            handler: () => { void this.describe(product); },
          },
          { text: 'Cancelar', role: 'cancel', icon: 'close-outline' },
        ],
      });
      await sheet.present();
      await sheet.onDidDismiss();
    } finally {
      this.sheetOpen = false;
    }
  }
  private async describe(product: Product): Promise<void> {
    const alert = await this.alerts.create({
      header: product.name,
      message: `${product.description} ${money(product.price)}.`,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}
