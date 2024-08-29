import { Injectable, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import firebase from 'firebase/compat/app';
import { BabyModel } from '../models/baby.model';
import { BabyActionCategoryModel } from '../models/baby-action-category.model';
import { BabyActionDataModel } from '../models/baby-action-data.model';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { BabyMeasurementModel } from '../models/baby-measurement.model';

@Injectable({
  providedIn: 'root',
})
export class BabiesService implements OnDestroy {
  public babyData = new BehaviorSubject<BabyModel | null>(null);
  private babiesCollection: AngularFirestoreCollection<unknown>;
  private babyChanged: Subscription | null = null;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.babiesCollection = this.firestore.collection('babies');
  }

  ngOnDestroy() {
    if (this.babyChanged) {
      this.babyChanged.unsubscribe();
    }
  }

  public setBaby(babyUid: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Unsubscribe from any previous subscriptions
      if (this.babyChanged) {
        this.babyChanged.unsubscribe();
      }

      this.babyChanged = this.getBabyFromDb(babyUid).subscribe(
        (baby) => {
          if (baby) {
            console.log('Received baby data:', baby);
            this.babyData.next(baby);
            resolve(true);
          } else {
            console.log('Baby not found in DB');
            this.babyData.next(null);
            resolve(false);
          }
        },
        (error) => {
          console.error('Error fetching baby data:', error);
          this.babyData.next(null);
          reject(false);
        }
      );
    });
  }

  public uploadBabyImage(babyUid: string, image: File): Promise<void> {
    const filePath = `baby_images/${babyUid}`;
    const fileRef = this.storage.ref(filePath);
    return this.storage
      .upload(filePath, image)
      .then(() => {
        console.log('Baby image uploaded successfully.');
      })
      .catch((error) => {
        console.error('Error uploading baby image:', error);
        throw new Error('Failed to upload baby image');
      });
  }

  private getBabyFromDb(babyUid: string): Observable<BabyModel | null> {
    const babyRef: AngularFirestoreDocument<BabyModel> =
      this.babiesCollection.doc(babyUid);

    return babyRef.snapshotChanges().pipe(
      map((doc) => {
        if (doc.payload.exists) {
          const data = doc.payload.data() as BabyModel;

          const actionsData = Array.isArray(data.actionsData)
            ? data.actionsData
            : [];
          const measurementsData = Array.isArray(data.measurementsData)
            ? data.measurementsData
            : [];

          return new BabyModel(
            data.uid,
            data.name,
            new Date(data.birthDate),
            actionsData.map(
              (action) =>
                new BabyActionDataModel(
                  new BabyActionCategoryModel(
                    action.category.name,
                    action.category.defaultDescription,
                    action.category.imagePath,
                    action.category.isCategoryEnable,
                    action.category.isDefaultDescriptionEnable
                  ),
                  action.description,
                  new Date(action.creationTime)
                )
            ),
            measurementsData.map(
              (measurement) =>
                new BabyMeasurementModel(
                  new Date(measurement.date),
                  measurement.height,
                  measurement.weight,
                  measurement.headMeasure
                )
            ),
            data.usersUids
          );
        } else {
          return null;
        }
      })
    );
  }

  addBabyToDb(
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

    const babyData = babyModel.toJsObject();

    const babyRef = this.babiesCollection.doc(babyUid);
    return babyRef
      .set(babyData)
      .then(() => {
        console.log('New baby document created successfully:', babyData);
        let isBabyWasSaved = this.setBaby(babyData.uid);

        if (!isBabyWasSaved) {
          console.error('Failed to use this baby!');
        }

        return isBabyWasSaved;
      })
      .catch((error) => {
        console.error('Error - failed to add new baby document to DB: ', error);
        return false;
      });
  }

  deleteBabyFromDb(baby: BabyModel): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const babyRef: AngularFirestoreDocument<any> = this.babiesCollection.doc(
        baby.uid
      );

      babyRef
        .delete()
        .then(() => {
          console.log(
            `Baby document with UID ${baby.uid} deleted successfully.`
          );
          this.babyData.next(null); // Reset babyData after deletion
          resolve(true);
        })
        .catch((error) => {
          console.error(
            `Error deleting baby document with UID ${baby.uid}: `,
            error
          );
          resolve(false);
        });
    });
  }

  public addBabyActionDataToDb(babyActionData: BabyActionDataModel): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error adding baby action, current baby is null!';
      throw new Error(errorMsg);
    }

    let actionData = babyActionData.toJsObject();

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .update({
        actionsData: firebase.firestore.FieldValue.arrayUnion(actionData),
      })
      .then(() => {
        console.log('Baby action added successfully.');
      })
      .catch((error) => {
        console.error('Error adding baby action:', error);
      });
  }

  public addMeasurementDataToDb(measurementData: BabyMeasurementModel): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error adding baby measurement, current baby is null!';
      throw new Error(errorMsg);
    }

    let data = measurementData.toJsObject();

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .update({
        measurementsData: firebase.firestore.FieldValue.arrayUnion(data),
      })
      .then(() => {
        console.log('Baby measurement added successfully.');
      })
      .catch((error) => {
        console.error('Error adding baby measurement:', error);
      });
  }

  public updateMeasurementDataInDb(
    oldMeasurementData: BabyMeasurementModel,
    updatedMeasurementData: BabyMeasurementModel
  ): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error updating baby measurement, current baby is null!';
      throw new Error(errorMsg);
    }

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          const babyData = doc.data() as BabyModel;

          // Find the index of the measurement to be updated
          const measurementIndex = babyData.measurementsData.findIndex(
            (measurement) =>
              new Date(measurement.date).getTime() ===
                oldMeasurementData.date.getTime() &&
              measurement.height === oldMeasurementData.height &&
              measurement.weight === oldMeasurementData.weight &&
              measurement.headMeasure === oldMeasurementData.headMeasure
          );

          if (measurementIndex !== -1) {
            // Remove the old measurement data
            babyRef.update({
              measurementsData: firebase.firestore.FieldValue.arrayRemove(
                oldMeasurementData.toJsObject()
              ),
            });

            // Add the updated measurement data
            babyRef.update({
              measurementsData: firebase.firestore.FieldValue.arrayUnion(
                updatedMeasurementData.toJsObject()
              ),
            });

            console.log('Baby measurement updated successfully.');
          } else {
            console.error(
              'Error updating baby measurement: Measurement not found.'
            );
          }
        } else {
          console.error(
            'Error updating baby measurement: Baby document not found.'
          );
        }
      })
      .catch((error) => {
        console.error('Error updating baby measurement:', error);
      });
  }

  public deleteBabyActionDataFromDb(babyActionData: BabyActionDataModel): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error deleting baby action, current baby is null!';
      throw new Error(errorMsg);
    }

    const actionData = babyActionData.toJsObject();

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .update({
        actionsData: firebase.firestore.FieldValue.arrayRemove(actionData),
      })
      .then(() => {
        console.log('Baby action deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting baby action:', error);
      });
  }

  public deleteMeasurementDataFromDb(
    measurementData: BabyMeasurementModel
  ): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error deleting baby measuremen, current baby is null!';
      throw new Error(errorMsg);
    }

    const data = measurementData.toJsObject();

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .update({
        measurementsData: firebase.firestore.FieldValue.arrayRemove(data),
      })
      .then(() => {
        console.log('Baby measuremen deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting baby measuremen:', error);
      });
  }

  public updateBabyActionDataInDb(
    updatedActionData: BabyActionDataModel
  ): void {
    const babyUid = this.babyData?.value?.uid;
    if (!babyUid) {
      const errorMsg = 'Error updating baby action, current baby is null!';
      throw new Error(errorMsg);
    }

    const babyRef: AngularFirestoreDocument<any> =
      this.babiesCollection.doc(babyUid);

    babyRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          const babyData = doc.data() as BabyModel;

          // Find the index of the action to be updated
          const actionIndex = babyData.actionsData.findIndex(
            (action) =>
              new Date(action.creationTime).getTime() ===
              updatedActionData.creationTime.getTime()
          );

          if (actionIndex !== -1) {
            // Remove the old action data
            const oldActionData = babyData.actionsData[actionIndex];
            babyRef.update({
              actionsData:
                firebase.firestore.FieldValue.arrayRemove(oldActionData),
            });

            // Add the updated action data
            babyRef.update({
              actionsData: firebase.firestore.FieldValue.arrayUnion(
                updatedActionData.toJsObject()
              ),
            });

            console.log('Baby action updated successfully.');
          } else {
            console.error('Error updating baby action: Action not found.');
          }
        } else {
          console.error('Error updating baby action: Baby document not found.');
        }
      })
      .catch((error) => {
        console.error('Error updating baby action:', error);
      });
  }
}
