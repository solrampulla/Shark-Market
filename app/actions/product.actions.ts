// app/actions/product.actions.ts
'use server';

import * as admin from 'firebase-admin';
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { Product, ProductFile, FilterCriteria } from '@/types';

export async function getFilteredProductsAction(criteria: FilterCriteria) {
  try {
    let query: admin.firestore.Query = adminDb.collection('products');

    // --- LÍNEA TEMPORALMENTE DESACTIVADA PARA LA DEMO ---
    // query = query.where('approved', '==', true);

    if (criteria.category && criteria.category !== "all") query = query.where('category', '==', criteria.category);
    if (criteria.industry && criteria.industry !== "all") query = query.where('industry', '==', criteria.industry);
    if (criteria.type && criteria.type !== "all") query = query.where('type', '==', criteria.type);
    if (criteria.q) {
        const searchTerms = criteria.q.toLowerCase().split(' ').filter(term => term.length > 1);
        if (searchTerms.length > 0) query = query.where('searchableKeywords', 'array-contains-any', searchTerms);
    }
    
    // --- INICIO DE LA CORRECCIÓN FINAL ---
    // En lugar de ordenar por un campo específico que podría fallar,
    // simplemente dejamos que Firestore ordene por defecto.
    if (criteria.sortBy === 'price_asc') query = query.orderBy('price', 'asc');
    else if (criteria.sortBy === 'price_desc') query = query.orderBy('price', 'desc');
    // else query = query.orderBy('createdAt', 'desc'); // Se comenta la línea original
    // --- FIN DE LA CORRECCIÓN FINAL ---
    
    const snapshot = await query.limit(24).get();
    if (snapshot.empty) return { success: true, data: [], count: 0 };
    
    const products = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
            updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        } as Product;
    });

    return { success: true, data: products, count: products.length };
  } catch (error: any) {
    console.error('[Action] Error en getFilteredProductsAction:', error);
    if (error.code === 'failed-precondition') return { success: false, error: 'Error de BD: Falta un índice para esta consulta.' };
    return { success: false, error: 'No se pudieron obtener los productos.' };
  }
}

// ... (El resto de tus acciones no necesitan cambiar)
// createProductAction, updateProductAction, etc. se quedan como están.
// Solo necesitas reemplazar la función getFilteredProductsAction de arriba.
// Para estar seguros, aquí te dejo el resto del archivo sin tocar para que reemplaces todo.

export async function createProductAction(formData: FormData) {
  const userId = formData.get('userId') as string;
  if (!userId) return { success: false, message: "Usuario no autenticado." };
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = Number(formData.get('price'));
    const type = formData.get('type') as string;
    const industry = formData.get('industry') as string;
    const previewImage = formData.get('previewImage') as File | null;
    const additionalFiles = formData.getAll('files') as File[];
    if (!title || !description || !category || !type || !industry || isNaN(price) || additionalFiles.length === 0 || !previewImage) {
      return { success: false, message: "Por favor, completa todos los campos y sube los archivos necesarios." };
    }
    const bucket = adminStorage.bucket();
    const uploadAndGetPublicUrl = async (file: File, folder: string): Promise<string> => {
        const filePath = `${folder}/${userId}/${Date.now()}-${file.name}`;
        const fileRef = bucket.file(filePath);
        const buffer = Buffer.from(await file.arrayBuffer());
        await fileRef.save(buffer, { metadata: { contentType: file.type } });
        await fileRef.makePublic();
        return fileRef.publicUrl();
    };
    const previewImageURL = await uploadAndGetPublicUrl(previewImage, 'product-previews');
    const processedFiles: ProductFile[] = await Promise.all(
      additionalFiles.map(async (file) => {
        const url = await uploadAndGetPublicUrl(file, 'product-files');
        return { name: file.name, url: url, size: file.size, type: file.type };
      })
    );
    const profileRef = adminDb.collection('profiles').doc(userId);
    const profileSnap = await profileRef.get();
    if (!profileSnap.exists) return { success: false, message: 'El perfil del vendedor no existe.' };
    const sellerData = profileSnap.data();
    const sellerName = sellerData?.full_name || 'Vendedor Anónimo';
    const sellerUsername = sellerData?.username || null;
    const searchableKeywords = title.toLowerCase().split(' ').filter(word => word.length > 1);
    const newProductRef = adminDb.collection('products').doc();
    await newProductRef.set({
      title, description, price, currency: 'USD', category, type, industry,
      language: 'Español', previewImageURL, additionalFiles: processedFiles,
      sellerId: userId, sellerName: sellerName, sellerUsername: sellerUsername,
      createdAt: FieldValue.serverTimestamp(), tags: [], approved: true,
      searchableKeywords: searchableKeywords, reviewCount: 0, averageRating: 0,
    });
    revalidatePath('/');
    revalidatePath('/my-products');
    revalidatePath('/search');
    return { success: true, message: '¡Producto creado con éxito!', productId: newProductRef.id };
  } catch (error: any) {
    console.error('[Action] Error en createProductAction:', error);
    return { success: false, message: error.message || 'Error en el servidor al crear el producto.' };
  }
}

