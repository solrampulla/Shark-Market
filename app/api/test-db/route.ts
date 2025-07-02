// app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    console.log("Iniciando test de API...");
    
    // La consulta más simple posible: ¿hay ALGO en la colección 'products'?
    const snapshot = await adminDb.collection('products').limit(5).get();

    if (snapshot.empty) {
      console.error("El test de API ha fallado: la colección 'products' está vacía o es inaccesible.");
      return NextResponse.json({ 
        status: 'Error', 
        message: 'La consulta no devolvió ningún documento.',
        product_count: 0
      });
    }

    const count = snapshot.size;
    console.log(`El test de API ha tenido ÉXITO. Se encontraron ${count} productos.`);
    return NextResponse.json({ 
      status: 'Éxito', 
      message: `La conexión con Firestore funciona. Se encontraron ${count} productos.`,
      product_count: count
    });

  } catch (error: any) {
    console.error("ERROR CRÍTICO en el test de API:", error);
    return NextResponse.json({ 
      status: 'Error Crítico', 
      message: 'La función falló con una excepción.',
      error_details: error.message 
    }, { status: 500 });
  }
}