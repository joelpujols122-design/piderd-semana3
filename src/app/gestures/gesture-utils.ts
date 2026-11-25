export function distance(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
export function pinchScale(initialDistance: number, currentDistance: number, baseScale: number): number {
  if (initialDistance <= 0 || !Number.isFinite(currentDistance)) return baseScale;
  return Math.max(1, Math.min(3, baseScale * currentDistance / initialDistance));
}
export function movedOutsidePress(deltaX: number, deltaY: number): boolean { return Math.hypot(deltaX, deltaY) > 10; }
