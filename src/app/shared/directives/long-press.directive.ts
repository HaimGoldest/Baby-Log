import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

/**
 * Emits `longPress` when a pointer is held still on the host, and immediately
 * on a desktop right-click or the keyboard context-menu key.
 *
 * The host keeps its own `(click)` binding for the short-tap action: this
 * directive only swallows the click the browser fires on release of a press
 * that had already become a long press.
 */
@Directive({
  selector: '[appLongPress]',
  standalone: true,
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerEnd()',
    '(pointercancel)': 'onPointerEnd()',
    '(pointerleave)': 'onPointerEnd()',
    '(contextmenu)': 'onContextMenu($event)',
    '[class.is-pressing]': 'isPressing()',
  },
})
export class LongPressDirective implements OnDestroy {
  /** Movement beyond this many pixels is a scroll gesture, not a press. */
  private static readonly MOVE_TOLERANCE_PX = 10;

  /** How long an armed click suppressor waits for the click it expects. */
  private static readonly SUPPRESS_WINDOW_MS = 700;

  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  public readonly appLongPressDelay = input(400);
  public readonly longPress = output<void>();

  private readonly pressing = signal(false);
  public readonly isPressing = this.pressing.asReadonly();

  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private suppressTimer: ReturnType<typeof setTimeout> | null = null;
  private origin: { x: number; y: number } | null = null;
  private firedThisGesture = false;

  /**
   * Registered on `window` in the capture phase, which runs before anything
   * bound on the host, so the ordering between this and the host's own click
   * binding is guaranteed rather than incidental.
   */
  private readonly onCaptureClick = (event: MouseEvent): void => {
    // Only the host's own click is swallowed: a tap on the menu this press
    // just opened lands outside the host and must pass through untouched.
    if (!this.host.contains(event.target as Node)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.disarmClickSuppressor();
  };

  public ngOnDestroy(): void {
    this.cancelPress();
    this.disarmClickSuppressor();
  }

  public onPointerDown(event: PointerEvent): void {
    // A new gesture begins: anything the previous one armed is stale.
    this.disarmClickSuppressor();
    this.firedThisGesture = false;

    if (event.pointerType === 'mouse' && event.button !== 0) return;

    this.origin = { x: event.clientX, y: event.clientY };
    this.pressing.set(true);
    this.pressTimer = setTimeout(() => this.fire(), this.appLongPressDelay());
  }

  public onPointerMove(event: PointerEvent): void {
    if (!this.origin) return;

    const tolerance = LongPressDirective.MOVE_TOLERANCE_PX;
    const moved =
      Math.abs(event.clientX - this.origin.x) > tolerance ||
      Math.abs(event.clientY - this.origin.y) > tolerance;

    if (moved) this.cancelPress();
  }

  public onPointerEnd(): void {
    this.cancelPress();
  }

  public onContextMenu(event: Event): void {
    // Unconditional, and before any early return: every contextmenu reaching
    // this element is the browser's menu, and it is never wanted here.
    event.preventDefault();
    event.stopPropagation();

    this.cancelPress();

    // Android raises contextmenu at roughly the same moment the timer fires;
    // whichever wins, the gesture only ever emits once.
    if (this.firedThisGesture) return;

    this.firedThisGesture = true;
    this.longPress.emit();
  }

  private fire(): void {
    this.cancelPress();
    this.firedThisGesture = true;
    this.armClickSuppressor();
    this.longPress.emit();
  }

  private cancelPress(): void {
    if (this.pressTimer !== null) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }

    this.origin = null;
    this.pressing.set(false);
  }

  private armClickSuppressor(): void {
    this.disarmClickSuppressor();
    window.addEventListener('click', this.onCaptureClick, true);

    // A press that never produces a click (a right-click, or a platform that
    // swallows it) must not leave the suppressor armed indefinitely.
    this.suppressTimer = setTimeout(
      () => this.disarmClickSuppressor(),
      LongPressDirective.SUPPRESS_WINDOW_MS,
    );
  }

  private disarmClickSuppressor(): void {
    window.removeEventListener('click', this.onCaptureClick, true);

    if (this.suppressTimer !== null) {
      clearTimeout(this.suppressTimer);
      this.suppressTimer = null;
    }
  }
}
