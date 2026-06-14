
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBMPN7Y1pFaQtDDiiCeAVGCoRrqTFwOozY",
  authDomain: "carevision-lk.firebaseapp.com",
  projectId: "carevision-lk",
  storageBucket: "carevision-lk.firebasestorage.app",
  messagingSenderId: "255751491699",
  appId: "1:255751491699:web:ef9884b9b5444d75921a06"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const googleProvider = new GoogleAuthProvider();