import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output, inject } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import { movedOutsidePress } from './gesture-utils';

@Directive({ selector: '[appLongPress]', standalone: true })
export class LongPressDirective implements AfterViewInit, OnDestroy {
  @Output() readonly longPressed = new EventEmitter<void>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly controller = inject(GestureController);
  private gesture?: Gesture;
  private timer?: ReturnType<typeof setTimeout>;
  private origin?: { clientX: number; clientY: number };
  private active = false;
  private canceled = true;
  private longPressTriggered = false;

  ngAfterViewInit(): void {
    this.gesture = this.controller.create({
      el: this.element.nativeElement,
      gestureName: 'piderd-long-press',
      threshold: 0,
      disableScroll: false,
      onStart: () => {
        this.clearTimer();
        if (!this.active || this.canceled) return;
        this.timer = setTimeout(() => {
          this.timer = undefined;
          if (this.active && !this.canceled) {
            this.longPressTriggered = true;
            this.longPressed.emit();
          }
        }, 650);
      },
      onMove: event => { if (movedOutsidePress(event.deltaX, event.deltaY)) this.abort(); },
      onEnd: () => this.finish(),
    }, true);
    this.gesture.enable(true);
  }
  // Conserva el punto inicial para cancelar la pulsación si el dedo se desplaza.
  // Ionic puede agrupar movimientos y reiniciar la distancia al capturar el gesto.
  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent): void {
    if (!event.isPrimary) { this.abort(); return; }
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.startContact(event);
  }
  @HostListener('touchstart', ['$event']) onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) { this.abort(); return; }
    this.startContact(event.touches[0]);
  }
  @HostListener('pointermove', ['$event']) onPointerMove(event: PointerEvent): void { this.checkMovement(event); }
  @HostListener('touchmove', ['$event']) onTouchMove(event: TouchEvent): void {
    if (event.touches.length !== 1) { this.abort(); return; }
    this.checkMovement(event.touches[0]);
  }
  @HostListener('pointerup') @HostListener('pointercancel')
  @HostListener('touchcancel')
  @HostListener('window:blur') onContactEnd(): void { this.finish(); }
  @HostListener('touchend', ['$event']) onTouchEnd(event: TouchEvent): void {
    // Evita que al soltar el dedo se toque una opción o el fondo del menú recién abierto.
    if (this.longPressTriggered && event.cancelable) {
      event.preventDefault();
    }
    this.longPressTriggered = false;
    this.finish();
  }
  @HostListener('document:visibilitychange') onVisibilityChange(): void { if (document.hidden) this.finish(); }
  @HostListener('contextmenu', ['$event']) onContextMenu(event: Event): void { event.preventDefault(); }
  private startContact(point: { clientX: number; clientY: number }): void {
    // Un toque también puede emitir pointerdown; la misma pulsación se inicia una sola vez.
    if (this.active) return;
    this.clearTimer();
    this.origin = { clientX: point.clientX, clientY: point.clientY };
    this.longPressTriggered = false;
    this.active = true;
    this.canceled = false;
  }
  private checkMovement(point: { clientX: number; clientY: number }): void {
    if (!this.active || !this.origin) return;
    if (movedOutsidePress(point.clientX - this.origin.clientX, point.clientY - this.origin.clientY)) this.abort();
  }
  private clearTimer(): void { if (this.timer) clearTimeout(this.timer); this.timer = undefined; }
  private abort(): void { this.canceled = true; this.clearTimer(); }
  private finish(): void { this.abort(); this.active = false; this.origin = undefined; }
  ngOnDestroy(): void { this.finish(); this.gesture?.destroy(); }
}
