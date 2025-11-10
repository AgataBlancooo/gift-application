declare const __initial_auth_token: string | undefined;

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnH8DHDz3m7bBjxvp4Fk_Jq5xGVcEMqv4",
  authDomain: "prezent-dla-ukochanego.firebaseapp.com",
  projectId: "prezent-dla-ukochanego",
  storageBucket: "prezent-dla-ukochanego.appspot.com",
  messagingSenderId: "873626315727",
  appId: "1:873626315727:web:ffffd1e6b8f831262280ba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export const authenticate = async () => {
  try {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Firebase Auth Error:", error);
  }
};

export { db, auth, storage };
