// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Import Firestore related functions

const firebaseConfig = {
    apiKey: "AIzaSyDmAGZJTd1xSofgYgyQeGOYP2dSiLE646U",
    authDomain: "fotoflow-dev.firebaseapp.com",
    projectId: "fotoflow-dev",
    storageBucket: "fotoflow-dev.appspot.com",
    messagingSenderId: "180761954293",
    appId: "1:180761954293:web:2756c328ad6f8d792e82bc",
    measurementId: "G-HMJWHV4W3X"
};
const EMULATOR_HOST = "127.0.0.1";
const EMULATOR_PORT = 9199;
const EMULATOR_FIRESTORE_PORT = 8081;
// App
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app); 

// Emulator
connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_FIRESTORE_PORT);
  
  
export { storage,db };
