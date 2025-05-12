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
  private readonly babyUid = computed(() => this.babiesService.baby()?.uid);

  public readonly measurements = computed(() =>
    this.babiesService.baby()?.measurementsData.sort(
      // Sort measurements by date in descending order
      (a, b) => b.date.getTime() - a.date.getTime()
    )
  );

  public async addMeasurement(newMeasurement: BabyMeasurement) {
    try {
      newMeasurement.uid = this.firestoreHelper.generateUid();
      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          measurementsData: [...this.measurements(), newMeasurement],
        }
      );
      console.log('Measurement added successfully:', newMeasurement);
    } catch (error) {
      console.error('Error adding measurement:', error);
      throw error;
    }
  }

  public async deleteMeasurement(measurement: BabyMeasurement) {
    try {
      const updatedMeasurements = this.measurements().filter(
        (m) => m.uid !== measurement.uid
      );
      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          measurementsData: updatedMeasurements,
        }
      );
      console.log('Measurement deleted successfully:', measurement);
    } catch (error) {
      console.error('Error deleting measurement:', error);
      throw error;
    }
  }

  public async updateMeasurement(updatedMeasurement: BabyMeasurement) {
    try {
      const otherMeasurements = this.measurements().filter(
        (m) => m.uid !== updatedMeasurement.uid
      );

      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          measurementsData: [...otherMeasurements, updatedMeasurement],
        }
      );
      console.log('Measurement updated successfully:', updatedMeasurement);
    } catch (error) {
      console.error('Error updating measurement:', error);
      throw error;
    }
  }
}
