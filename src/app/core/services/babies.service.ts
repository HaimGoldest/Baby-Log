import { Injectable, OnDestroy, signal, inject } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
} from '@angular/fire/firestore';
import {
  Storage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { BabyActionCategoryModel } from '../../models/baby-action-category.model';
import { BabyActionDataModel } from '../../models/baby-action-data.model';
import { BabyMeasurementModel } from '../../models/baby-measurement.model';
import { BabyModel } from '../../models/baby.model';

@Injectable({ providedIn: 'root' })
export class BabiesService implements OnDestroy {
  public babyData = signal<BabyModel | null>(null);
  public currentBabyimageUrl = signal<string | null>(null);

  private unsubscribeSnapshots: (() => void) | null = null;
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  ngOnDestroy() {
    this.unsubscribeSnapshots?.();
  }

  public async setBaby(babyUid: string): Promise<boolean> {
    this.unsubscribeSnapshots?.();
    const babyRef = doc(this.firestore, 'babies', babyUid);

    return new Promise((resolve, reject) => {
      this.unsubscribeSnapshots = onSnapshot(
        babyRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as any;
            const baby = this.mapToBabyModel(babyUid, data);
            console.log('Received baby data:', baby);
            this.babyData.set(baby);

            this.getBabyImageUrl(babyUid)
              .then((url) => this.currentBabyimageUrl.set(url))
              .catch(() => this.currentBabyimageUrl.set(null));
            resolve(true);
          } else {
            this.babyData.set(null);
            resolve(false);
          }
        },
        (error) => {
          console.error('Error fetching baby:', error);
          this.babyData.set(null);
          reject(false);
        }
      );
    });
  }

  public async uploadBabyImage(babyUid: string, image: File): Promise<void> {
    const filePath = `baby_images/${babyUid}`;
    const ref = storageRef(this.storage, filePath);

    try {
      await uploadBytes(ref, image);
      const url = await getDownloadURL(ref);
      this.currentBabyimageUrl.set(url);
      console.log(`Image uploaded successfully for baby ${babyUid}`);
    } catch (error: any) {
      console.error(`Failed to upload image for baby ${babyUid}`, error);
    }
  }

  public async getBabyImageUrl(babyUid: string): Promise<string | null> {
    const filePath = `baby_images/${babyUid}`;
    const ref = storageRef(this.storage, filePath);
    try {
      return await getDownloadURL(ref);
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('Baby image not found in storage:', filePath);
        return null;
      } else {
        console.error('Error retrieving baby image URL:', error);
        return null;
      }
    }
  }

  public async addBabyToDb(
    babyUid: string,
    name: string,
    birthDate: string,
    firstUserUid: string
  ): Promise<boolean> {
    const babyModel = new BabyModel(
      babyUid,
      name,
      new Date(birthDate),
      [],
      [],
      [firstUserUid]
    );

    try {
      const babyData = babyModel.toJsObject();
      const babyRef = doc(this.firestore, 'babies', babyUid);
      await setDoc(babyRef, babyData);

      const success = await this.setBaby(babyUid);
      if (!success) {
        console.error(
          'Error - setBaby failed after creating baby in the database:',
          babyData
        );
        return false;
      }

      console.log('New baby created successfully in the database:', babyData);
      return true;
    } catch (error) {
      console.error('Error - failed to add new baby to database: ', error);
      return false;
    }
  }

  public async deleteBabyFromDb(baby: BabyModel): Promise<boolean> {
    const babyRef = doc(this.firestore, 'babies', baby.uid);
    try {
      await deleteDoc(babyRef);
      this.babyData.set(null);
      this.currentBabyimageUrl.set(null);
      console.log(
        `Baby with UID ${baby.uid} deleted successfully from the database.`
      );
      return true;
    } catch (err) {
      console.error('Error deleting baby from the database:', err);
      return false;
    }
  }

  public async addBabyActionDataToDb(
    actionData: BabyActionDataModel
  ): Promise<void> {
    const babyUid = this.babyData()?.uid;
    if (!babyUid) throw new Error('No baby selected.');

    const ref = doc(this.firestore, 'babies', babyUid);
    await updateDoc(ref, {
      actionsData: arrayUnion(actionData.toJsObject()),
    });
  }

  public async addMeasurementDataToDb(
    data: BabyMeasurementModel
  ): Promise<void> {
    const babyUid = this.babyData()?.uid;
    if (!babyUid) throw new Error('No baby selected.');

    const ref = doc(this.firestore, 'babies', babyUid);
    await updateDoc(ref, {
      measurementsData: arrayUnion(data.toJsObject()),
    });
  }

  private mapToBabyModel(uid: string, data: any): BabyModel {
    const actions = Array.isArray(data.actionsData) ? data.actionsData : [];
    const measurements = Array.isArray(data.measurementsData)
      ? data.measurementsData
      : [];
    return new BabyModel(
      uid,
      data.name,
      new Date(data.birthDate),
      actions.map(
        (a: any) =>
          new BabyActionDataModel(
            new BabyActionCategoryModel(
              a.category.name,
              a.category.defaultDescription,
              a.category.imagePath,
              a.category.isCategoryEnable,
              a.category.isDefaultDescriptionEnable
            ),
            a.description,
            new Date(a.creationTime)
          )
      ),
      measurements.map(
        (m: any) =>
          new BabyMeasurementModel(
            new Date(m.date),
            m.height,
            m.weight,
            m.headMeasure
          )
      ),
      data.usersUids || []
    );
  }
}
