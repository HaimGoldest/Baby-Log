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
  QuerySnapshot,
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  arrayUnion,
  UpdateData,
  Unsubscribe,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private firestore = inject(Firestore);

  /**
   * Add a new document to a collection with an auto-generated ID
   * @param collectionName Name of the Firestore collection
   * @param data The data to store in the new document
   */
  public async add<T>(collectionName: string, data: T): Promise<void> {
    const colRef = this.getCollectionRef<T>(collectionName);
    const newDocRef = doc(colRef);
    await setDoc(newDocRef, data);
  }

  /**
   * Create or overwrite a document with a custom ID
   * @param collectionName Name of the Firestore collection
   * @param uid ID of the document to set
   * @param data The data to write to the document
   */
  public async set<T>(
    collectionName: string,
    uid: string,
    data: T
  ): Promise<void> {
    const ref = this.getDocRef<T>(collectionName, uid);
    await setDoc(ref, data);
  }

  /**
   * Retrieve a document by ID from a collection
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID
   * @returns The document data or null if not found
   */
  public async get<T>(collectionName: string, uid: string): Promise<T | null> {
    const ref = this.getDocRef<T>(collectionName, uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  }

  /**
   * Update specific fields in an existing document
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID to update
   * @param data Partial data to update
   */
  public async update<T>(
    collectionName: string,
    uid: string,
    data: UpdateData<T>
  ): Promise<void> {
    const ref = this.getDocRef<T>(collectionName, uid);
    await updateDoc(ref, data);
  }

  /**
   * Delete a document by ID
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID to delete
   */
  public async delete(collectionName: string, uid: string): Promise<void> {
    const ref = this.getDocRef<any>(collectionName, uid);
    await deleteDoc(ref);
  }

  /**
   * Get all documents in a collection
   * @param collectionName Name of the Firestore collection
   * @returns An array of documents
   */
  async getAll<T>(collectionName: string): Promise<T[]> {
    const colRef = this.getCollectionRef<T>(collectionName);
    const snapshot: QuerySnapshot<T> = await getDocs(colRef);
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * Observe a document in real-time by collection and UID
   * @param collectionName Name of the collection
   * @param uid Document ID
   * @param next Callback with the document data (or null if it doesn't exist)
   * @param error Optional error callback
   * @returns Unsubscribe function
   */
  observe<T>(
    collectionName: string,
    uid: string,
    next: (data: T | null) => void,
    error?: (err: any) => void
  ): Unsubscribe {
    const ref = this.getDocRef<T>(collectionName, uid);
    return onSnapshot(
      ref,
      (snap) => {
        next(snap.exists() ? snap.data() : null);
      },
      error
    );
  }

  /**
   * Observe all documents in a collection in real-time
   * @param collectionName Name of the collection
   * @param next Callback with array of documents
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
      (snapshot) => {
        const items = snapshot.docs.map((doc) => doc.data());
        next(items);
      },
      error
    );
  }

  /**
   * Append a value to an array field in a document using arrayUnion
   * @param collectionName Name of the Firestore collection
   * @param uid Document ID
   * @param field Field name to append to
   * @param value Value to append
   */
  public async appendToArray<T>(
    collectionName: string,
    uid: string,
    field: keyof T,
    value: any
  ): Promise<void> {
    const ref = this.getDocRef<T>(collectionName, uid);
    await updateDoc(ref, { [field]: arrayUnion(value) } as any);
  }

  /**
   * Get a typed document reference with default inline converter
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
   * Get a typed collection reference with default inline converter
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
