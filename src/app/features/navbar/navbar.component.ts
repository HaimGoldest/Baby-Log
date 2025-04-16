import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { BabiesService } from '../../core/services/babies.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn$: Observable<boolean | null>;
  userImageUrl$: Observable<string | null>;
  babyImageUrl$: Observable<string | null>;
  userHaveBabies: boolean;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private babiesService: BabiesService
  ) {
    this.userService.userData
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData) => {
        this.userHaveBabies = userData?.babiesUids?.length > 0;
      });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.userService.isLoggedIn.pipe(
      takeUntil(this.destroy$)
    );

    this.userImageUrl$ = this.userService.pictureUrl.pipe(
      takeUntil(this.destroy$),
      map((url) => (url ? url : null))
    );

    this.babyImageUrl$ = this.babiesService.currentBabyimageUrl.pipe(
      takeUntil(this.destroy$),
      map((url) => (url ? url : null))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.userImageUrl$ = null;
  }

  onBabyImageError() {
    console.warn('Baby image failed to load.');
    this.babyImageUrl$ = null;
  }
}
