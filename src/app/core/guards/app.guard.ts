import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AppRoute } from '../../enums/app-route.enum';

export const appGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const userService = inject(UserService);

  const url = state.url.replace(/^\/+/, ''); // remove leading slash
  const isLoggedIn = authService?.isLoggedIn();
  const isLoginPage = url === AppRoute.Login;
  const isAddBabyPage = url === AppRoute.AddBaby;
  const userHaveBabies = userService?.userHaveBabies();

  console.log('AppGuard: Trying navigate to', url);

  // Redirect to Loading if not logged in and not on login page
  // (Occurs if it arrived via independent navigation, Firebase Auth will already change this)
  if (!isLoggedIn && !isLoginPage) {
    console.log('AppGuard: Navigating to', AppRoute.Loading);
    return router.createUrlTree(['/', AppRoute.Loading]);
  }

  // Logged in but not have baby and not in add baby page, Redirect to add baby page
  if (isLoggedIn && !userHaveBabies && !isAddBabyPage) {
    console.log('AppGuard: Navigating to', AppRoute.AddBaby);
    return router.createUrlTree(['/', AppRoute.AddBaby]);
  }

  // Redirect to home if logged in and trying to access login page
  if (isLoggedIn && isLoginPage) {
    console.log('AppGuard: Navigating to', AppRoute.HomePage);
    return router.createUrlTree(['/', AppRoute.HomePage]);
  }

  // Redirect to home if logged in, habe a baby and trying to access add-baby page
  if (isLoggedIn && userHaveBabies && isAddBabyPage) {
    console.log('AppGuard: Navigating to', AppRoute.HomePage);
    return router.createUrlTree(['/', AppRoute.HomePage]);
  }

  // Allow access if logged in and not trying to access login page or if not logged in and accessing login page
  if ((isLoggedIn && !isLoginPage) || (!isLoggedIn && isLoginPage)) {
    console.log('AppGuard: Navigating to', url);
    return true;
  }

  // Default case, deny access
  console.log('AppGuard: Access denied to', url);
  return false;
};
