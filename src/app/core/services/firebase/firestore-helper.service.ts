import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  CollectionReference,
  DocumentReference,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  arrayUnion,
  UpdateData,
  Unsubscribe,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreHelperService {
  private firestore = inject(Firestore);

  /**
   * Generates a new unique Firestore document ID without creating an actual document.
   * @returns A new unique ID string.
   */
  public getNewUid(): string {
    // Create a temporary document reference in a dummy collection to leverage Firestore's ID generator
    const tempRef = doc(collection(this.firestore, '__uids__'));
    return tempRef.id;
  }

  /**
   * Add a new document to a collection with an auto-generated ID.
   * @param collectionName Name of the Firestore collection
   * @param data The data to store in the new document
   * @returns Promise that resolves when the document is added
   */
  public add<T>(collectionName: string, data: T): Promise<void> {
    return this.execute(`add to ${collectionName}`, async () => {
      const colRef = this.getCollectionRef<T>(collectionName);
      const newDocRef = doc(colRef);
      await setDoc(newDocRef, data);
    });
  }

  /**
   * Create or overwrite a document with a custom ID.
   * @param collectionName Name of the Firestore collection
   * @param uid ID of the document to set
   * @param data The data to write to the document
   * @returns Promise that resolves when the document is set
   */
  public set<T>(collectionName: string, uid: string, data: T): Promise<void> {
    return this.execute(`set ${collectionName}/${uid}`, () =>
      setDoc(this.getDocRef<T>(collectionName, uid), data)
    );
  }

  /**
   * Retrieve a document by ID from a collection.
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID
   * @returns Promise resolving to the document data or null if not found
   */
  public get<T>(collectionName: string, uid: string): Promise<T | null> {
    return this.execute(`get ${collectionName}/${uid}`, async () => {
      const snap = await getDoc(this.getDocRef<T>(collectionName, uid));
      return snap.exists() ? snap.data() : null;
    });
  }

  /**
   * Update specific fields in an existing document.
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID to update
   * @param data Partial data to update
   * @returns Promise that resolves when the document is updated
   */
  public update<T>(
    collectionName: string,
    uid: string,
    data: UpdateData<T>
  ): Promise<void> {
    return this.execute(`update ${collectionName}/${uid}`, () =>
      updateDoc(this.getDocRef<T>(collectionName, uid), data)
    );
  }

  /**
   * Delete a document by ID.
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID to delete
   * @returns Promise that resolves when the document is deleted
   */
  public delete(collectionName: string, uid: string): Promise<void> {
    return this.execute(`delete ${collectionName}/${uid}`, () =>
      deleteDoc(this.getDocRef<any>(collectionName, uid))
    );
  }

  /**
   * Get all documents in a collection.
   * @param collectionName Name of the Firestore collection
   * @returns Promise resolving to an array of document data
   */
  public getAll<T>(collectionName: string): Promise<T[]> {
    return this.execute(`getAll from ${collectionName}`, async () => {
      const snapshot = await getDocs(this.getCollectionRef<T>(collectionName));
      return snapshot.docs.map((d) => d.data());
    });
  }

  /**
   * Observe a document in real-time by collection and UID.
   * @param collectionName Name of the collection
   * @param uid Document ID
   * @param next Callback with the document data or null
   * @param error Optional error callback
   * @returns Unsubscribe function
   */
  public observe<T>(
    collectionName: string,
    uid: string,
    next: (data: T | null) => void,
    error?: (err: any) => void
  ): Unsubscribe {
    const ref = this.getDocRef<T>(collectionName, uid);
    return onSnapshot(
      ref,
      (snap) => next(snap.exists() ? snap.data() : null),
      (err) => {
        console.error(
          `[FirestoreHelperService] observe ${collectionName}/${uid} failed`,
          err
        );
        if (error) error(err);
      }
    );
  }

  /**
   * Observe all documents in a collection in real-time.
   * @param collectionName Name of the collection
   * @param next Callback with an array of document data
   * @param error Optional error callback
   * @returns Unsubscribe function
   */
  public observeAll<T>(
    collectionName: string,
    next: (data: T[]) => void,
    error?: (err: any) => void
  ): Unsubscribe {
    const colRef = this.getCollectionRef<T>(collectionName);
    return onSnapshot(
      colRef,
      (snap) => next(snap.docs.map((d) => d.data())),
      (err) => {
        console.error(
          `[FirestoreHelperService] observeAll ${collectionName} failed`,
          err
        );
        if (error) error(err);
      }
    );
  }

  /**
   * Append a value to an array field in a document using arrayUnion.
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID
   * @param field Field name to append to
   * @param value Value to append
   * @returns Promise that resolves when the operation completes
   */
  public appendToArray<T>(
    collectionName: string,
    uid: string,
    field: keyof T,
    value: any
  ): Promise<void> {
    return this.execute(
      `appendToArray on ${collectionName}/${uid}.${String(field)}`,
      () =>
        updateDoc(this.getDocRef<T>(collectionName, uid), {
          [field]: arrayUnion(value),
        } as any)
    );
  }

  /**
   * Executes a Firestore operation with standardized error handling.
   * @template T
   * @param operation Description of the operation for logging
   * @param fn Async function performing the Firestore operation
   * @returns The result of the operation
   * @throws Error with contextual message if the operation fails
   */
  private async execute<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (err: any) {
      console.error(`[FirestoreHelperService] ${operation} failed`, err);
      throw new Error(`${operation} failed: ${err?.message || err}`);
    }
  }

  /**
   * Get a typed document reference with default inline converter.
   * @param collectionName Name of the collection
   * @param uid Document ID
   * @returns DocumentReference with converter for type T
   */
  private getDocRef<T>(
    collectionName: string,
    uid: string
  ): DocumentReference<T, T> {
    const converter: FirestoreDataConverter<T> = {
      toFirestore: (data: T): DocumentData => data,
      fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): T =>
        snap.data() as T,
    };

    return doc(
      collection(this.firestore, collectionName).withConverter<T>(converter),
      uid
    ) as DocumentReference<T, T>;
  }

  /**
   * Get a typed collection reference with default inline converter.
   * @param collectionName Name of the collection
   * @returns CollectionReference with converter for type T
   */
  private getCollectionRef<T>(
    collectionName: string
  ): CollectionReference<T, T> {
    const converter: FirestoreDataConverter<T> = {
      toFirestore: (data: T): DocumentData => data,
      fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): T =>
        snap.data() as T,
    };

    return collection(this.firestore, collectionName).withConverter<T>(
      converter
    ) as CollectionReference<T, T>;
  }
}
