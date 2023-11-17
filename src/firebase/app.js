// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"; // Import Firestore related functions
import { getAuth, connectAuthEmulator,GoogleAuthProvider,signInWithPopup } from "firebase/auth"; // Import Auth related functions

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
const EMULATOR_AUTH_PORT = 9099; // Define the authentication emulator port

// App
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app); 
const auth = getAuth(app); // Initialize Auth module

// Emulator
connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_FIRESTORE_PORT);
connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_AUTH_PORT}`); // Using http:// scheme

//Google Auth
const provider = new GoogleAuthProvider();
  
export { storage,db,auth,provider,signInWithPopup };
