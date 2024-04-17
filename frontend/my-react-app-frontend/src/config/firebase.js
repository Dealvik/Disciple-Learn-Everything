// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6UdsdNBwfhfIP-KL4OQRHXFb5kH2-zjQ",
  authDomain: "fir-full-stack-app.firebaseapp.com",
  projectId: "fir-full-stack-app",
  storageBucket: "fir-full-stack-app.appspot.com",
  messagingSenderId: "1067126523779",
  appId: "1:1067126523779:web:168b52e4c8cbad157218b6",
  measurementId: "G-RLJWZ7BWVF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
