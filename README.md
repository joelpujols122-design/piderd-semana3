# PideRD — Semana 3

Aplicación Ionic Angular standalone con tres interfaces: Restaurantes, Menú de comidas y Carrito y pedido. Datos de ejemplo; no realiza pedidos, pagos ni delivery reales.

Proyecto académico grupal de Programación de Dispositivos Móviles, UAPA.

Equipo: Yohangel Ariel Jimenez Rodriguez, Ramón Antonio Hernández Contreras y Joel Pujols Vicioso.

## Ubicación del código

- `src/app/pages/`: las tres pantallas.
- `src/app/gestures/`: ampliación de imagen y pulsación prolongada.
- `src/app/app.component.html`: menú lateral y adaptación a tablet.
- `src/app/core/`: catálogo y estado del pedido.
- `android/`: proyecto nativo para instalar y probar en un teléfono o emulador.

## Ejecutar

Requiere Node 22.22.3+, 24.15+ o 26+.

```sh
npm ci
npm start
```

Abrir http://127.0.0.1:8100. Compilar con `npm run build`; ejecutar pruebas con `npm test`.

## Android

Con Android Studio, SDK y JDK compatibles con Capacitor 8 instalados:

```sh
npm run android:sync
npm run android:open
```

Seleccionar un emulador o dispositivo en Android Studio y ejecutar **Run**. El proyecto Android se incluye; una vista móvil en el navegador no sustituye esta comprobación.

La versión Android actual es 1.0.1. Las capturas y el video de demostración académica se entregan por separado.

## Gestos

- Carrito: deslizar un producto hacia la izquierda revela Eliminar; completar el deslizamiento lo elimina. `ionSwipe` se escucha en `ion-item-options`, como establece la API actual.
- Restaurantes: arrastrar desde arriba relee el catálogo local empaquetado y finaliza `ion-refresher.complete()`; no simula una consulta a restaurantes reales.
- Menú: separar dos dedos sobre la imagen amplía entre 1× y 3×. El porcentaje y Restablecer permiten reconocer el resultado.
- Menú: mantener 650 ms sobre el nombre/descripción de un producto abre un Action Sheet. Arrastrar más de 10 px, terminar o cancelar el toque cancela la presión pendiente. El botón de tres puntos ofrece la misma acción con teclado.

## Fotografías e ícono

Los créditos y licencias de las fotografías están en [FUENTES_FOTOS.md](src/assets/images/FUENTES_FOTOS.md). También se pueden consultar desde el menú lateral de la app.

El ícono editable está en [branding/piderd-icon.svg](branding/piderd-icon.svg). La bolsa procede de Ionicons; su [licencia MIT](branding/IONICONS-LICENSE.txt) se incluye con los recursos de identidad.

## Fuentes técnicas

- https://ionicframework.com/docs/angular/build-options
- https://ionicframework.com/docs/api/item-sliding
- https://ionicframework.com/docs/api/item-options
- https://ionicframework.com/docs/api/refresher
- https://ionicframework.com/docs/utilities/gestures
- https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Multi-touch_interaction
- https://angular.dev/reference/versions

La guía docente orienta los componentes. Se corrigen dos simplificaciones de sus ejemplos: `ionSwipe` pertenece a las opciones de la fila y `GestureDetail` no incluye un factor de pinch; la ampliación se calcula con dos contactos táctiles reales.
