import { Injectable, Signal, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AppRoute } from '../../enums/app-route.enum';

@Injectable({ providedIn: 'root' })
export class RouteTrackerService {
  private readonly _currentRoute = signal<AppRoute | ''>('');
  public readonly currentRoute = this._currentRoute.asReadonly();
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const cleanPath = event.urlAfterRedirects.replace(/^\/+/, '');
        if (this.isAppRoute(cleanPath)) {
          this._currentRoute.set(cleanPath);
        } else {
          this._currentRoute.set('');
        }
      });
  }

  /**
   * Returns a signal<boolean> if the current route equals the given AppRoute
   */
  public isCurrentRoute(route: AppRoute): Signal<boolean> {
    return computed(() => this.currentRoute() === route);
  }

  /**
   * Type guard: check if value is in AppRoute enum
   */
  private isAppRoute(value: string): value is AppRoute {
    return Object.values(AppRoute).includes(value as AppRoute);
  }
}
