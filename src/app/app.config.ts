import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  provideFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
} from '@angular/fire/firestore';
import {
  provideStorage,
  getStorage,
  connectStorageEmulator,
} from '@angular/fire/storage';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),

    // Material providers
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' },
    { provide: LOCALE_ID, useValue: 'he-IL' },

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    provideAuth(() => {
      const auth = getAuth();

      if (environment.useFirebaseEmulators) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
          disableWarnings: true,
        });
      }

      return auth;
    }),

    provideFirestore(() => {
      // IndexedDB-backed cache: writes queued while offline survive a page
      // reload and are flushed once connectivity returns. Without it the cache
      // is memory-only and any un-acknowledged write is lost on refresh.
      const firestore = initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });

      if (environment.useFirebaseEmulators) {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }

      return firestore;
    }),

    provideStorage(() => {
      const storage = getStorage();

      if (environment.useFirebaseEmulators) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }

      return storage;
    }),
  ],
};
