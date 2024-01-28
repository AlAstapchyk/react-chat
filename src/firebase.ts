import { FirebaseError, initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const getAuthErrorStr = (e: FirebaseError) => {
  const errorCode = e.code;
  console.log(errorCode);
  if (errorCode === "auth/email-already-in-use")
    return "Email is already in use";
  else if (errorCode === "auth/invalid-email") return "Invalid email";
  else if (errorCode === "auth/invalid-credential") return "Invalid email or password"
  else if (errorCode === "auth/weak-password") return "Weak password";
  else if (errorCode === "auth/user-not-found") return "User not found";
  else if (errorCode === "auth/wrong-password") return "Wrong password";
  else if (errorCode === "auth/timeout") return "Operation has timeout";
  else if (errorCode === "auth/too-many-requests") return "Too many requests";
  else if (errorCode === "auth/network-request-failed")
    return "Network request error";
  else return "Something went wrong";
};
export const storage = getStorage();
export const firestore = getFirestore();
export const db = getDatabase();
