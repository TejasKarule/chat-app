console.log("API KEY:", import.meta.env.VITE_API_KEY);
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "myreactchatapp-c83ed.firebaseapp.com",
  projectId: "myreactchatapp-c83ed",
  storageBucket: "myreactchatapp-c83ed.appspot.com",
  messagingSenderId: "320938083262",
  appId: "1:320938083262:web:7c83a9d69a8f3c1aac2fef",
  measurementId: "G-GVET1ECR1E",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
