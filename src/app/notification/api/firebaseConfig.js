
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyD0T6dajqnm3kbJqkOXpBVynPh6GtUbGKE",

  authDomain: "reportme-ec68c.firebaseapp.com",

  projectId: "reportme-ec68c",

  storageBucket: "reportme-ec68c.appspot.com",

  messagingSenderId: "721027071398",

  appId: "1:721027071398:web:72d1193ea34168d5726367",

  measurementId: "G-TE8NL1XZKM"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const timestamp = Timestamp.now();
const db = getFirestore(app);

export { db };



