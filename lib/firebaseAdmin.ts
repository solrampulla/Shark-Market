// lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// Leemos las variables de entorno
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// La clave privada necesita que los caracteres '\\n' literales se reemplacen por saltos de línea reales
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Usamos el nombre del bucket que definimos en .env.local
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// Inicializamos la app de admin solo si no hay otras apps ya inicializadas
// Esto es importante para evitar errores durante el hot-reloading en desarrollo en Next.js
if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey && bucketName) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: bucketName // Aquí usamos el nombre del bucket
      });
      console.log('Firebase Admin SDK inicializado correctamente.');
    } catch (error: any) {
      console.error('Error al inicializar Firebase Admin SDK:', error.message);
      // Considera lanzar un error aquí si la inicialización es crítica para el arranque del servidor
      // throw new Error('No se pudo inicializar Firebase Admin SDK: ' + error.message);
    }
  } else {
    // Construye un mensaje de error más detallado
    let missingVars = [];
    if (!projectId) missingVars.push('FIREBASE_PROJECT_ID');
    if (!clientEmail) missingVars.push('FIREBASE_CLIENT_EMAIL');
    if (!privateKey) missingVars.push('FIREBASE_PRIVATE_KEY (o su formato es incorrecto)');
    if (!bucketName) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
    
    console.error(`Faltan credenciales o configuración para Firebase Admin SDK. Revisa tu archivo .env.local. Variables posiblemente faltantes o incorrectas: ${missingVars.join(', ')}`);
    // En un entorno de producción, deberías considerar esto un error fatal.
    // throw new Error('Faltan credenciales críticas para Firebase Admin SDK.');
  }
}

// Exportamos los servicios de admin que probablemente necesitaremos
// Se llaman como funciones para obtener la instancia del servicio de la app inicializada.
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export const adminDb = admin.firestore();

// También puedes exportar la instancia completa de admin si la necesitas directamente
export default admin;