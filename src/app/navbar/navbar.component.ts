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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.userService.pictureUrl$.subscribe((url) => {
      this.pictureUrl = url;
      console.log('pictureUrl updated to: ' + this.pictureUrl);
    });
  }

  logout() {
    this.userService.logout();
  }
}