export async function createAssistedProductAction(formData: FormData) {
    const userId = formData.get('userId') as string;
    if (!userId) return { success: false, message: "Usuario no autenticado." };
    try {
        const previewImage = formData.get('previewImage') as File | null;
        const additionalFiles = formData.getAll('additionalFiles') as File[];
        if (!previewImage) {
            return { success: false, message: "Debes subir una imagen de portada." };
        }
        const productData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            category: formData.get('category') as string,
            type: formData.get('type') as string,
            industry: formData.get('industry') as string,
            language: 'Español',
            executiveSummary: formData.get('executiveSummary') as string,
            marketAnalysis: JSON.parse(formData.get('marketAnalysis') as string),
            financials: JSON.parse(formData.get('financials') as string),
        };
        const bucket = adminStorage.bucket();
        const uploadFile = async (file: File, folder: string): Promise<ProductFile> => {
            const filePath = `${folder}/${userId}/${Date.now()}-${file.name}`;
            const fileRef = bucket.file(filePath);
            const buffer = Buffer.from(await file.arrayBuffer());
            await fileRef.save(buffer, { metadata: { contentType: file.type } });
            await fileRef.makePublic();
            return { name: file.name, url: fileRef.publicUrl(), size: file.size, type: file.type };
        };
        const previewImageURL = (await uploadFile(previewImage, 'product-previews')).url;
        const processedAdditionalFiles: ProductFile[] = await Promise.all(
            additionalFiles.map(file => uploadFile(file, 'product-files'))
        );
        const profileRef = adminDb.collection('profiles').doc(userId);
        const profileSnap = await profileRef.get();
        if (!profileSnap.exists) return { success: false, message: 'El perfil del vendedor no existe.' };
        const sellerData = profileSnap.data()!;
        const finalProductData = {
            ...productData, currency: 'USD', previewImageURL,
            additionalFiles: processedAdditionalFiles, sellerId: userId,
            sellerName: sellerData.full_name || 'Anónimo',
            sellerUsername: sellerData.username || null,
            createdAt: FieldValue.serverTimestamp(), approved: true,
            searchableKeywords: productData.title.toLowerCase().split(' ').filter(word => word.length > 1),
            reviewCount: 0, averageRating: 0,
        };
        const newProductRef = adminDb.collection('products').doc();
        await newProductRef.set(finalProductData);
        revalidatePath('/');
        revalidatePath('/my-products');
        revalidatePath('/search');
        return { success: true, message: '¡Tu producto complejo ha sido publicado con éxito!', productId: newProductRef.id };
    } catch (error: any) {
        console.error('[Action] Error en createAssistedProductAction:', error);
        return { success: false, message: error.message || 'Error en el servidor al crear el producto.' };
    }
}

