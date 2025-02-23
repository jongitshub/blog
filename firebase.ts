// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyDNWYEVXeoA9O_xzLqOHFeN_35e4bQZERw",
  authDomain: "blog-349d0.firebaseapp.com",
  projectId: "blog-349d0",
  storageBucket: "blog-349d0.firebasestorage.app",
  messagingSenderId: "673971289576",
  appId: "1:673971289576:web:0646ee302bf1b67a84b85d",
  measurementId: "G-FFXMKRHBMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
