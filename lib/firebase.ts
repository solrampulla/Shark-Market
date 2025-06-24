// lib/firebase.ts (CORREGIDO el storageBucket)
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage"; 
import { getAnalytics, type Analytics } from "firebase/analytics";

// Tu configuración de Firebase
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCYTA1LU_zXRkkAw_i_33nrc3r_Q09bfx8",
  authDomain: "bizplan-904f3.firebaseapp.com",
  projectId: "bizplan-904f3",
  // AQUÍ LA CORRECCIÓN IMPORTANTE:
  storageBucket: "bizplan-904f3.firebasestorage.app", // Usamos el que te muestra tu consola
  messagingSenderId: "989343070830",
  appId: "1:989343070830:web:ceaecc9decee73c93a447f",
  measurementId: "G-473SK8RHQG"
};

// Inicializar Firebase de forma robusta
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar servicios con tipos explícitos
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app); 

let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Error al inicializar Firebase Analytics o ya estaba inicializado:", e);
  }
}

export { app, auth, db, storage, analytics, firebaseConfig };