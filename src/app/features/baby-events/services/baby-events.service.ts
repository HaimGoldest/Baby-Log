import { computed, inject, Injectable } from '@angular/core';
import { BabiesService } from '../../../core/services/babies.service';
import { FirestoreHelperService } from '../../../core/services/firebase/firestore-helper.service';
import { Baby, BabyEvent } from '../../../models/baby.model';

@Injectable({
  providedIn: 'root',
})
export class BabyEventsService {
  private firestoreHelper = inject(FirestoreHelperService);
  private babiesService = inject(BabiesService);
  private babiesCollection = this.babiesService.babiesCollection;
  private readonly babyUid = computed(() => this.babiesService.baby()?.uid);

  public readonly events = computed(() =>
    this.babiesService.baby()?.eventsData.sort(
      // Sort events by date and time in descending order
      (a, b) => b.time.getTime() - a.time.getTime()
    )
  );

  public async addEvent(newEvent: BabyEvent) {
    try {
      const uid = this.firestoreHelper.generateUid();
      newEvent.uid = uid;
      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          eventsData: [...this.events(), newEvent],
        }
      );
      console.log('Event added successfully:', newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  public async deleteEvent(event: BabyEvent) {
    try {
      const updatedEvents = this.events().filter((m) => m.uid !== event.uid);
      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          eventsData: updatedEvents,
        }
      );
      console.log('Event deleted successfully:', event);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  public async updateEvent(updatedEvent: BabyEvent) {
    try {
      const otherEvents = this.events().filter(
        (m) => m.uid !== updatedEvent.uid
      );

      await this.firestoreHelper.update<Baby>(
        this.babiesCollection,
        this.babyUid(),
        {
          eventsData: [...otherEvents, updatedEvent],
        }
      );
      console.log('Event updated successfully:', updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }
}
