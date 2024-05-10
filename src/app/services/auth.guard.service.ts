import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private isLoggedInSubscription: Subscription | null = null;

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isLoginPage = route.url[0].path === 'login';
    return this.userService.isLoggedIn$.pipe(
      take(1),
      switchMap((loggedIn) => {
        if (loggedIn && !isLoginPage) {
          return of(true); // Allow access if logged in but not trying to access login page
        }
        if (loggedIn && isLoginPage) {
          return of(false); // Deny access if logged in and trying to access login page
        }
        return of(this.router.createUrlTree(['/login'])); // Redirect to login if not logged in
      }),
      tap(() => {
        if (this.isLoggedInSubscription) {
          this.isLoggedInSubscription.unsubscribe();
          this.isLoggedInSubscription = null;
        }
      })
    );
  }
}
