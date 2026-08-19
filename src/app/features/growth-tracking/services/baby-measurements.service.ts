import { computed, inject, Injectable } from '@angular/core';
import { BabiesService } from '../../../core/services/babies.service';
import { Baby, BabyMeasurement } from '../../../models/baby.model';
import { FireStoreHelperService } from '../../../core/firebase/fire-store-helper.service';

@Injectable({
  providedIn: 'root',
})
export class BabyMeasurementsService {
  private firestoreHelper = inject(FireStoreHelperService);
  private babiesService = inject(BabiesService);
  private babiesCollection = this.babiesService.babiesCollection;
  private readonly measurementsField = 'measurementsData' as const;
  private readonly babyUid = computed(() => this.babiesService.baby()?.uid);

  public readonly measurements = computed(() => {
    const measurements = this.babiesService.baby()?.measurementsData ?? [];

    // Copy before sorting: sort() mutates in place, and the source array
    // belongs to the baby signal.
    return [...measurements].sort(
      // Sort measurements by date in descending order
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  });

  /**
   * Appends a measurement atomically via arrayUnion, so a concurrent write
   * from another user or tab cannot drop it.
   */
  public async addMeasurement(
    newMeasurement: BabyMeasurement
  ): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();
      const measurement: BabyMeasurement = {
        ...newMeasurement,
        uid: this.firestoreHelper.generateUid(),
      };

      await this.firestoreHelper.addToArray<Baby>(
        this.babiesCollection,
        babyUid,
        this.measurementsField,
        measurement
      );
      console.log('Measurement added successfully:', measurement);
    } catch (error) {
      console.error('Error adding measurement:', error);
      throw error;
    }
  }

  /**
   * Removes a measurement inside a transaction, so unrelated concurrent
   * changes to the measurements array are preserved.
   */
  public async deleteMeasurement(
    measurement: BabyMeasurement
  ): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();

      await this.firestoreHelper.mutateArray<Baby, BabyMeasurement>(
        this.babiesCollection,
        babyUid,
        this.measurementsField,
        (current) => current.filter((m) => m.uid !== measurement.uid)
      );
      console.log('Measurement deleted successfully:', measurement);
    } catch (error) {
      console.error('Error deleting measurement:', error);
      throw error;
    }
  }

  /**
   * Replaces a measurement in place inside a transaction, so unrelated
   * concurrent changes to the measurements array are preserved.
   */
  public async updateMeasurement(
    updatedMeasurement: BabyMeasurement
  ): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();

      await this.firestoreHelper.mutateArray<Baby, BabyMeasurement>(
        this.babiesCollection,
        babyUid,
        this.measurementsField,
        (current) => {
          const index = current.findIndex(
            (m) => m.uid === updatedMeasurement.uid
          );
          if (index === -1) {
            throw new Error(
              `Measurement ${updatedMeasurement.uid} no longer exists and cannot be updated.`
            );
          }

          const next = [...current];
          next[index] = updatedMeasurement;
          return next;
        }
      );
      console.log('Measurement updated successfully:', updatedMeasurement);
    } catch (error) {
      console.error('Error updating measurement:', error);
      throw error;
    }
  }

  /** Guards against writing to `babies/undefined` when no baby is selected. */
  private requireBabyUid(): string {
    const babyUid = this.babyUid();
    if (!babyUid) {
      throw new Error('No baby is selected, cannot modify baby measurements.');
    }
    return babyUid;
  }
}
