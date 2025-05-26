// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estatehub-57ee3.firebaseapp.com",
  projectId: "estatehub-57ee3",
  storageBucket: "estatehub-57ee3.firebasestorage.app",
  messagingSenderId: "661825584540",
  appId: "1:661825584540:web:32257d7de57dcd7e5edc59"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);