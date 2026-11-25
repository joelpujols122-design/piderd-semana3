import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent, IonCard, IonCardContent, IonList, IonSearchbar, IonSelect, IonSelectOption, IonFab, IonFabButton, AlertController, ToastController } from '@ionic/angular';
import { OrderStore } from '../core/order.store';
import { Restaurant } from '../core/catalog';

@Component({
  selector: 'app-restaurants', standalone: true,
  imports: [IonRouterLink, RouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent, IonCard, IonCardContent, IonList, IonSearchbar, IonSelect, IonSelectOption, IonFab, IonFabButton],
  templateUrl: './restaurants.page.html',
})
export class RestaurantsPage {
  readonly order = inject(OrderStore);
  private readonly router = inject(Router);
  private readonly alerts = inject(AlertController);
  private readonly toasts = inject(ToastController);
  readonly query = signal('');
  readonly province = signal('Santo Domingo');
  readonly filtered = computed(() => {
    if (this.province() !== 'Santo Domingo') {
      return [];
    }

    const search = this.query().trim().toLocaleLowerCase('es');
    return this.order.restaurants().filter(restaurant =>
      restaurant.name.toLocaleLowerCase('es').includes(search)
    );
  });

  async choose(restaurant: Restaurant): Promise<void> {
    if (this.order.count() && this.order.selectedRestaurant().id !== restaurant.id) {
      const alert = await this.alerts.create({
        header: '¿Cambiar de restaurante?',
        message: 'Tu carrito pertenece a otro restaurante. Al cambiar, se quitarán sus productos.',
        buttons: [
          { text: 'Conservar pedido', role: 'cancel' },
          { text: 'Cambiar', handler: () => this.navigate(restaurant) },
        ],
      });
      await alert.present();
      return;
    }
    this.navigate(restaurant);
  }

  private navigate(restaurant: Restaurant): void {
    this.order.selectRestaurant(restaurant);
    void this.router.navigateByUrl('/menu');
  }

  async refresh(event: CustomEvent): Promise<void> {
    const refresher = event.target as HTMLIonRefresherElement;
    try {
      await Promise.all([this.order.refreshCatalog(), new Promise(resolve => setTimeout(resolve, 550))]);
      const toast = await this.toasts.create({
        message: 'Lista de restaurantes revisada.',
        duration: 1800,
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });
      await toast.present();
    } catch {
      const toast = await this.toasts.create({
        message: 'No se pudo revisar la lista. Intenta otra vez.',
        duration: 2600,
        color: 'danger',
      });
      await toast.present();
    } finally {
      await refresher.complete();
    }
  }
}
