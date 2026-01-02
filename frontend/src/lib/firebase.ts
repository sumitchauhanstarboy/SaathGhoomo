import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Prefer environment variables; fall back to hardcoded (legacy) values if present
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "" || "AIzaSyADUiQkjpv82V7edv7bB85zHSURS9uCD3Q";
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "" || "studio-1765981197-c0a8c.firebaseapp.com";
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "" || "studio-1765981197-c0a8c";
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "" || "studio-1765981197-c0a8c.firebasestorage.app";
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "" || "596614299724";
const appId = import.meta.env.VITE_FIREBASE_APP_ID || "" || "1:596614299724:web:ce951f8254e9";

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Basic synchronous check for presence of required fields
export const firebaseEnabled = Boolean(apiKey && projectId && authDomain);

let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (firebaseEnabled) {
  try {
    app = initializeApp(firebaseConfig as any);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope("profile");
    googleProvider.addScope("email");
  } catch (err) {
    console.warn("Firebase initialization failed:", err);
  }
} else {
  console.warn("Firebase not initialized: missing VITE_FIREBASE_* env vars or incomplete config.");
}

// Async helper to validate Firebase project configuration (checks Identity Toolkit project config)
export const validateFirebaseProject = async (): Promise<boolean> => {
  if (!firebaseEnabled) return false;
  try {
    const key = apiKey;
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.warn("Firebase project validation failed:", json);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("Error validating Firebase project:", e);
    return false;
  }
};

export default app;
export { auth, googleProvider };
