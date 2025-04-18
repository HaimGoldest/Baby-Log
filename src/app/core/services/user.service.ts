import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BabyActionCategoryModel } from '../../models/baby-action-category.model';
import { UserModel } from '../../models/user.model';
import { BabyActionCategoriesService } from '../../features/baby-actions/services/baby-actions-categories.service';
import { BabiesService } from './babies.service';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  public userData = signal<UserModel | null>(null);
  public isLoggedIn = signal<boolean | null>(null);
  public pictureUrl = signal<string | null>(null);

  private isFirstCategoriesChanged = true;
  private unsubscribeUser: (() => void) | null = null;

  private router = inject(Router);
  private categoriesService = inject(BabyActionCategoriesService);
  private babiesService = inject(BabiesService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.firebaseAuthChangeListener(user);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeUser?.();
  }

  logout(): void {
    signOut(this.auth).then(() => console.log('User signed out'));
  }

  private async firebaseAuthChangeListener(user: any): Promise<void> {
    if (user) {
      const success = await this.updateUserData(user);
      this.isLoggedIn.set(success);
      this.pictureUrl.set(user.photoURL);
      this.navigateAuthUser();
    } else {
      this.isLoggedIn.set(false);
      this.pictureUrl.set(null);
      this.router.navigate(['/login']);
    }
  }

  private navigateAuthUser(): void {
    const user = this.userData();
    if (user?.babiesUids?.length) {
      this.router.navigate(['/baby-actions']);
    } else {
      this.router.navigate(['/add-baby']);
    }
  }

  private async updateUserData(user: any): Promise<boolean> {
    const userRef = doc(this.firestore, 'users', user.uid);

    this.unsubscribeUser?.();
    this.unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as UserModel;
        const updated = new UserModel(
          data.uid,
          data.name,
          data.babyActionsPref,
          data.babiesUids
        );
        this.userData.set(updated);
        this.categoriesService.updateCategories(data.babyActionsPref);
      }
    });

    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      const newUser = new UserModel(
        user.uid,
        user.displayName,
        this.categoriesService.getCategories(),
        []
      );
      await setDoc(userRef, newUser.toJsObject());
      this.userData.set(newUser);
      return true;
    } else {
      const data = snapshot.data();
      const existingUser = new UserModel(
        data.uid,
        data.name,
        data.babyActionsPref,
        data.babiesUids
      );
      this.userData.set(existingUser);
      this.categoriesService.updateCategories(data.babyActionsPref);
      return true;
    }
  }

  public updateUserBabyActionsPrefInDb(newPrefs: BabyActionCategoryModel[]) {
    if (this.isFirstCategoriesChanged) {
      this.isFirstCategoriesChanged = false;
      return;
    }

    const currentUser = this.userData();
    if (!currentUser) return;

    const updatedUser = new UserModel(
      currentUser.uid,
      currentUser.name,
      newPrefs.slice(),
      currentUser.babiesUids
    );

    const ref = doc(this.firestore, 'users', currentUser.uid);
    updateDoc(ref, { babyActionsPref: newPrefs.map((c) => c.toJsObject()) })
      .then(() => this.userData.set(updatedUser))
      .catch((error) => console.error('Failed to update prefs:', error));
  }
}
