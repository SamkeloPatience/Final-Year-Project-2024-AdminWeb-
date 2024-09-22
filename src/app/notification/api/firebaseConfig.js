
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaaKL3oa6sOiI_2VZ7mTgqepncd472ceA",

  authDomain: "reportme-2a05c.firebaseapp.com",

  projectId: "reportme-2a05c",

  storageBucket: "reportme-2a05c.appspot.com",

  messagingSenderId: "698644646765",

  appId: "1:698644646765:web:bb1406bf288a06f5986864",

  measurementId: "G-CKP2Q6DY67",
};

const app = initializeApp(firebaseConfig);
const timestamp = Timestamp.now();
const db = getFirestore(app);

export { db };



/*import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJL0anHRFZKR88A2mh8Xw8MPuGRjYF5pY",
  authDomain: "group10-21b25.firebaseapp.com",
  projectId: "group10-21b25",
  storageBucket: "group10-21b25.appspot.com",
  messagingSenderId: "28253049036",
  appId: "1:28253049036:web:6b9dfb60187ca5f301f269",
  measurementId: "G-6ZMW32HP06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };*/