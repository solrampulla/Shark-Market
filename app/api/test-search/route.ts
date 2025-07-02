// app/api/test-search/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    console.log("Iniciando test de API para la búsqueda general...");
    
    // Ejecutamos la consulta exacta que falla en la página de búsqueda
    const query = adminDb.collection('products')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(10);
      
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({ 
        status: 'Éxito en la conexión, pero CERO resultados.', 
        message: 'La consulta se ejecutó correctamente pero no devolvió ningún documento.',
        product_count: 0
      });
    }

    const count = snapshot.size;
    const productTitles = snapshot.docs.map(doc => doc.data().title);

    return NextResponse.json({ 
      status: 'Éxito', 
      message: `La consulta funciona. Se encontraron ${count} productos.`,
      product_count: count,
      titles: productTitles // Devolvemos los títulos para verificar
    });

  } catch (error: any) {
    console.error("ERROR CRÍTICO en el test de búsqueda:", error);
    return NextResponse.json({ 
      status: 'Error Crítico en la Consulta', 
      message: 'La función falló con una excepción.',
      error_code: error.code || 'N/A',
      error_details: error.message 
    }, { status: 500 });
  }
}