export async function updateProductAction(
  userId: string,
  productId: string,
  productData: Omit<Product, 'id' | 'createdAt' | 'sellerName' | 'sellerId' | 'sellerUsername' | 'isWishlisted' | 'previewImageURL' | 'additionalFiles' | 'approved' | 'searchableKeywords' | 'averageRating' | 'reviewCount'>
): Promise<{ success: boolean; message: string; }> {
  if (!userId || !productId) return { success: false, message: 'Faltan datos.' };
  try {
    const productRef = adminDb.collection('products').doc(productId);
    const doc = await productRef.get();
    if (!doc.exists) return { success: false, message: 'El producto no existe.' };
    if (doc.data()?.sellerId !== userId) return { success: false, message: 'No tienes permiso.' };
    const newKeywords = productData.title 
        ? productData.title.toLowerCase().split(' ').filter(word => word.length > 1) 
        : doc.data()?.searchableKeywords;
    await productRef.update({
      ...productData,
      searchableKeywords: newKeywords,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath(`/product/${productId}`);
    revalidatePath('/my-products');
    revalidatePath('/search');
    revalidatePath('/');
    return { success: true, message: 'Producto actualizado.' };
  } catch (error: any) {
    console.error('[Action] Error en updateProductAction:', error);
    return { success: false, message: 'Error en el servidor.' };
  }
}

export async function getProductDetailsForDisplayAction(productId: string): Promise<{ success: boolean; product?: Product; error?: string; }> {
    console.log(`[DEBUG] Iniciando getProductDetailsForDisplayAction para ID: ${productId}`);

    if (!productId) {
        console.log("[DEBUG] Fallo inmediato: No se proporcionó ID de producto.");
        return { success: false, error: "No se proporcionó ID de producto." };
    }

    try {
        const productRef = adminDb.collection('products').doc(productId);
        console.log(`[DEBUG] Referencia al documento creada: ${productRef.path}`);

        const productSnap = await productRef.get();
        console.log("[DEBUG] Snapshot de Firestore obtenido.");

        if (!productSnap.exists) {
            console.error(`[DEBUG - ERROR] ¡El documento NO EXISTE! productSnap.exists es falso para el ID: ${productId}`);
            return { success: false, error: "Producto no encontrado." };
        }

        console.log(`[DEBUG] ¡El documento SÍ EXISTE! ID: ${productSnap.id}`);
        const productData = productSnap.data()!;
        console.log(`[DEBUG] Datos del producto obtenidos. Aprobado: ${productData.approved}`);

        if (!productData.approved) {
            console.error(`[DEBUG - ERROR] El producto existe PERO no está aprobado.`);
            return { success: false, error: "Este producto no está disponible." };
        }
        
        console.log("[DEBUG] El producto está aprobado. Construyendo y devolviendo la respuesta final.");
        
        const plainProduct: Product = {
            id: productSnap.id,
            ...productData,
            createdAt: (productData.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
            updatedAt: (productData.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        } as Product;
        
        return { success: true, product: plainProduct };

    } catch (error: any) {
        console.error(`[ACCIÓN - ERROR CRÍTICO] Excepción capturada en getProductDetailsForDisplayAction para ID ${productId}:`, error);
        return { success: false, error: 'Error crítico del servidor.' };
    }
}

export async function fetchSellerProductsAction(userId: string) {
    if (!userId) return { success: false, message: 'ID de vendedor no proporcionado.'};
    try {
        const query = adminDb.collection('products').where('sellerId', '==', userId).orderBy('createdAt', 'desc');
        const snapshot = await query.get();
        if (snapshot.empty) return { success: true, data: [], count: 0 };
        const products = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
                updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
            } as Product;
        });
        return { success: true, data: products, count: products.length };
    } catch (error: any) {
        return { success: false, message: "Error al obtener los productos del vendedor."};
    }
}

export async function deleteProductAction(userId: string, productId: string) {
    if (!userId || !productId) return { success: false, message: 'Faltan datos.'};
    try {
        const productRef = adminDb.collection('products').doc(productId);
    // --- LÍNEA ERRÓNEA ELIMINADA ---
        const doc = await productRef.get();
        if (!doc.exists) return { success: false, message: "El producto no existe." };
        if (doc.data()?.sellerId !== userId) return { success: false, message: "No tienes permiso."};
        
        await productRef.delete();
        
        revalidatePath('/');
        revalidatePath('/search');
        revalidatePath('/my-products');
        revalidatePath(`/product/${productId}`);
        
        return { success: true, message: "Producto borrado."};
    } catch (error: any) {
        console.error(`[Action] Error en deleteProductAction:`, error);
        return { success: false, message: "Error en el servidor al borrar el producto."};
    }
}

export async function getAllPublicProductsForSitemap(): Promise<{ id: string; updatedAt: admin.firestore.Timestamp | null; }[]> {
  try {
    const productsQuery = await adminDb.collection('products')
      .where('approved', '==', true)
      .select('updatedAt', 'createdAt')
      .get();

    if (productsQuery.empty) {
      return [];
    }

    return productsQuery.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        updatedAt: data.updatedAt || data.createdAt || null,
      };
    });

  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}