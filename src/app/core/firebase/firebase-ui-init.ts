import { initializeApp, getApps } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

let isAuthEmulatorConnected = false;

/**
 * Returns the Firebase Auth instance used specifically for firebaseui,
 * initializing the app only if it hasn't been initialized yet.
 */
export function getFirebaseUIAuth(): Auth {
  if (!getApps().length) {
    initializeApp(environment.firebaseConfig);
  }

  const auth = getAuth();

  if (environment.useFirebaseEmulators && !isAuthEmulatorConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });

    isAuthEmulatorConnected = true;
  }

  return auth;
}
