import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { distance, pinchScale } from './gesture-utils';

@Directive({ selector: '[appPinchZoom]', standalone: true, exportAs: 'pinchZoom' })
export class PinchZoomDirective implements AfterViewInit, OnDestroy {
  @Output() readonly zoomChanged = new EventEmitter<number>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private initialDistance = 0;
  private baseScale = 1;
  private scale = 1;
  private image?: HTMLImageElement;
  private readonly start = (event: TouchEvent): void => {
    if (event.touches.length !== 2) return;
    this.initialDistance = distance(event.touches[0], event.touches[1]);
    this.baseScale = this.scale;
    event.preventDefault();
  };
  private readonly move = (event: TouchEvent): void => {
    if (event.touches.length !== 2 || !this.initialDistance) return;
    event.preventDefault();
    this.apply(pinchScale(this.initialDistance, distance(event.touches[0], event.touches[1]), this.baseScale));
  };
  private readonly finish = (): void => { this.initialDistance = 0; };
  ngAfterViewInit(): void {
    const host = this.element.nativeElement;
    this.image = host.querySelector('img') ?? undefined;
    host.addEventListener('touchstart', this.start, { passive: false });
    host.addEventListener('touchmove', this.move, { passive: false });
    host.addEventListener('touchend', this.finish);
    host.addEventListener('touchcancel', this.finish);
    this.apply(1);
  }
  reset(): void { this.initialDistance = 0; this.apply(1); }
  private apply(value: number): void {
    this.scale = value;
    if (this.image) this.image.style.transform = `scale(${value})`;
    this.element.nativeElement.dataset['scale'] = value.toFixed(2);
    this.zoomChanged.emit(Math.round(value * 100));
  }
  ngOnDestroy(): void {
    const host = this.element.nativeElement;
    host.removeEventListener('touchstart', this.start);
    host.removeEventListener('touchmove', this.move);
    host.removeEventListener('touchend', this.finish);
    host.removeEventListener('touchcancel', this.finish);
  }
}
