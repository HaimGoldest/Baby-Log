import { Injectable, signal } from '@angular/core';
import NotificationStrings from '../../shared/strings/notification.strings';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
}

/**
 * Single sink for user-facing feedback.
 *
 * Components and services push messages here instead of deciding how to render
 * them; `NotificationHostComponent` is the only consumer and renders the
 * current stack once, globally.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** How long a notification stays on screen before auto-dismissing. */
  private static readonly DEFAULT_DURATION_MS = 6000;

  /** Oldest notifications are dropped once this many are on screen. */
  private static readonly MAX_VISIBLE = 3;

  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  private readonly _notifications = signal<AppNotification[]>([]);
  public readonly notifications = this._notifications.asReadonly();

  public error(
    message: string,
    title: string = NotificationStrings.ERROR_TITLE
  ): number {
    return this.push('error', title, message);
  }

  public success(
    message: string,
    title: string = NotificationStrings.SUCCESS_TITLE
  ): number {
    return this.push('success', title, message);
  }

  public info(
    message: string,
    title: string = NotificationStrings.INFO_TITLE
  ): number {
    return this.push('info', title, message);
  }

  public dismiss(id: number): void {
    this.clearTimer(id);
    this._notifications.update((current) => current.filter((n) => n.id !== id));
  }

  public clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this._notifications.set([]);
  }

  private push(
    type: NotificationType,
    title: string,
    message: string
  ): number {
    const id = this.nextId++;
    const notification: AppNotification = { id, type, title, message };

    this._notifications.update((current) => {
      const next = [...current, notification];
      const overflow = next.slice(
        0,
        Math.max(0, next.length - NotificationService.MAX_VISIBLE)
      );
      overflow.forEach((n) => this.clearTimer(n.id));
      return next.slice(-NotificationService.MAX_VISIBLE);
    });

    this.timers.set(
      id,
      setTimeout(
        () => this.dismiss(id),
        NotificationService.DEFAULT_DURATION_MS
      )
    );

    return id;
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}
