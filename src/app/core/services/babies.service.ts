import { inject, Injectable, signal, Signal, computed } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { Baby } from '../../models/baby.model';
import { FireStoreHelperService } from '../firebase/fire-store-helper.service';
import { FireStorageHelperService } from '../firebase/fire-storage-helper.service';
import { Gender } from '../../enums/gender.enum';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class BabiesService {
  private imagesRootPath = 'baby_images';
  private firestoreHelper = inject(FireStoreHelperService);
  private fireStorageHelper = inject(FireStorageHelperService);

  public babiesCollection = 'babies';

  private _baby = signal<Baby | null>(null);
  public readonly baby: Signal<Baby | null> = this._baby.asReadonly();

  private _babyImageUrl: string | null = null;
  public babyImageUrl = computed<Promise<string>>(async () => {
    if (this._babyImageUrl) return this._babyImageUrl;

    const baby = this._baby();
    if (baby || baby.haveImageInStorage) {
      this._babyImageUrl = await this.getBabyImageUrl(baby.uid);
      return this._babyImageUrl;
    }

    return '';
  });

  private babySubscription: Subscription | null = null;

  /**
   * Sets the current baby and begins real-time listening.
   */
  public async setBaby(
    babyUid: string,
    user: User | null = null
  ): Promise<Baby | null> {
    this.stopListeningToBabyChanges();

    try {
      const existing = await firstValueFrom(
        this.firestoreHelper.get<Baby>(this.babiesCollection, babyUid)
      );

      if (existing) {
        if (user && !existing.usersUids.includes(user.uid)) {
          console.log('Adding user to baby record:', user.uid);
          await this.addUserIdToBaby(existing, user.uid);
          existing.usersUids.push(user.uid);
          console.log('User added to baby:', user.uid);
        }

        this._baby.set(existing);
        this.startListeningToBabyChanges(babyUid);
        console.log('Baby set successfully:', existing);
        return existing;
      } else {
        this._baby.set(null);
        console.error('No baby found with the given UID:', babyUid);
      }
    } catch (err) {
      console.error('Failed to get the baby from the DB:', err);
    }

    return null;
  }

  /**
   * Creates a new baby record in Firestore.
   */
  public async createNewBaby(
    userId: string,
    babyData: {
      uid: string;
      name: string;
      gender: Gender;
      birthDate: Date;
      haveImageInStorage: boolean;
    }
  ): Promise<void> {
    try {
      const baby: Baby = {
        ...babyData,
        eventsData: [],
        measurementsData: [],
        usersUids: [userId],
      };

      console.log('Creating baby record in DB:', baby);
      await firstValueFrom(
        this.firestoreHelper.add<Baby>(this.babiesCollection, baby, baby.uid)
      );
      console.log('Baby created in DB:', baby);
      this._baby.set(baby);
      this.startListeningToBabyChanges(baby.uid);
    } catch (error) {
      console.error('Error creating baby in database:', error);
    }
  }

  /**
   * Deletes or removes user from baby record.
   */
  public async deleteBaby(userUid: string, baby: Baby): Promise<void> {
    try {
      if (baby.usersUids.length > 1) {
        console.log(`Removing user ${userUid} from baby ${baby.uid}`);
        await this.removeCurrentUserFromBaby(userUid, baby);
      } else {
        console.log('Deleting baby record and storage:', baby.uid);
        await this.deleteBabyFromDatabase(baby);
      }
      this._baby.set(null);
    } catch (err) {
      console.error('Error deleting baby:', err);
      throw err;
    }
  }

  /**
   * Updates the current baby data.
   */
  public async updateBaby(babyData: Partial<Baby>): Promise<void> {
    try {
      const baby = this._baby();
      if (!baby) throw new Error('No baby selected.');

      const updatedBaby: Baby = { ...baby, ...babyData } as Baby;
      console.log('Updating baby record:', updatedBaby);
      await firstValueFrom(
        this.firestoreHelper.update<Baby>(
          this.babiesCollection,
          baby.uid,
          updatedBaby
        )
      );
      console.log('Baby updated:', updatedBaby);
      this._baby.set(updatedBaby);
    } catch (error) {
      console.error('Error updating baby:', error);
    }
  }

  /**
   * Uploads an image file for the baby.
   */
  public async uploadBabyImage(babyUid: string, image: File): Promise<void> {
    const imagePath = `${this.imagesRootPath}/${babyUid}`;
    try {
      console.log(`Uploading image to ${imagePath}`);
      await this.fireStorageHelper.uploadFile(imagePath, image);
      const updatedBaby: Baby = {
        ...this.baby(),
        haveImageInStorage: true,
      };
      await this.updateBaby(updatedBaby);
      console.log(`Image uploaded successfully for baby ${babyUid}`);
    } catch (error: any) {
      console.error(`Failed to upload image for baby ${babyUid}:`, error);
    }
  }

  /**
   * Retrieves the download URL for a baby's image.
   */
  public async getBabyImageUrl(babyUid: string): Promise<string | null> {
    if (this._babyImageUrl) return this._babyImageUrl;

    try {
      const imagePath = `${this.imagesRootPath}/${babyUid}`;
      console.log(`Retrieving image URL for ${imagePath}`);
      const imageUrl = await this.fireStorageHelper.getFileUrl(imagePath);

      if (!imageUrl) {
        console.warn('Baby image not found in storage:', babyUid);
        return null;
      }

      console.log(
        `Image URL retrieved successfully for baby ${babyUid}:`,
        imageUrl
      );
      return imageUrl;
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('Baby image not found in storage:', babyUid);
        return null;
      } else {
        console.error('Error retrieving baby image URL:', error);
        return null;
      }
    }
  }

  /**
   * Stops listening and resets state.
   */
  public dispose(): void {
    this.stopListeningToBabyChanges();
    this._baby.set(null);
  }

  /**
   * Appends a user ID to a baby document.
   */
  private async addUserIdToBaby(baby: Baby, newUserUid: string): Promise<void> {
    console.log(`Adding userId ${newUserUid} to baby ${baby.uid}`);
    await firstValueFrom(
      this.firestoreHelper.update<Baby>(this.babiesCollection, baby.uid, {
        usersUids: [...baby.usersUids, newUserUid],
      })
    );
    console.log(`UserId ${newUserUid} added to baby record ${baby.uid}`);
  }

  /**
   * Removes a user ID from a baby document.
   */
  private async removeCurrentUserFromBaby(
    userUid: string,
    baby: Baby
  ): Promise<void> {
    console.log(`Removing userId ${userUid} from baby ${baby.uid}`);
    const updated = baby.usersUids.filter((uid) => uid !== userUid);
    await firstValueFrom(
      this.firestoreHelper.update<Baby>(this.babiesCollection, baby.uid, {
        usersUids: updated,
      })
    );
    console.log(`UserId ${userUid} removed from baby record ${baby.uid}`);
  }

  /**
   * Deletes a baby record and its image.
   */
  private async deleteBabyFromDatabase(baby: Baby): Promise<void> {
    const imagePath = `${this.imagesRootPath}/${baby.uid}`;
    console.log(`Deleting baby record ${baby.uid}`);
    await firstValueFrom(
      this.firestoreHelper.delete(this.babiesCollection, baby.uid)
    );
    console.log('Baby deleted from DB:', baby);

    try {
      await this.fireStorageHelper.deleteFile(imagePath);
      console.log('Baby image deleted from storage:', imagePath);
    } catch (err) {
      console.error('Error deleting baby image from storage:', err);
    }
  }

  /**
   * Begins real-time listening for baby document changes.
   */
  private startListeningToBabyChanges(babyUid: string): void {
    console.log(`Starting real-time listener for baby ${babyUid}`);
    this.babySubscription = this.firestoreHelper
      .watch<Baby>(this.babiesCollection, babyUid)
      .subscribe({
        next: (data) => {
          if (data) {
            this._baby.set(data);
          }
        },
        error: (err) => console.error('Real-time listener error:', err),
      });
  }

  /**
   * Stops real-time listening.
   */
  private stopListeningToBabyChanges(): void {
    if (this.babySubscription) {
      console.log('Stopping real-time listener');
      this.babySubscription.unsubscribe();
      this.babySubscription = null;
    }
  }
}
