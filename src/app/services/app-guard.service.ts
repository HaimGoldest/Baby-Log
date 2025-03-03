import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const url: string = state.url;
    console.log('AppGuard: Navigating to', url);

    const isLoginPage = url.includes('login');
    const haveBabies =
      this.userService.userData?.getValue()?.babiesUids?.length > 0;

    return this.userService.isLoggedIn.pipe(
      map((loggedIn) => {
        if (!loggedIn && !isLoginPage) {
          return this.router.createUrlTree(['/loading']); // Redirect to login if not logged in and not on login page
        } else if (loggedIn && !haveBabies && !url.includes('add-baby')) {
          return this.router.createUrlTree(['/add-baby']); // Logged in but not have baby data, Redirect to add baby page
        } else if (loggedIn && isLoginPage) {
          return this.router.createUrlTree(['/']); // Redirect to home if logged in and trying to access login page
        } else {
          return true; // Allow access if logged in and not trying to access login page or if not logged in and accessing login page
        }
      })
    );
  }
}
