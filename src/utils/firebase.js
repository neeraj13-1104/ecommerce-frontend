import {getAuth} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "storelogin-5daf5.firebaseapp.com",
  projectId: "storelogin-5daf5",
  storageBucket: "storelogin-5daf5.firebasestorage.app",
  messagingSenderId: "139437552744",
  appId: "1:139437552744:web:c5cded2a3ceb28ce98b7dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}