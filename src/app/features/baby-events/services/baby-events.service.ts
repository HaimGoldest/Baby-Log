import { computed, inject, Injectable } from '@angular/core';
import { BabiesService } from '../../../core/services/babies.service';
import { BabiesStore } from '../../../core/stores/babies/babies.store';
import { Baby, BabyEvent } from '../../../models/baby.model';
import { FireStoreHelperService } from '../../../core/firebase/fire-store-helper.service';
import {
  PendingKind,
  PendingWrites,
} from '../../../core/firebase/pending-writes';

@Injectable({
  providedIn: 'root',
})
export class BabyEventsService {
  private firestoreHelper = inject(FireStoreHelperService);
  private babiesStore = inject(BabiesStore);
  private babiesCollection = inject(BabiesService).babiesCollection;
  private readonly eventsField = 'eventsData' as const;
  private readonly babyUid = computed(() => this.babiesStore.baby()?.uid);

  public readonly events = computed(() => {
    const events = this.babiesStore.baby()?.eventsData ?? [];

    // Copy before sorting: sort() mutates in place, and the source array
    // belongs to the baby signal.
    return [...events].sort(
      // Sort events by date and time in descending order
      (a, b) => b.time.getTime() - a.time.getTime()
    );
  });

  // Declared after `events`, which it observes.
  private readonly pending = new PendingWrites(this.events);

  /** The in-flight write for an event, or null when there is none. */
  public pendingKind(uid: string): PendingKind | null {
    return this.pending.kindOf(uid);
  }

  /**
   * Appends an event atomically via arrayUnion, so a concurrent write from
   * another user or tab cannot drop it.
   *
   * The local cache shows the event at once, and it stays `syncing` until the
   * server acknowledges it, which lasts until reconnect while offline.
   */
  public async addEvent(newEvent: BabyEvent): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();
      const event: BabyEvent = {
        ...newEvent,
        uid: this.firestoreHelper.generateUid(),
      };

      await this.pending.track(event.uid, 'syncing', () =>
        this.firestoreHelper.addToArray<Baby>(
          this.babiesCollection,
          babyUid,
          this.eventsField,
          event
        )
      );
      console.log('Event added successfully:', event);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  /**
   * Removes an event inside a transaction, so unrelated concurrent changes to
   * the events array are preserved.
   *
   * The event stays `saving` until it is gone from the list.
   */
  public async deleteEvent(event: BabyEvent): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();

      await this.pending.track(
        event.uid,
        'saving',
        () =>
          this.firestoreHelper.mutateArray<Baby, BabyEvent>(
            this.babiesCollection,
            babyUid,
            this.eventsField,
            (current) => current.filter((e) => e.uid !== event.uid)
          ),
        (events) => !events.some((e) => e.uid === event.uid)
      );
      console.log('Event deleted successfully:', event);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Replaces an event in place inside a transaction, so unrelated concurrent
   * changes to the events array are preserved.
   *
   * The event stays `saving` until the list shows the edit.
   */
  public async updateEvent(updatedEvent: BabyEvent): Promise<void> {
    try {
      const babyUid = this.requireBabyUid();

      await this.pending.track(
        updatedEvent.uid,
        'saving',
        () =>
          this.firestoreHelper.mutateArray<Baby, BabyEvent>(
            this.babiesCollection,
            babyUid,
            this.eventsField,
            (current) => {
              const index = current.findIndex(
                (e) => e.uid === updatedEvent.uid
              );
              if (index === -1) {
                throw new Error(
                  `Event ${updatedEvent.uid} no longer exists and cannot be updated.`
                );
              }

              const next = [...current];
              next[index] = updatedEvent;
              return next;
            }
          ),
        (events) => events.some((e) => this.matchesEdit(e, updatedEvent))
      );
      console.log('Event updated successfully:', updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  /** Guards against writing to `babies/undefined` when no baby is selected. */
  private requireBabyUid(): string {
    const babyUid = this.babyUid();
    if (!babyUid) {
      throw new Error('No baby is selected, cannot modify baby events.');
    }
    return babyUid;
  }

  /** Whether `event` already carries every field an edit can change. */
  private matchesEdit(event: BabyEvent, edited: BabyEvent): boolean {
    return (
      event.uid === edited.uid &&
      event.time.getTime() === edited.time.getTime() &&
      event.comment === edited.comment &&
      event.lastEditedBy === edited.lastEditedBy
    );
  }
}
