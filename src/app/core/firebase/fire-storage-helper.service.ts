import {
  Injectable,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FireStorageHelperService {
  private storage = inject(Storage);
  private env = inject(EnvironmentInjector);

  /** Upload a file, return its download URL. */
  public async uploadFile(path: string, file: File): Promise<string> {
    return runInInjectionContext(this.env, async () => {
      const r = ref(this.storage, path);
      await uploadBytes(r, file);
      console.log('File uploaded successfully:', path);
      return await getDownloadURL(r);
    });
  }

  /** Get download URL or null if missing. */
  public async getFileUrl(path: string): Promise<string | null> {
    return runInInjectionContext(this.env, async () => {
      const r = ref(this.storage, path);
      try {
        return await getDownloadURL(r);
      } catch (e: any) {
        if (e.code === 'storage/object-not-found') {
          console.warn('File not found:', path);
          return null;
        }
        console.error('Error retrieving file URL:', e);
        throw e;
      }
    });
  }

  /** Delete a file by path. */
  public async deleteFile(path: string): Promise<void> {
    return runInInjectionContext(this.env, async () => {
      const r = ref(this.storage, path);
      try {
        await deleteObject(r);
        console.log('File deleted successfully:', path);
      } catch (e: any) {
        if (e.code === 'storage/object-not-found') {
          console.warn('File not found for deletion:', path);
          return;
        }
        console.error('Error deleting file:', e);
        throw e;
      }
    });
  }
}
