import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';
import { firebaseConfig, firebaseConfigReady } from './firebase-config.js';

let app = null;
let auth = null;
let db = null;
let storage = null;
let firebaseInitError = null;

if (firebaseConfigReady) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    firebaseInitError = error;
    console.error('[NINEWORKS Firebase] initialization failed', error);
  }
}

export {
  firebaseConfig,
  firebaseConfigReady,
  firebaseInitError,
  app,
  auth,
  db,
  storage
};
