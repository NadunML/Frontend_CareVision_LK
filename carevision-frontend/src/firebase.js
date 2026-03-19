// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// මෙතන තියෙන විස්තර ඔයාගේ Firebase Console එකෙන් අරන් මාරු කරන්න
const firebaseConfig = {
  apiKey: "AIzaSyBMPN7Y1pFaQtDDiiCeAVGCoRrqTFwOozY",
  authDomain: "carevision-lk.firebaseapp.com",
  projectId: "carevision-lk",
  storageBucket: "carevision-lk.firebasestorage.app",
  messagingSenderId: "255751491699",
  appId: "1:255751491699:web:ef9884b9b5444d75921a06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set up Google Login Provider
export const googleProvider = new GoogleAuthProvider();