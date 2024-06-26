import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean | null;
  pictureUrl: string | null;
  userHaveBabies: boolean;

  constructor(private userService: UserService) {
    this.userService.userData.subscribe((userData) => {
      this.userHaveBabies = userData?.babiesUids?.length > 0;
    });
  }

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.userService.pictureUrl.subscribe((url) => {
      this.pictureUrl = url ? `${url}?${new Date().getTime()}` : null;
    });
  }

  logout() {
    this.userService.logout();
  }

  preventNavigation(event: Event) {
    if (this.userHaveBabies) {
      event.preventDefault();
    }
  }

  onImageError() {
    console.warn('User image failed to load, retrying...');
    const temp = this.pictureUrl;
    this.pictureUrl = null;
    this.pictureUrl = temp;
  }
}
