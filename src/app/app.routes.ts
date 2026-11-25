import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'restaurantes', loadComponent: () => import('./pages/restaurants.page').then(m => m.RestaurantsPage) },
  { path: 'menu', loadComponent: () => import('./pages/menu.page').then(m => m.MenuPage) },
  { path: 'carrito', loadComponent: () => import('./pages/cart.page').then(m => m.CartPage) },
  { path: '', redirectTo: 'restaurantes', pathMatch: 'full' },
  { path: '**', redirectTo: 'restaurantes' },
];
