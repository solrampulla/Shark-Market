// --- ARCHIVO CORREGIDO: app/actions.ts ---
// CORRECCIÓN: Se añade la importación de 'firebase-admin' que faltaba.
'use server';

import * as admin from 'firebase-admin'; // <--- LA IMPORTACIÓN QUE FALTABA
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { Review, PurchasedProductEntry, ProfileData, Product } from '@/types';

// --- ACCIONES NO RELACIONADAS CON PRODUCTOS ---

export async function createOrderAction(userId: string, productId: string, productName: string, price: number, currency: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    if (!userId || !productId) return { success: false, error: 'Faltan datos.' };
    try {
        const orderRef = adminDb.collection('orders').doc();
        await orderRef.set({ userId, productId, status: 'pending', amount: price, currency: currency, createdAt: new Date() });
        const origin = headers().get('origin') || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: { currency: currency.toLowerCase(), product_data: { name: productName }, unit_amount: Math.round(price * 100) },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/my-purchases?payment_success=true`,
            cancel_url: `${origin}/product/${productId}?payment_canceled=true`,
            metadata: { userId, orderId: orderRef.id, productId },
        });
        if (!session.id) throw new Error("No se pudo crear la sesión de Stripe.");
        return { success: true, sessionId: session.id };
    } catch (error: any) {
        console.error('[Action] Error en createOrderAction:', error);
        return { success: false, error: 'Error al procesar el pago.' };
    }
}

export async function getUserProfileRoleAction(userId: string): Promise<{ role?: string | null; error?: string; }> {
    if (!userId) return { error: "No se proporcionó ID." };
    try {
        const profileDocRef = adminDb.collection('profiles').doc(userId);
        const profileSnap = await profileDocRef.get();
        if (profileSnap.exists) return { role: profileSnap.data()?.role || null }; 
        else return { error: "Perfil no encontrado." };
    } catch (error: any) {
        return { error: "Error del servidor." };
    }
}

export async function fetchUserPurchasesAction(userId: string): Promise<{ success: boolean; data?: PurchasedProductEntry[]; message?: string; }> {
    if (!userId) return { success: false, message: 'No autenticado.' };
    try {
        const accessRecordsQuery = adminDb.collection('user_product_access').where('userId', '==', userId);
        const accessSnapshot = await accessRecordsQuery.get();
        if (accessSnapshot.empty) return { success: true, data: [] };
        const productIds = accessSnapshot.docs.map(doc => doc.data().productId);
        if (productIds.length === 0) return { success: true, data: [] };
        const productsQuery = adminDb.collection('products').where(admin.firestore.FieldPath.documentId(), 'in', productIds);
        const productsSnapshot = await productsQuery.get();
        const productsData = new Map(productsSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const purchases = accessSnapshot.docs.map(doc => {
            const accessData = doc.data();
            const productData = productsData.get(accessData.productId);
            const files = productData?.additionalFiles || [];
            const mainFileUrl = files.length > 0 ? files[0].url : '';
            return {
                id: accessData.productId, purchaseOrderId: accessData.orderId,
                title: productData?.title || 'Producto no encontrado',
                previewImageURL: productData?.previewImageURL || null,
                purchaseGrantedAt: (accessData.grantedAt as admin.firestore.Timestamp)?.toMillis() || Date.now(),
                fileURL: mainFileUrl,
            };
        });
        return { success: true, data: purchases };
    } catch (error: any) {
        return { success: false, message: 'Error al cargar las compras.' };
    }
}

export async function getSellerPublicProfileAction(username: string): Promise<{
  success: boolean; profile?: ProfileData; products?: Product[]; message?: string;
}> {
  try {
    const profileQuery = await adminDb.collection('profiles').where('username', '==', username).limit(1).get();
    if (profileQuery.empty) return { success: false, message: 'Vendedor no encontrado.' };
    const sellerProfileDoc = profileQuery.docs[0];
    const sellerProfile = { id: sellerProfileDoc.id, ...sellerProfileDoc.data() } as ProfileData;
    if (!sellerProfile.role || sellerProfile.role.toLowerCase().trim() !== 'seller') {
      return { success: false, message: 'Este usuario no es un vendedor.' };
    }
    const productsQuery = await adminDb.collection('products').where('sellerId', '==', sellerProfile.id).where('approved', '==', true).orderBy('createdAt', 'desc').get();
    const sellerProducts = productsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return { success: true, profile: sellerProfile, products: sellerProducts };
  } catch (error: any) {
    console.error(`[Action] Error en getSellerPublicProfileAction para ${username}:`, error);
    return { success: false, message: 'Error del servidor.' };
  }
}

export async function getReviewsForProductAction(productId: string): Promise<{ success: boolean; reviews?: Review[]; message?: string;}> {
    if (!productId) return { success: false, message: 'ID de producto no proporcionado.' };
    try {
        const reviewsQuery = await adminDb.collection('reviews').where('productId', '==', productId).orderBy('createdAt', 'desc').get();
        if (reviewsQuery.empty) return { success: true, reviews: [] };
        const reviews = reviewsQuery.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id, ...data,
                createdAt: (data.createdAt as admin.firestore.Timestamp).toMillis(),
            } as Review;
        });
        return { success: true, reviews };
    } catch (error: any) {
        console.error(`[Action] Error en getReviewsForProductAction para producto ${productId}:`, error);
        return { success: false, message: 'Error al obtener las reseñas.' };
    }
}

export async function checkReviewEligibilityAction(userId: string, productId: string): Promise<{
    canReview: boolean; hasReviewed: boolean; message: string;
}> {
    if (!userId || !productId) return { canReview: false, hasReviewed: false, message: 'Faltan datos.' };
    try {
        const purchaseQuery = await adminDb.collection('user_product_access').where('userId', '==', userId).where('productId', '==', productId).limit(1).get();
        if (purchaseQuery.empty) return { canReview: false, hasReviewed: false, message: 'Debes comprar este producto.' };
        const reviewQuery = await adminDb.collection('reviews').where('userId', '==', userId).where('productId', '==', productId).limit(1).get();
        if (!reviewQuery.empty) return { canReview: false, hasReviewed: true, message: 'Ya has dejado una reseña.' };
        return { canReview: true, hasReviewed: false, message: 'Puedes dejar una reseña.' };
    } catch (error: any) {
        console.error(`[Action] Error en checkReviewEligibilityAction para ${userId}/${productId}:`, error);
        return { canReview: false, hasReviewed: false, message: 'Error del servidor.' };
    }
}

export async function submitReviewAction(
    userId: string,
    productId: string,
    rating: number,
    comment: string
): Promise<{ success: boolean, message: string }> {
    if (!userId) return { success: false, message: 'Debes iniciar sesión.' };
    if (rating < 1 || rating > 5) return { success: false, message: 'La calificación no es válida.' };
    if (comment.trim().length < 10) return { success: false, message: 'El comentario es muy corto.' };
    try {
        const eligibility = await checkReviewEligibilityAction(userId, productId);
        if (!eligibility.canReview) return { success: false, message: eligibility.message };
        const productRef = adminDb.collection('products').doc(productId);
        const reviewRef = adminDb.collection('reviews').doc();
        const userProfileRef = adminDb.collection('profiles').doc(userId);
        await adminDb.runTransaction(async (transaction) => {
            const productDoc = await transaction.get(productRef);
            const userProfileDoc = await transaction.get(userProfileRef);
            if (!productDoc.exists || !userProfileDoc.exists) throw new Error("Producto o perfil no encontrado.");
            const productData = productDoc.data()!;
            const userProfileData = userProfileDoc.data()!;
            transaction.set(reviewRef, {
                productId, userId, rating, comment: comment.trim(),
                createdAt: FieldValue.serverTimestamp(),
                buyerName: userProfileData.full_name || 'Anónimo',
                buyerAvatarUrl: userProfileData.avatar_url || null
            });
            const currentReviewCount = productData.reviewCount || 0;
            const currentAverageRating = productData.averageRating || 0;
            const newReviewCount = currentReviewCount + 1;
            const newAverageRating = ((currentAverageRating * currentReviewCount) + rating) / newReviewCount;
            transaction.update(productRef, {
                reviewCount: newReviewCount,
                averageRating: newAverageRating
            });
        });
        revalidatePath(`/product/${productId}`);
        return { success: true, message: "¡Gracias! Tu reseña ha sido publicada." };
    } catch (error: any) {
        console.error(`[Action] Error en submitReviewAction para ${userId}/${productId}:`, error);
        return { success: false, message: "No se pudo guardar tu reseña." };
    }
}