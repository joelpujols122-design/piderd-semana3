import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonRouterLink, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonRouterOutlet } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { restaurantOutline, fastFoodOutline, bagHandleOutline, locationOutline, arrowForwardOutline, chevronForwardOutline, chevronDownCircleOutline, addOutline, removeOutline, trashOutline, ellipsisHorizontal, closeOutline, checkmarkCircleOutline, bicycleOutline, storefrontOutline, checkmarkOutline, leafOutline, timeOutline, expandOutline } from 'ionicons/icons';
import { OrderStore } from './core/order.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonRouterLink, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonRouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly order = inject(OrderStore);
  readonly links = [
    { path: '/restaurantes', title: 'Restaurantes', icon: 'restaurant-outline', id: 'nav-restaurantes', caption: 'Encuentra tu próximo antojo' },
    { path: '/menu', title: 'Menú de comidas', icon: 'fast-food-outline', id: 'nav-menu', caption: 'Elige algo rico' },
    { path: '/carrito', title: 'Carrito y pedido', icon: 'bag-handle-outline', id: 'nav-carrito', caption: 'Revisa antes de confirmar' },
  ];
  constructor() {
    addIcons({ restaurantOutline, fastFoodOutline, bagHandleOutline, locationOutline, arrowForwardOutline, chevronForwardOutline, chevronDownCircleOutline, addOutline, removeOutline, trashOutline, ellipsisHorizontal, closeOutline, checkmarkCircleOutline, bicycleOutline, storefrontOutline, checkmarkOutline, leafOutline, timeOutline, expandOutline });
  }
}
