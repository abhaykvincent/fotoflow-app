// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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
initializeApp(firebaseConfig);
const storage = getStorage();
connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
// If you need to use the emulator, you can add the emulator connection code here.
// connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);

export { storage };
