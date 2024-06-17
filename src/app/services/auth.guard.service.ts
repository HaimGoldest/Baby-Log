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
export class AuthGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const path = route.url[0].path;
    const isLoginPage = path === 'login';
    const haveBabies =
      this.userService.userData?.getValue()?.babiesUids?.length > 0;

    return this.userService.isLoggedIn.pipe(
      map((loggedIn) => {
        if (!loggedIn && !isLoginPage) {
          console.log('move to login page');
          return this.router.createUrlTree(['/login']); // Redirect to login if not logged in and not on login page
        } else if (loggedIn && !haveBabies && path !== 'add-baby') {
          console.log('move to add baby page');
          return this.router.createUrlTree(['/add-baby']); // Logged in but not have baby data, Redirect to add baby page
        } else if (loggedIn && isLoginPage) {
          console.log('move to default page');
          return this.router.createUrlTree(['/']); // Redirect to home if logged in and trying to access login page
        } else {
          console.log('move to', path, 'page');
          return true; // Allow access if logged in and not trying to access login page or if not logged in and accessing login page
        }
      })
    );
  }
}
