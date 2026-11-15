import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BabiesStore } from '../../core/stores/babies/babies.store';
import { SessionStore } from '../../core/stores/session/session.store';
import { AppRoute } from '../../enums/app-route.enum';
import { Gender } from '../../enums/gender.enum';
import { BabyMeasurement } from '../../models/baby.model';
import { AppService } from '../../core/services/app.service';
import BabyInfoStrings from './baby-info.strings';
import { NotificationService } from '../../core/services/notification.service';
import NotificationStrings from '../../shared/strings/notification.strings';
import { formatBabyAge } from './baby-age';

type MeasurementKey = 'weight' | 'height' | 'headMeasure';

/** One column of the profile card's latest-measurements strip. */
export interface MeasurementSummary {
  label: string;
  unit: string;
  value: number | null;
  date: Date | null;
}

@Component({
  standalone: true,
  imports: [DatePipe, MatIconModule, MatButtonModule, MatCardModule],
  selector: 'app-baby-info',
  templateUrl: './baby-info.page.html',
  styleUrls: ['./baby-info.page.scss'],
})
export class BabyInfoPage {
  private appService = inject(AppService);
  private babiesStore = inject(BabiesStore);
  private sessionStore = inject(SessionStore);
  private router = inject(Router);
  private clipboard = inject(Clipboard);
  private notificationService = inject(NotificationService);

  /** The last image URL that failed to load; the avatar then shows an icon. */
  private readonly brokenImageUrl = signal<string | null>(null);

  public strings = BabyInfoStrings;

  public baby = this.babiesStore.baby;

  public readonly imageUrl = computed(() => {
    const url = this.baby()?.imageUrl;
    return url && url !== this.brokenImageUrl() ? url : null;
  });

  public readonly age = computed(() => {
    const baby = this.baby();
    return baby ? formatBabyAge(baby.birthDate, baby.gender) : '';
  });

  public readonly genderLabel = computed(() =>
    this.baby()?.gender === Gender.Female
      ? this.strings.FEMALE
      : this.strings.MALE,
  );

  /**
   * The most recent value of each measurement, each with its own date, since a
   * record can hold only some of the three. Null when nothing was measured.
   */
  public readonly measurementSummary = computed<MeasurementSummary[] | null>(
    () => {
      const measurements = this.baby()?.measurementsData ?? [];
      if (measurements.length === 0) return null;

      return [
        {
          label: this.strings.WEIGHT,
          unit: this.strings.KG,
          ...latestOf(measurements, 'weight'),
        },
        {
          label: this.strings.HEIGHT,
          unit: this.strings.CM,
          ...latestOf(measurements, 'height'),
        },
        {
          label: this.strings.HEAD,
          unit: this.strings.CM,
          ...latestOf(measurements, 'headMeasure'),
        },
      ];
    },
  );

  public onImageError(url: string): void {
    this.brokenImageUrl.set(url);
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.appService.isLoading.set(true);
      const file = input.files[0];
      this.uploadNewImage(file);
    }
  }

  private uploadNewImage(file: File): void {
    if (this.baby()?.uid) {
      this.babiesStore
        .uploadImage(this.baby().uid, file)
        .then(() => {
          this.notificationService.success(this.strings.IMAGE_UPDATED);
        })
        .catch((error) => {
          this.notificationService.error(this.strings.IMAGE_UPDATE_FAILED);
          console.error('Error uploading baby image:', error);
        })
        .finally(() => {
          this.appService.isLoading.set(false);
        });
    }
  }

  public async deleteBaby(): Promise<void> {
    try {
      await this.sessionStore.removeBaby(this.baby());
      this.navigateAfterBabyDeletion();
    } catch {
      this.notificationService.error(NotificationStrings.DELETE_BABY_FAILED);
    }
  }

  public copyUIDToClipboard(): void {
    this.clipboard.copy(this.baby().uid);
    this.notificationService.success(this.strings.UID_COPIED);
  }

  private navigateAfterBabyDeletion(): void {
    this.router.navigate(['/', AppRoute.AddBaby]);
  }
}

function latestOf(
  measurements: BabyMeasurement[],
  key: MeasurementKey,
): Pick<MeasurementSummary, 'value' | 'date'> {
  let latest: BabyMeasurement | null = null;

  for (const measurement of measurements) {
    if (measurement[key] === null || measurement[key] === undefined) continue;
    if (!latest || measurement.date.getTime() > latest.date.getTime()) {
      latest = measurement;
    }
  }

  return { value: latest?.[key] ?? null, date: latest?.date ?? null };
}
