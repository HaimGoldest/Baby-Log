import { inject, Injectable, Signal, signal } from '@angular/core';
import { Baby } from '../../models/baby.model';
import { FirestoreHelperService } from './firebase/firestore-helper.service';
import { FireStorageHelperService } from './firebase/storage-helper.service';
import { Gender } from '../../enums/gender.enum';
import { Unsubscribe } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class BabiesService {
  private imagesRootPath = 'baby_images';
  private firestoreHelper = inject(FirestoreHelperService);
  private fireStorageHelper = inject(FireStorageHelperService);
  private babyUnsubscribe: Unsubscribe | null = null;

  public babiesCollection = 'babies';

  private _baby = signal<Baby | null>(null);
  public readonly baby: Signal<Baby | null> = this._baby.asReadonly();

  private _babyPictureUrl = signal<string | null>(null);
  public readonly babyPictureUrl = this._babyPictureUrl.asReadonly();

  public async setBaby(babyUid: string): Promise<Baby | null> {
    this.stopListeningToBabyChanges();

    try {
      const existing = await this.firestoreHelper.get<Baby>(
        this.babiesCollection,
        babyUid
      );

      if (existing) {
        this._baby.set(existing);
        this._babyPictureUrl.set(
          (await this.getBabyImageUrl(existing.uid)) ?? null
        );
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

  public async createNewBaby(
    userId: string,
    babyData: { uid: string; name: string; gender: Gender; birthDate: Date }
  ): Promise<void> {
    try {
      const baby: Baby = {
        ...babyData,
        eventsData: [],
        measurementsData: [],
        usersUids: [userId],
      };

      await this.firestoreHelper.add<Baby>(
        this.babiesCollection,
        baby,
        baby.uid
      );
      console.log('Baby created in DB:', baby);
      this._baby.set(baby);
    } catch (error) {
      console.error('Error creating baby in database:', error);
    }
  }

  public async deleteBaby(userUid: string, baby: Baby): Promise<void> {
    try {
      if (baby.usersUids.length > 1) {
        await this.removeCurrentUserFromBaby(userUid, baby);
      } else {
        await this.deleteBabyFromDatabase(baby);
      }
      this._baby.set(null);
    } catch (err) {
      console.error('Error deleting baby:', err);
      throw err;
    }
  }

  public async updateBaby(babyData: Partial<Baby>): Promise<void> {
    try {
      const baby = this._baby();
      if (!baby) throw new Error('No baby selected.');

      const updatedBaby = { ...baby, ...babyData };
      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        baby.uid,
        updatedBaby
      );
      console.log('Baby updated:', updatedBaby);
      this._baby.set(updatedBaby);
    } catch (error) {
      console.error('Error updating baby:', error);
    }
  }

  public async uploadBabyImage(babyUid: string, image: File): Promise<void> {
    const imagePath = `${this.imagesRootPath}/${babyUid}`;

    try {
      await this.fireStorageHelper.uploadFile(imagePath, image);
      console.log(`Image uploaded successfully for baby ${babyUid}`);
    } catch (error: any) {
      console.error(`Failed to upload image for baby ${babyUid}:`, error);
    }
  }

  public async getBabyImageUrl(babyUid: string): Promise<string | null> {
    try {
      const imagePath = `${this.imagesRootPath}/${babyUid}`;
      const imageUrl = await this.fireStorageHelper.getFileUrl(imagePath);
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

  public dispose(): void {
    this.stopListeningToBabyChanges();
    this._baby.set(null);
    this._babyPictureUrl.set(null);
  }

  private async removeCurrentUserFromBaby(
    userUid: string,
    baby: Baby
  ): Promise<void> {
    const updatedUsers = baby.usersUids.filter((uid) => uid !== userUid);
    await this.firestoreHelper.update<Baby>(this.babiesCollection, baby.uid, {
      usersUids: updatedUsers,
    });
  }

  private async deleteBabyFromDatabase(baby: Baby): Promise<void> {
    const imagePath = `${this.imagesRootPath}/${baby.uid}`;
    await this.firestoreHelper.delete(this.babiesCollection, baby.uid);
    console.log('Baby deleted from DB:', baby);
    await this.fireStorageHelper.deleteFile(imagePath);
    console.log('Baby image deleted from storage:', imagePath);
  }

  private startListeningToBabyChanges(babyUid: string) {
    this.babyUnsubscribe = this.firestoreHelper.observe<Baby>(
      this.babiesCollection,
      babyUid,
      (data) => {
        if (data) {
          this._baby.set(data);
          this.getBabyImageUrl(data.uid).then((url) =>
            this._babyPictureUrl.set(url)
          );
        }
      },
      (err) => console.error('Real-time listener error:', err)
    );
  }

  private stopListeningToBabyChanges() {
    if (this.babyUnsubscribe) {
      this.babyUnsubscribe();
      this.babyUnsubscribe = null;
    }
  }
}
