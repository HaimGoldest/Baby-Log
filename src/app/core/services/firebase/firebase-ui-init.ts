import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../../../environments/environment';

/**
 * Returns the Firebase Auth instance used specifically for firebaseui,
 * initializing the app only if it hasn't been initialized yet.
 */
export function getFirebaseUIAuth() {
  if (!getApps().length) {
    initializeApp(environment.firebaseConfig);
  }
  return getAuth();
}
