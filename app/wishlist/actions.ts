// --- ARCHIVO FINAL Y CORREGIDO: app/wishlist/actions.ts ---
'use server';

import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue, type QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
// ---> CORRECCIÓN 1: Importamos el tipo 'Product' desde nuestro archivo central de tipos.
import { type Product } from '@/types'; 

// --- ACCIÓN 1: AÑADIR O QUITAR DE FAVORITOS ---
export async function toggleWishlistAction(userId: string, productId: string) {
  if (!userId || !productId) {
    return { success: false, message: 'Faltan datos para realizar la operación.' };
  }
  try {
    const wishlistRef = adminDb.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();
    if (wishlistDoc.exists) {
      const productIds = wishlistDoc.data()?.productIds || [];
      if (productIds.includes(productId)) {
        await wishlistRef.update({ productIds: FieldValue.arrayRemove(productId), updatedAt: FieldValue.serverTimestamp() });
        revalidatePath('/my-wishlist');
        return { success: true, message: 'Producto eliminado de favoritos.', added: false };
      } else {
        await wishlistRef.update({ productIds: FieldValue.arrayUnion(productId), updatedAt: FieldValue.serverTimestamp() });
        revalidatePath('/my-wishlist');
        return { success: true, message: '¡Añadido a favoritos!', added: true };
      }
    } else {
      await wishlistRef.set({
        userId: userId,
        productIds: [productId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      revalidatePath('/my-wishlist');
      return { success: true, message: '¡Añadido a favoritos!', added: true };
    }
  } catch (error: any) {
    console.error('[Action] Error en toggleWishlistAction:', error);
    return { success: false, message: 'Error en el servidor al gestionar favoritos.' };
  }
}

// --- ACCIÓN 2: OBTENER SOLO LOS IDs DE FAVORITOS ---
export async function getWishlistProductIdsAction(userId: string): Promise<string[]> {
  'use server';
  if (!userId) return [];
  try {
    const wishlistRef = adminDb.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();
    if (wishlistDoc.exists) {
      return wishlistDoc.data()?.productIds || [];
    }
    return [];
  } catch (error) {
    console.error('[Action] Error en getWishlistProductIdsAction:', error);
    return [];
  }
}

// --- ACCIÓN 3: OBTENER LOS PRODUCTOS COMPLETOS DE LA LISTA DE FAVORITOS ---
export async function fetchWishlistProductsAction(userId: string): Promise<{
  success: boolean;
  data?: Product[];
  message?: string;
}> {
  'use server';
  if (!userId) {
    return { success: false, message: "El usuario no está autenticado." };
  }
  try {
    const wishlistRef = adminDb.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();
    if (!wishlistDoc.exists) return { success: true, data: [] };

    const productIds = wishlistDoc.data()?.productIds || [];
    if (productIds.length === 0) return { success: true, data: [] };

    const productsQuery = adminDb.collection('products').where(admin.firestore.FieldPath.documentId(), 'in', productIds);
    const snapshot = await productsQuery.get();
    if (snapshot.empty) return { success: true, data: [] };

    const wishlistedProducts = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      // ---> CORRECCIÓN 2: Aseguramos que se devuelva un objeto Product completo y con fechas serializadas.
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
        updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        isWishlisted: true,
      } as Product;
    });

    return { success: true, data: wishlistedProducts };
  } catch (error: any) {
    console.error('[Action] Error en fetchWishlistProductsAction:', error);
    return { success: false, message: 'No se pudieron cargar los favoritos.' };
  }
}