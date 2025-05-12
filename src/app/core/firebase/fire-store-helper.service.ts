import {
  Injectable,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  DocumentReference,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FireStoreHelperService {
  private firestore = inject(Firestore);
  private env = inject(EnvironmentInjector);

  /**
   * Generate a brand‐new Firestore document ID without writing any data.
   * @returns A unique document ID string.
   */
  public generateUid(): string {
    const temp = doc(collection(this.firestore, '__uids__'));
    console.log('[FireStoreHelperService] generateUid:', temp.id);
    return temp.id;
  }

  /**
   * Add a new document under the given collection.
   * If `uid` is provided, uses that ID; otherwise auto‐generates one.
   * @param collectionName Firestore collection path (e.g. "users").
   * @param data The object to write.
   * @param uid Optional custom document ID.
   * @returns An Observable that completes when the write is done.
   */
  public add<T>(
    collectionName: string,
    data: T,
    uid: string | null = null
  ): Observable<void> {
    return runInInjectionContext(this.env, () => {
      const colRef = this.getCollectionRef<T>(collectionName);
      const refDoc = uid ? doc(colRef, uid) : doc(colRef);
      console.log(
        `[FireStoreHelperService] add ${collectionName}/${refDoc.id}`,
        data
      );
      return from(setDoc(refDoc, data)).pipe(
        tap(() =>
          console.log(
            `[FireStoreHelperService] added ${collectionName}/${refDoc.id}`
          )
        ),
        catchError((err) => {
          console.error(
            `[FireStoreHelperService] failed to add ${collectionName}/${refDoc.id}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /**
   * Overwrite or create a document at `collectionName/uid` with the given data.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param data The object to write.
   * @returns An Observable that completes when the write is done.
   */
  public set<T>(
    collectionName: string,
    uid: string,
    data: T
  ): Observable<void> {
    return runInInjectionContext(this.env, () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(
        `[FireStoreHelperService] set ${collectionName}/${uid}`,
        data
      );
      return from(setDoc(refDoc, data)).pipe(
        tap(() =>
          console.log(`[FireStoreHelperService] set ${collectionName}/${uid}`)
        ),
        catchError((err) => {
          console.error(
            `[FireStoreHelperService] failed to set ${collectionName}/${uid}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /**
   * Fetch a single document once.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns An Observable emitting the document data (with timestamps→Date) or null if not found.
   */
  public get<T>(collectionName: string, uid: string): Observable<T | null> {
    return runInInjectionContext(this.env, () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(`[FireStoreHelperService] fetch ${collectionName}/${uid}`);
      return from(getDoc(refDoc)).pipe(
        map((snap) =>
          snap.exists() ? (this.convertTimestamps(snap.data() as T) as T) : null
        ),
        tap((v) =>
          console.log(
            `[FireStoreHelperService] fetched ${collectionName}/${uid}`,
            v
          )
        ),
        catchError((err) => {
          console.error(
            `[FireStoreHelperService] failed to get ${collectionName}/${uid}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /**
   * Fetch all documents in a collection once.
   * @param collectionName Firestore collection path.
   * @returns An Observable emitting an array of documents (timestamps→Date).
   */
  public getAll<T>(collectionName: string): Observable<T[]> {
    return runInInjectionContext(this.env, () => {
      const colRef = this.getCollectionRef<T>(collectionName);
      console.log(`[FireStoreHelperService] fetchAll ${collectionName}`);
      return from(getDocs(colRef)).pipe(
        map((snapshot) =>
          snapshot.docs.map((d) => this.convertTimestamps(d.data() as T) as T)
        ),
        tap((arr) =>
          console.log(
            `[FireStoreHelperService] fetchedAll ${collectionName}`,
            arr
          )
        ),
        catchError((err) => {
          console.error(
            `[FirestoreHelperService] failed to getAll ${collectionName}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /**
   * Subscribe to real‐time updates for a single document.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns An Observable emitting updates (timestamps→Date) or null if deleted.
   */
  public watch<T>(collectionName: string, uid: string): Observable<T | null> {
    return new Observable<T | null>((subscriber) => {
      runInInjectionContext(this.env, () => {
        const refDoc = this.getDocRef<T>(collectionName, uid);
        console.log(`[FireStoreHelperService] watch ${collectionName}/${uid}`);
        const unsubscribe = onSnapshot(
          refDoc,
          (snap) => {
            if (snap.exists()) {
              const data = this.convertTimestamps(snap.data() as T) as T;
              console.log(
                `[FireStoreHelperService] realtime ${collectionName}/${uid}`,
                data
              );
              subscriber.next(data);
            } else {
              subscriber.next(null);
            }
          },
          (err) => {
            console.error(
              `[FireStoreHelperService] realtime watch failed ${collectionName}/${uid}`,
              err
            );
            subscriber.error(err);
          }
        );
        return unsubscribe;
      });
    });
  }

  /**
   * Subscribe to real‐time updates for an entire collection.
   * @param collectionName Firestore collection path.
   * @returns An Observable emitting arrays of documents (timestamps→Date).
   */
  public watchAll<T>(collectionName: string): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      runInInjectionContext(this.env, () => {
        const colRef = this.getCollectionRef<T>(collectionName);
        console.log(`[FireStoreHelperService] watchAll ${collectionName}`);
        const unsubscribe = onSnapshot(
          colRef,
          (snap) => {
            const arr = snap.docs.map(
              (d) => this.convertTimestamps(d.data() as T) as T
            );
            console.log(
              `[FireStoreHelperService] realtime all ${collectionName}`,
              arr
            );
            subscriber.next(arr);
          },
          (err) => {
            console.error(
              `[FireStoreHelperService] realtime watchAll failed ${collectionName}`,
              err
            );
            subscriber.error(err);
          }
        );
        return unsubscribe;
      });
    });
  }

  /**
   * Update specific fields on an existing document.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param data Partial object containing fields to update.
   * @returns An Observable that completes when the update is done.
   */
  public update<T>(
    collectionName: string,
    uid: string,
    data: Partial<T>
  ): Observable<void> {
    return runInInjectionContext(this.env, () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(
        `[FireStoreHelperService] update ${collectionName}/${uid}`,
        data
      );
      return from(updateDoc(refDoc, data as any)).pipe(
        tap(() =>
          console.log(
            `[FireStoreHelperService] updated ${collectionName}/${uid}`
          )
        ),
        catchError((err) => {
          console.error(
            `[FireStoreHelperService] failed to update ${collectionName}/${uid}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /**
   * Delete a document by its ID.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns An Observable that completes when the delete is done.
   */
  public delete(collectionName: string, uid: string): Observable<void> {
    return runInInjectionContext(this.env, () => {
      const refDoc = this.getDocRef<any>(collectionName, uid);
      console.log(`[FireStoreHelperService] delete ${collectionName}/${uid}`);
      return from(deleteDoc(refDoc)).pipe(
        tap(() =>
          console.log(
            `[FireStoreHelperService] deleted ${collectionName}/${uid}`
          )
        ),
        catchError((err) => {
          console.error(
            `[FireStoreHelperService] failed to delete ${collectionName}/${uid}`,
            err
          );
          throw err;
        })
      );
    });
  }

  /** @internal Recursively convert Firestore Timestamps → JS Date */
  private convertTimestamps(obj: any): any {
    if (obj && typeof obj.toDate === 'function') return obj.toDate();
    if (Array.isArray(obj)) return obj.map((v) => this.convertTimestamps(v));
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, this.convertTimestamps(v)])
      );
    }
    return obj;
  }

  /** @internal Build a typed DocumentReference with inline converter */
  private getDocRef<T>(
    collectionName: string,
    uid: string
  ): DocumentReference<T, T> {
    const conv: FirestoreDataConverter<T> = {
      toFirestore: (d: T) => d as DocumentData,
      fromFirestore: (s: QueryDocumentSnapshot<DocumentData>) => s.data() as T,
    };
    return doc(
      collection(this.firestore, collectionName).withConverter(conv),
      uid
    ) as DocumentReference<T, T>;
  }

  /** @internal Build a typed CollectionReference with inline converter */
  private getCollectionRef<T>(
    collectionName: string
  ): CollectionReference<T, T> {
    const conv: FirestoreDataConverter<T> = {
      toFirestore: (d: T) => d as DocumentData,
      fromFirestore: (s: QueryDocumentSnapshot<DocumentData>) => s.data() as T,
    };
    return collection(this.firestore, collectionName).withConverter(
      conv
    ) as CollectionReference<T, T>;
  }
}
