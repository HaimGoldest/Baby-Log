import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { BabiesService } from '../services/babies.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isLoggedIn: boolean | null;
  userImageUrl: string | null;
  babyImageUrl: string | null;
  userHaveBabies: boolean;

  constructor(
    private userService: UserService,
    private babiesService: BabiesService
  ) {
    this.userService.userData.subscribe((userData) => {
      this.userHaveBabies = userData?.babiesUids?.length > 0;
    });
  }

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.userService.pictureUrl.subscribe((url) => {
      this.userImageUrl = url ? `${url}?${new Date().getTime()}` : null;
    });

    this.babiesService.currentBabyimageUrl.subscribe((url) => {
      this.babyImageUrl = url ? `${url}?${new Date().getTime()}` : null;
    });
  }

  navigateRoot() {
    window.location.href = '';
  }

  logout() {
    this.userService.logout();
  }

  preventNavigation(event: Event) {
    if (this.userHaveBabies) {
      event.preventDefault();
    }
  }

  onUserImageError() {
    console.warn('User image failed to load, retrying...');
    const temp = this.userImageUrl;
    this.userImageUrl = null;
    this.userImageUrl = temp;
  }

  onBabyImageError() {
    console.warn('Baby image failed to load, retrying...');
    const temp = this.babyImageUrl;
    this.babyImageUrl = null;
    this.babyImageUrl = temp;
  }
}
