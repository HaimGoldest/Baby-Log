import { inject, Injectable, Signal, signal } from '@angular/core';
import { Baby } from '../../models/baby.model';
import { FirestoreHelperService } from './firebase/firestore-helper.service';
import { FireStorageHelperService } from './firebase/storage-helper.service';
import { Gender } from '../../enums/gender.enum';

@Injectable({ providedIn: 'root' })
export class BabiesService {
  private _baby = signal<Baby | null>(null);
  public readonly baby: Signal<Baby | null> = this._baby.asReadonly();

  private babiesCollection = 'babies';
  private imagesRootPath = 'baby_images';
  private firestoreHelper = inject(FirestoreHelperService);
  private fireStorageHelper = inject(FireStorageHelperService);

  public async setBaby(babyUid: string): Promise<void> {
    try {
      const existing = await this.firestoreHelper.get<Baby>(
        this.babiesCollection,
        babyUid
      );

      if (existing) {
        this._baby.set(existing);
        console.log('Baby set successfully:', existing);
      } else {
        this._baby.set(null);
        console.error('No baby found with the given UID:', babyUid);
      }
    } catch (err) {
      console.error('Failed to get the baby from the DB:', err);
    }
  }

  public async uploadBabyImage(image: File): Promise<void> {
    const baby = this._baby();
    if (!baby) throw new Error('No baby selected.');

    const imagePath = `${this.imagesRootPath}/${baby.uid}`;

    try {
      await this.fireStorageHelper.uploadFile(imagePath, image);
      console.log(`Image uploaded successfully for baby ${baby.uid}`);
    } catch (error: any) {
      console.error(`Failed to upload image for baby ${baby.uid}:`, error);
    }
  }

  public async getBabyImageUrl(): Promise<string | null> {
    const baby = this._baby();
    if (!baby) throw new Error('No baby selected.');

    try {
      const imagePath = `${this.imagesRootPath}/${baby.uid}`;
      const imageUrl = await this.fireStorageHelper.getFileUrl(imagePath);
      console.log(
        `Image URL retrieved successfully for baby ${baby.uid}:`,
        imageUrl
      );
      return imageUrl;
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('Baby image not found in storage:', baby.uid);
        return null;
      } else {
        console.error('Error retrieving baby image URL:', error);
        return null;
      }
    }
  }

  public async createNewBaby(
    userId: string,
    babyData: { name: string; gender: Gender; birthDate: Date }
  ): Promise<void> {
    try {
      const baby: Baby = {
        ...babyData,
        uid: this.firestoreHelper.getNewUid(),
        eventsData: [],
        measurementsData: [],
        usersUids: [userId],
      };

      await this.firestoreHelper.add<Baby>(this.babiesCollection, baby);
      console.log('Baby created in DB:', baby);
      this._baby.set(baby);
    } catch (error) {
      console.error('Error creating baby in database:', error);
    }
  }

  public async deleteBaby(currentUserId: string): Promise<void> {
    const baby = this._baby();
    if (!baby) throw new Error('No baby selected.');

    try {
      if (baby.usersUids.length > 1) {
        await this.removeCurrentUserFromBaby(currentUserId, baby);
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

  private async removeCurrentUserFromBaby(
    currentUserId: string,
    baby: Baby
  ): Promise<void> {
    const updatedUsers = baby.usersUids.filter((uid) => uid !== currentUserId);
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
}
