// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGTB6AYTGt4uxpbRShlP2mMgKHhwRQtgU",
  authDomain: "chat-e980b.firebaseapp.com",
  projectId: "chat-e980b",
  storageBucket: "chat-e980b.appspot.com",
  messagingSenderId: "800510676455",
  appId: "1:800510676455:web:00f17f5a62e6402d650142",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
