// lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// Leemos las variables de entorno
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// --- ESTA ES LA LÍNEA CLAVE QUE RESTAURAMOS ---
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Usamos el nombre del bucket que definimos en .env.local
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// La lógica de inicialización se mantiene
if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey && bucketName) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: bucketName
      });
      console.log('Firebase Admin SDK inicializado correctamente.');
    } catch (error: any) {
      console.error('Error al inicializar Firebase Admin SDK:', error.message);
    }
  } else {
    // El log de error por variables faltantes se mantiene
    let missingVars = [];
    if (!projectId) missingVars.push('FIREBASE_PROJECT_ID');
    if (!clientEmail) missingVars.push('FIREBASE_CLIENT_EMAIL');
    if (!privateKey) missingVars.push('FIREBASE_PRIVATE_KEY (o su formato es incorrecto)');
    if (!bucketName) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
    
    console.error(`Faltan credenciales para Firebase Admin SDK. Revisa tu archivo .env.local. Variables posiblemente faltantes o incorrectas: ${missingVars.join(', ')}`);
  }
}

export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export const adminDb = admin.firestore();

export default admin;