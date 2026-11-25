import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonRadioGroup, IonRadio, IonInput, AlertController, ToastController } from '@ionic/angular';
import { CartLine, DeliveryMode } from '../core/catalog';
import { OrderStore } from '../core/order.store';
import { MAX_QUANTITY, addressRequired, money } from '../core/order-utils';

@Component({
  selector: 'app-cart', standalone: true,
  imports: [IonRouterLink, RouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonRadioGroup, IonRadio, IonInput],
  templateUrl: './cart.page.html',
})
export class CartPage {
  readonly order = inject(OrderStore);
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);
  readonly money = money;
  readonly maxQuantity = MAX_QUANTITY;
  readonly attempted = signal(false);
  readonly busy = signal(false);
  changeMode(mode: DeliveryMode): void {
    this.order.setMode(mode);
    this.attempted.set(false);
  }

  invalidAddress(): boolean {
    return addressRequired(this.order.deliveryMode(), this.order.address());
  }

  async remove(line: CartLine, sliding: IonItemSliding): Promise<void> {
    await sliding.close();
    this.order.remove(line.product.id);
    const toast = await this.toasts.create({
      message: `${line.product.name} eliminado del carrito.`,
      duration: 1800,
      icon: 'trash-outline',
    });
    await toast.present();
  }
  async confirm(): Promise<void> {
    this.attempted.set(true);
    if (this.invalidAddress() || !this.order.count() || this.order.confirmed() || this.busy()) {
      return;
    }
    this.busy.set(true);
    const destination = this.order.deliveryMode() === 'delivery' ? `Entrega en ${this.order.address().trim()}.` : 'Recoger en el local.';
    const alert = await this.alerts.create({
      header: '¿Confirmar tu pedido?',
      message: `${this.order.selectedRestaurant().name}. ${destination} Total: ${money(this.order.totals().total)}. Este pedido es de demostración y no se enviará al restaurante.`,
      backdropDismiss: false,
      buttons: [
        { text: 'Revisar', role: 'cancel' },
        {
          text: 'Sí, confirmar',
          handler: () => {
            this.order.confirmed.set(true);
            void this.showConfirmation();
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
    this.busy.set(false);
  }
  private async showConfirmation(): Promise<void> {
    const toast = await this.toasts.create({
      message: '¡Pedido de demostración confirmado!',
      duration: 2600,
      icon: 'checkmark-circle-outline',
      color: 'success',
    });
    await toast.present();
  }
}
