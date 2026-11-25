# PideRD — Semana 3

PideRD es una app de ejemplo hecha con Ionic y Angular. Tiene tres pantallas: Restaurantes, Menú de comidas y Carrito y pedido. Los productos y precios son de demostración.

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

Seleccionar un teléfono o emulador en Android Studio y ejecutar **Run**. Ahí se comprueba el funcionamiento de los gestos táctiles.

La versión Android actual es 1.0.2. Las capturas y el video de demostración académica se entregan por separado.

## Gestos

- Carrito: deslizar un producto a la izquierda muestra Eliminar. Un deslizamiento completo también lo quita del pedido.
- Restaurantes: tirar de la lista hacia abajo vuelve a cargar el catálogo guardado en la app.
- Menú: separar dos dedos sobre la foto la amplía, hasta tres veces su tamaño. Restablecer devuelve la imagen al tamaño inicial.
- Menú: mantener pulsado el nombre o la descripción de un plato durante 650 ms abre sus opciones. Si se mueve el dedo más de 10 px, se cancela la pulsación. El botón de tres puntos abre las mismas opciones.
- Las opciones permanecen abiertas al levantar el dedo. Para cerrarlas se elige una acción o se toca Cancelar.

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
