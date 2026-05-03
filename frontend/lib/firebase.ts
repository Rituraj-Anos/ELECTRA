import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

let authReady: Promise<User> = new Promise((resolve, reject) => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe();
    if (user) {
      resolve(user);
    } else {
      signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(reject);
    }
  });
});

export async function getAuthToken(): Promise<string | null> {
  try {
    const user = await authReady;
    return await user.getIdToken(true);
  } catch (err) {
    console.error("[Firebase] getAuthToken failed:", err);
    return null;
  }
}
