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
  runTransaction,
  arrayUnion,
  DocumentReference,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Thin wrapper around the Firestore SDK.
 *
 * One-shot operations return a `Promise` so that `await` always waits for the
 * write to be acknowledged and always surfaces failures to the caller.
 * Only `watch()` returns an `Observable`, because it is a genuine stream.
 */
@Injectable({ providedIn: 'root' })
export class FireStoreHelperService {
  private firestore = inject(Firestore);
  private env = inject(EnvironmentInjector);

  /**
   * Generate a brand-new Firestore document ID without writing any data.
   * @returns A unique document ID string.
   */
  public generateUid(): string {
    const temp = doc(collection(this.firestore, '__uids__'));
    console.log('[FireStoreHelperService] generateUid:', temp.id);
    return temp.id;
  }

  /**
   * Add a new document under the given collection.
   * If `uid` is provided, uses that ID; otherwise auto-generates one.
   * @param collectionName Firestore collection path (e.g. "users").
   * @param data The object to write.
   * @param uid Optional custom document ID.
   * @returns A Promise that resolves once the write is acknowledged.
   */
  public add<T>(
    collectionName: string,
    data: T,
    uid: string | null = null
  ): Promise<void> {
    return runInInjectionContext(this.env, async () => {
      const colRef = this.getCollectionRef<T>(collectionName);
      const refDoc = uid ? doc(colRef, uid) : doc(colRef);
      console.log(
        `[FireStoreHelperService] add ${collectionName}/${refDoc.id}`,
        data
      );
      try {
        await setDoc(refDoc, data);
        console.log(
          `[FireStoreHelperService] added ${collectionName}/${refDoc.id}`
        );
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to add ${collectionName}/${refDoc.id}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Overwrite or create a document at `collectionName/uid` with the given data.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param data The object to write.
   * @returns A Promise that resolves once the write is acknowledged.
   */
  public set<T>(collectionName: string, uid: string, data: T): Promise<void> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(`[FireStoreHelperService] set ${collectionName}/${uid}`, data);
      try {
        await setDoc(refDoc, data);
        console.log(`[FireStoreHelperService] set ${collectionName}/${uid}`);
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to set ${collectionName}/${uid}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Fetch a single document once.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns A Promise resolving to the document data (timestamps to Date) or null if not found.
   */
  public get<T>(collectionName: string, uid: string): Promise<T | null> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(`[FireStoreHelperService] fetch ${collectionName}/${uid}`);
      try {
        const snap = await getDoc(refDoc);
        const value = snap.exists()
          ? (this.convertTimestamps(snap.data() as T) as T)
          : null;
        console.log(
          `[FireStoreHelperService] fetched ${collectionName}/${uid}`,
          value
        );
        return value;
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to get ${collectionName}/${uid}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Fetch all documents in a collection once.
   * @param collectionName Firestore collection path.
   * @returns A Promise resolving to an array of documents (timestamps to Date).
   */
  public getAll<T>(collectionName: string): Promise<T[]> {
    return runInInjectionContext(this.env, async () => {
      const colRef = this.getCollectionRef<T>(collectionName);
      console.log(`[FireStoreHelperService] fetchAll ${collectionName}`);
      try {
        const snapshot = await getDocs(colRef);
        const values = snapshot.docs.map(
          (d) => this.convertTimestamps(d.data() as T) as T
        );
        console.log(
          `[FireStoreHelperService] fetchedAll ${collectionName}`,
          values
        );
        return values;
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to getAll ${collectionName}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Subscribe to real-time updates for a single document.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns An Observable emitting updates (timestamps to Date) or null if deleted.
   */
  public watch<T>(collectionName: string, uid: string): Observable<T | null> {
    return new Observable<T | null>((subscriber) => {
      const unsubscribe = runInInjectionContext(this.env, () =>
        onSnapshot(
          this.getDocRef<T>(collectionName, uid),
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
        )
      );

      return () => {
        console.log(
          `[FireStoreHelperService] tearing down realtime listener for ${collectionName}/${uid}`
        );
        unsubscribe();
      };
    });
  }

  /**
   * Update specific fields on an existing document.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param data Partial object containing fields to update.
   * @returns A Promise that resolves once the update is acknowledged.
   */
  public update<T>(
    collectionName: string,
    uid: string,
    data: Partial<T>
  ): Promise<void> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getDocRef<T>(collectionName, uid);
      console.log(
        `[FireStoreHelperService] update ${collectionName}/${uid}`,
        data
      );
      try {
        await updateDoc(refDoc, data as any);
        console.log(`[FireStoreHelperService] updated ${collectionName}/${uid}`);
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to update ${collectionName}/${uid}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Atomically append items to an array field.
   *
   * Uses Firestore's `arrayUnion`, so the client never reads and rewrites the
   * whole array. Concurrent appends from other users, devices or tabs
   * therefore cannot overwrite each other, and the write is still queued
   * locally while offline.
   *
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param field Name of the array field on the document.
   * @param items Items to append.
   * @returns A Promise that resolves once the update is acknowledged.
   */
  public addToArray<T>(
    collectionName: string,
    uid: string,
    field: keyof T & string,
    ...items: unknown[]
  ): Promise<void> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getRawDocRef(collectionName, uid);
      console.log(
        `[FireStoreHelperService] arrayUnion ${collectionName}/${uid}.${field}`,
        items
      );
      try {
        await updateDoc(refDoc, { [field]: arrayUnion(...items) });
        console.log(
          `[FireStoreHelperService] appended to ${collectionName}/${uid}.${field}`
        );
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to append to ${collectionName}/${uid}.${field}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Atomically read-modify-write an array field inside a transaction.
   *
   * Required for updating or removing individual elements, which `arrayUnion`
   * and `arrayRemove` cannot express safely. The transaction re-reads the
   * server copy and retries automatically if the document changed underneath,
   * eliminating the lost-update race of a client-side read-modify-write.
   *
   * Note: transactions require connectivity. Unlike `addToArray`, they are not
   * queued while offline.
   *
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @param field Name of the array field on the document.
   * @param mutate Pure function receiving the current array and returning the next one.
   * @returns A Promise that resolves once the transaction commits.
   */
  public mutateArray<T, TItem>(
    collectionName: string,
    uid: string,
    field: keyof T & string,
    mutate: (current: TItem[]) => TItem[]
  ): Promise<void> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getRawDocRef(collectionName, uid);
      console.log(
        `[FireStoreHelperService] transaction on ${collectionName}/${uid}.${field}`
      );
      try {
        await runTransaction(this.firestore, async (transaction) => {
          const snap = await transaction.get(refDoc);
          if (!snap.exists()) {
            throw new Error(
              `[FireStoreHelperService] ${collectionName}/${uid} does not exist.`
            );
          }

          const current = this.convertTimestamps(
            snap.get(field) ?? []
          ) as TItem[];
          transaction.update(refDoc, { [field]: mutate(current) });
        });
        console.log(
          `[FireStoreHelperService] committed ${collectionName}/${uid}.${field}`
        );
      } catch (err) {
        console.error(
          `[FireStoreHelperService] transaction failed on ${collectionName}/${uid}.${field}`,
          err
        );
        throw err;
      }
    });
  }

  /**
   * Delete a document by its ID.
   * @param collectionName Firestore collection path.
   * @param uid Document ID.
   * @returns A Promise that resolves once the delete is acknowledged.
   */
  public delete(collectionName: string, uid: string): Promise<void> {
    this.assertUid(collectionName, uid);
    return runInInjectionContext(this.env, async () => {
      const refDoc = this.getDocRef<any>(collectionName, uid);
      console.log(`[FireStoreHelperService] delete ${collectionName}/${uid}`);
      try {
        await deleteDoc(refDoc);
        console.log(`[FireStoreHelperService] deleted ${collectionName}/${uid}`);
      } catch (err) {
        console.error(
          `[FireStoreHelperService] failed to delete ${collectionName}/${uid}`,
          err
        );
        throw err;
      }
    });
  }

  /** @internal Fail fast on a missing document ID instead of hitting a cryptic SDK error */
  private assertUid(collectionName: string, uid: string): void {
    if (!uid) {
      throw new Error(
        `[FireStoreHelperService] a document ID is required for "${collectionName}", got: ${uid}`
      );
    }
  }

  /** @internal Recursively convert Firestore Timestamps to JS Date */
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

  /** @internal Build an untyped DocumentReference for field-level operations */
  private getRawDocRef(
    collectionName: string,
    uid: string
  ): DocumentReference<DocumentData> {
    return doc(collection(this.firestore, collectionName), uid);
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
