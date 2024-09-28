
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaaKL3oa6sOiI_2VZ7mTgqepncd472ceA",
  authDomain: "reportme-2a05c.firebaseapp.com",
  databaseURL: "https://reportme-2a05c-default-rtdb.firebaseio.com",
  projectId: "reportme-2a05c",
  storageBucket: "reportme-2a05c.appspot.com",
  messagingSenderId: "698644646765",
  appId: "1:698644646765:web:bb1406bf288a06f5986864",
  measurementId: "G-CKP2Q6DY67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const timestamp = Timestamp.now();
const db = getFirestore(app);

export { db };



