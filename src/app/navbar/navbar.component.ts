import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean;
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
      this.pictureUrl = url;
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
}
