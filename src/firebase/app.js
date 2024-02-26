// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics,isSupported,logEvent } from "firebase/analytics";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

if(process.env.NODE_ENV === 'development'){
    console.log('DEV MODE');
    console.log(process.env.REACT_APP_API_KEY);
    
}
else{
    console.log('PROD MODE');
    console.log(process.env.REACT_APP_API_KEY);
}
const firebaseConfig = {
    apiKey: "AIzaSyDmAGZJTd1xSofgYgyQeGOYP2dSiLE646U",
    authDomain: "fotoflow-dev.firebaseapp.com",
    projectId: "fotoflow-dev",
    storageBucket: "fotoflow-dev.appspot.com",
    messagingSenderId: "180761954293",
    appId: "1:180761954293:web:2756c328ad6f8d792e82bc",
    measurementId: "G-HMJWHV4W3X"
  };


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app); 
const analytics = getAnalytics(app);
//const auth = getAuth(app);

if (process.env.NODE_ENV === 'development') {
    const EMULATOR_HOST = process.env.REACT_APP_EMULATOR_HOST;
    const EMULATOR_PORT = process.env.REACT_APP_EMULATOR_PORT;
    const EMULATOR_FIRESTORE_PORT = process.env.REACT_APP_EMULATOR_FIRESTORE_PORT;
    const EMULATOR_AUTH_PORT = process.env.REACT_APP_EMULATOR_AUTH_PORT;


    connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_FIRESTORE_PORT);
    //connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_AUTH_PORT}`);
}

const provider = new GoogleAuthProvider();

export { storage, db, analytics/* , auth, provider, signInWithPopup */};