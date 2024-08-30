import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { BabyActionCategoriesService } from './baby-actions-categories.service';
import { BabyActionCategoryModel } from '../models/baby-action-category.model';
import { BabyModel } from '../models/baby.model';
import { BabiesService } from './babies.service';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  public userData = new BehaviorSubject<UserModel | null>(null);
  public isLoggedIn = new BehaviorSubject<boolean | null>(null);
  public pictureUrl = new BehaviorSubject<string | null>(null);

  public babyActionsCategoriesChanged: Subscription;
  public maxBabiesLimit = 1;

  private isFirstCategoriesChanged = true;
  private userChanged: Subscription | null = null;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private categoriesService: BabyActionCategoriesService,
    private babiesService: BabiesService
  ) {
    this.angularFireAuth.authState.subscribe((user) =>
      this.firebaseAuthChangeListener(user, this.router)
    );

    this.subscribeBabyActionsCategoriesChanged();
  }

  public ngOnDestroy(): void {
    if (this.babyActionsCategoriesChanged) {
      this.babyActionsCategoriesChanged.unsubscribe();
    }
    if (this.userChanged) {
      this.userChanged.unsubscribe();
    }
  }

  public logout(): void {
    console.log('logout by button');
    this.angularFireAuth.signOut();
  }

  public async addNewBaby(name: string, birthDate: string): Promise<boolean> {
    const currentUserUid = this.userData.value.uid;
    const babyUid = this.firestore.createId();

    const babyModel = new BabyModel(
      babyUid,
      name,
      new Date(birthDate),
      [],
      [],
      [currentUserUid]
    );

    const isBabyAddedToUser = await this.tryAddBabyIdToUser(babyModel);

    if (
      isBabyAddedToUser &&
      (await this.babiesService.addBabyToDb(
        babyUid,
        name,
        birthDate,
        currentUserUid
      ))
    ) {
      return true;
    } else {
      console.error('Error - failed to add new baby document to DB!');
      return false;
    }
  }

  public async addExistingBaby(babyUid: string): Promise<boolean> {
    const babyExist = await this.babiesService.setBaby(babyUid);
    let babyModel = this.babiesService.babyData.getValue();

    if (babyExist && babyModel && (await this.tryAddBabyIdToUser(babyModel))) {
      console.log('Existing baby was added to the user:', babyModel);
      return true;
    } else {
      console.warn(
        'Failed to add baby to the user, the baby not found in database or alrady exsist for this user.'
      );
      return false;
    }
  }

  public async deleteBabyOnlyFromUser(babyUid: string): Promise<boolean> {
    const currentUser = this.userData.value;

    if (!currentUser) {
      console.error('No user is currently logged in.');
      return false;
    }

    const babyIndex = currentUser.babiesUids.indexOf(babyUid);

    if (babyIndex === -1) {
      console.warn('The baby does not exist in the user data.');
      return false;
    }

    currentUser.babiesUids.splice(babyIndex, 1);

    const userRef = this.firestore.collection('users').doc(currentUser.uid);

    try {
      await userRef.update({ babiesUids: currentUser.babiesUids });
      console.log('Baby removed from user successfully.');
      this.userData.next(currentUser);
      this.babiesService.currentBabyimageUrl.next(null); // Reset currentBabyimageUrl after deletion
      return true;
    } catch (error) {
      console.error('Error removing baby from user: ', error);
      return false;
    }
  }

  private async firebaseAuthChangeListener(
    authData: firebase.User,
    router: Router
  ): Promise<void> {
    if (authData) {
      console.log('Logged in:');
      console.log(authData);

      try {
        const userWasUpdated = await this.updateUserData(authData);
        if (!userWasUpdated) {
          throw new Error('Failed to get the user from database!');
        }

        this.isLoggedIn.next(true);
        this.pictureUrl.next(authData.photoURL);
        this.navigateAuthUser(router);
      } catch (error) {
        console.error('Error during user update:', error);
        throw new Error('Failed to get the user from database!');
      }
    } else {
      console.log('Logged out: moving to login page.');
      this.isLoggedIn.next(false);
      this.pictureUrl.next(null);
      router.navigate(['./login']);
    }
  }

  private navigateAuthUser(router: Router): void {
    const haveBabies = this.userData?.getValue()?.babiesUids?.length > 0;

    if (haveBabies) {
      router.navigate(['./baby-actions']);
      console.log('Moving to baby-actions page.');
    } else {
      router.navigate(['./add-baby']);
      console.log('Moving to add-baby page.');
    }
  }

  private updateUserData(authData: firebase.User): Promise<boolean> {
    const userRef = this.firestore.collection('users').doc(authData.uid);

    this.subscribeUserChangedOnDb(userRef);

    return userRef
      .get()
      .toPromise()
      .then((doc) => {
        if (!doc.exists) {
          // User does not exist in DB, creating a new doc for user.
          const newUserData = new UserModel(
            authData.uid,
            authData.displayName,
            this.categoriesService.getCategories(),
            []
          );

          // create user in DB
          return userRef
            .set(newUserData.toJsObject())
            .then(() => {
              // user doc created in DB, update this.userData with user data.
              const newUser = new UserModel(
                authData.uid,
                authData.displayName,
                this.categoriesService.getCategories(),
                []
              );
              this.userData.next(newUser);
              console.log('New user document created successfully.');
              this.updateCurrentBabyInBabiesService();
              return true;
            })
            .catch((error) => {
              // failed to add user doc to DB
              console.error(
                'Error - failed to add new user document to database: ',
                error
              );
              return false;
            });
        } else {
          // user already exists in DB, update this.userData with user data.
          const data = doc.data() as UserModel;

          if (!data) {
            console.error('Failed to upload user details from database!');
            return false;
          }

          const existingUser = new UserModel(
            data.uid,
            data.name,
            data.babyActionsPref,
            data.babiesUids
          );
          this.userData.next(existingUser);
          this.categoriesService.updateCategories(data.babyActionsPref);
          console.log('User already exists in the database.');
          this.updateCurrentBabyInBabiesService();
          return true;
        }
      })
      .catch((error) => {
        console.error('Error retrieving user document: ', error);
        return false;
      });
  }

  private updateUserBabyActionsPrefInDb(
    newBabyCategories: BabyActionCategoryModel[]
  ) {
    // if isFirstCategoriesChanged the Categories values are from the DB so the DB not need an update.
    if (this.isFirstCategoriesChanged) {
      this.isFirstCategoriesChanged = false;
      return;
    }

    const currentUser = this.userData.value;

    if (currentUser) {
      const updatedUser = new UserModel(
        currentUser.uid,
        currentUser.name,
        newBabyCategories.slice(),
        currentUser.babiesUids
      );

      const jsBabyCategories = newBabyCategories.map((category) =>
        category.toJsObject()
      );
      const userRef = this.firestore.collection('users').doc(currentUser.uid);

      userRef
        .update({
          babyActionsPref: jsBabyCategories,
        })
        .then(() => {
          this.userData.next(updatedUser);
          console.log('User babyActionsPref updated successfully.');
        })
        .catch((error) => {
          console.error('Error updating babyActionsPref: ', error);
        });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  private tryAddBabyIdToUser(baby: BabyModel): Promise<boolean> {
    if (this.userData.value.babiesUids.length >= this.maxBabiesLimit) {
      console.warn('The user aleady have a baby!');
      return Promise.resolve(false);
    }

    this.userData.value.babiesUids.push(baby.uid);

    const currentUser = this.userData.getValue();
    const userRef = this.firestore.collection('users').doc(currentUser.uid);

    return userRef
      .update({
        babiesUids: this.userData.value.babiesUids,
      })
      .then(() => {
        this.userData.next(currentUser);
        return true;
      })
      .catch((error) => {
        console.error('Error updating user babiesUids: ', error);
        return false;
      });
  }

  private async updateCurrentBabyInBabiesService(): Promise<void> {
    const babiesUids = this.userData.getValue().babiesUids;
    if (babiesUids && babiesUids.length > 0) {
      await this.babiesService.setBaby(babiesUids[0]);
    }
  }

  private subscribeUserChangedOnDb(
    userRef: AngularFirestoreDocument<unknown>
  ): void {
    this.userChanged = userRef.valueChanges().subscribe((data: UserModel) => {
      if (data) {
        const updatedUser = new UserModel(
          data.uid,
          data.name,
          data.babyActionsPref,
          data.babiesUids
        );
        this.userData.next(updatedUser);
      }
    });
  }

  private subscribeBabyActionsCategoriesChanged() {
    this.babyActionsCategoriesChanged =
      this.categoriesService.babyActionsCategoriesChanged.subscribe(
        (newBabyCategories: BabyActionCategoryModel[]) => {
          this.updateUserBabyActionsPrefInDb(newBabyCategories);
        }
      );
  }
}
