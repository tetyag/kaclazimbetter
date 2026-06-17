import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCEGOUWEfLAudIYN04lk90b53NoCgD8K70",
  authDomain: "kaclazim.firebaseapp.com",
  databaseURL: "https://kaclazim-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kaclazim",
  storageBucket: "kaclazim.firebasestorage.app",
  messagingSenderId: "520152979647",
  appId: "1:520152979647:web:6ba1a378d7fe5f9dd40e0a",
  measurementId: "G-65XK3J9J5L"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);