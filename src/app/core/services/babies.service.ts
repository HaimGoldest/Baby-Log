import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Baby } from '../../models/baby.model';
import { FireStoreHelperService } from '../firebase/fire-store-helper.service';
import { FireStorageHelperService } from '../firebase/fire-storage-helper.service';

/**
 * CRUD gateway for the `babies` collection and its images. Holds no state and
 * makes no lifecycle decisions: BabiesStore owns both.
 */
@Injectable({ providedIn: 'root' })
export class BabiesService {
  private imagesRootPath = 'baby_images';
  private firestoreHelper = inject(FireStoreHelperService);
  private fireStorageHelper = inject(FireStorageHelperService);

  public readonly babiesCollection = 'babies';

  public get(babyUid: string): Promise<Baby | null> {
    return this.firestoreHelper.get<Baby>(this.babiesCollection, babyUid);
  }

  public create(baby: Baby): Promise<void> {
    return this.firestoreHelper.add<Baby>(
      this.babiesCollection,
      baby,
      baby.uid,
    );
  }

  public update(babyUid: string, changes: Partial<Baby>): Promise<void> {
    return this.firestoreHelper.update<Baby>(
      this.babiesCollection,
      babyUid,
      changes,
    );
  }

  public delete(babyUid: string): Promise<void> {
    return this.firestoreHelper.delete(this.babiesCollection, babyUid);
  }

  public watch(babyUid: string): Observable<Baby | null> {
    return this.firestoreHelper.watch<Baby>(this.babiesCollection, babyUid);
  }

  public uploadImage(babyUid: string, image: File): Promise<string> {
    return this.fireStorageHelper.uploadFile(this.imagePath(babyUid), image);
  }

  public getImageUrl(babyUid: string): Promise<string | null> {
    return this.fireStorageHelper.getFileUrl(this.imagePath(babyUid));
  }

  public deleteImage(babyUid: string): Promise<void> {
    return this.fireStorageHelper.deleteFile(this.imagePath(babyUid));
  }

  private imagePath(babyUid: string): string {
    return `${this.imagesRootPath}/${babyUid}`;
  }
}
