// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaaKL3oa6sOiI_2VZ7mTgqepncd472ceA",

  authDomain: "reportme-2a05c.firebaseapp.com",

  projectId: "reportme-2a05c",

  storageBucket: "reportme-2a05c.appspot.com",

  messagingSenderId: "698644646765",

  appId: "1:698644646765:web:bb1406bf288a06f5986864",

  measurementId: "G-CKP2Q6DY67",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
