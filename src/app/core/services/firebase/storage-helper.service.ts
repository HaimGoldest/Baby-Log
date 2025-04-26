import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

/**
 * Helper service for Firebase Storage operations:
 * upload files, retrieve download URLs, and delete files.
 */
@Injectable({ providedIn: 'root' })
export class FireStorageHelperService {
  /**
   * Uploads a file to Firebase Storage at the specified path.
   * @param path - The relative storage path (e.g., 'users/avatars/uid.jpg').
   * @param file - The File object to upload.
   * @returns A Promise that resolves with the download URL of the uploaded file.
   * @throws If an error occurs during upload.
   */
  public async uploadFile(path: string, file: File): Promise<string> {
    try {
      const fileRef = ref(getStorage(), path);
      await uploadBytes(fileRef, file);
      console.log('File uploaded successfully:', path);
      return await getDownloadURL(fileRef);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Retrieves the download URL for a file stored at the specified path.
   * @param path - The relative storage path of the file.
   * @returns A Promise that resolves with the file's download URL, or null if the file does not exist.
   */
  public async getFileUrl(path: string): Promise<string | null> {
    try {
      const fileRef = ref(getStorage(), path);
      return await getDownloadURL(fileRef);
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('File not found in storage:', path);
        return null;
      } else {
        console.error('Error retrieving file URL:', error);
        return null;
      }
    }
  }

  /**
   * Deletes the file at the specified path in Firebase Storage.
   * @param path - The relative storage path of the file to delete.
   * @returns A Promise that resolves when the deletion is complete.
   * @throws If an error occurs during deletion.
   */
  public async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(getStorage(), path);
      await deleteObject(fileRef);
      console.log('File deleted successfully:', path);
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
