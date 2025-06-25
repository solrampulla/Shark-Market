// --- ARCHIVO COMPLETO Y CORREGIDO: app/actions/user.actions.ts ---
'use server';

import * as admin from 'firebase-admin';
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getDownloadURL } from 'firebase-admin/storage';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { type Product, type PurchasedProductEntry, type ProfileData } from '@/types';

// --- ACCIONES DE PERFIL Y USUARIO ---

export async function getUserProfileRoleAction(userId: string): Promise<{ role?: string | null; error?: string; }> {
    if (!userId) return { error: "No se proporcionó ID." };
    try {
        const profileDocRef = adminDb.collection('profiles').doc(userId);
        const profileSnap = await profileDocRef.get();
        if (profileSnap.exists) { 
            const role = profileSnap.data()?.role;
            if (typeof role === 'string' && role.toLowerCase() === 'seller') return { role: 'seller' };
            return { role: role || null };
        } else { 
            return { error: "Perfil no encontrado." };
        }
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
            const mainFileUrl = files && files.length > 0 ? files[0].url : '';
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
    const sellerProducts = productsQuery.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, ...data,
            createdAt: (data.createdAt as admin.firestore.Timestamp)?.toMillis() || null,
            updatedAt: (data.updatedAt as admin.firestore.Timestamp)?.toMillis() || null,
        } as Product
    });
    return { success: true, profile: sellerProfile, products: sellerProducts };
  } catch (error: any) {
    console.error(`[Action] Error en getSellerPublicProfileAction para ${username}:`, error);
    return { success: false, message: 'Error del servidor.' };
  }
}

interface ProfileUpdateData {
  full_name?: string | null;
  username?: string | null;
  professional_title?: string | null;
  website_url?: string | null;
  linkedin_url?: string | null;
}

export async function updateProfileMetadataAction(
  userId: string,
  updateData: ProfileUpdateData, 
  avatarStoragePath: string | null
) {
  if (!userId) return { success: false, message: 'ID de usuario no proporcionado.' };
  try {
    if (updateData.username) {
        const username = updateData.username;
        if (username.length < 3 || username.length > 20 || !/^[a-z0-9_-]+$/.test(username)) {
            return { success: false, message: 'Formato de nombre de usuario no válido.' };
        }
        const usersWithSameUsername = await adminDb.collection('profiles').where('username', '==', username).limit(1).get();
        if (!usersWithSameUsername.empty) {
            const existingUser = usersWithSameUsername.docs[0];
            if (existingUser.id !== userId) {
                return { success: false, message: 'Este nombre de usuario ya está en uso. Por favor, elige otro.' };
            }
        }
    }
    const profileDocRef = adminDb.collection('profiles').doc(userId);
    const dataToUpdate: { [key: string]: any } = {};
    Object.keys(updateData).forEach(key => {
      const typedKey = key as keyof ProfileUpdateData;
      if (updateData[typedKey] != null && updateData[typedKey] !== '') {
        dataToUpdate[typedKey] = updateData[typedKey];
      }
    });
    let newAvatarPublicUrl: string | null = null;
    if (avatarStoragePath) {
      const fileRef = adminStorage.bucket().file(avatarStoragePath);
      newAvatarPublicUrl = await getDownloadURL(fileRef);
      dataToUpdate.avatar_url = newAvatarPublicUrl;
    }
    if (Object.keys(dataToUpdate).length > 0) {
      await profileDocRef.set(dataToUpdate, { merge: true });
    } else {
      return { success: true, message: "No se detectaron cambios para guardar." };
    }
    revalidatePath('/settings');
    revalidatePath('/');
    return { success: true, message: '¡Perfil guardado con éxito!', newAvatarUrl: newAvatarPublicUrl };
  } catch (error: any) {
    console.error('[Action] Error en updateProfileMetadataAction:', error);
    if (error.code === 'failed-precondition') {
        return { success: false, message: 'Error de base de datos: La consulta requiere un índice.' };
    }
    return { success: false, message: error.message || 'Error en el servidor al actualizar el perfil.' };
  }
}

export async function generateAvatarUploadUrlAction(
    userId: string, 
    fileName: string, 
    fileType: string
) {
    if (!userId) return { success: false, message: 'Usuario no autenticado.' };
    const filePath = `avatars/${userId}/${Date.now()}_${fileName}`;
    const file = adminStorage.bucket().file(filePath);
    try {
        const [url] = await file.getSignedUrl({
            version: 'v4', action: 'write', expires: Date.now() + 15 * 60 * 1000, contentType: fileType,
        });
        return { success: true, uploadUrl: url, filePath: filePath, message: 'URL firmada generada.' };
    } catch (error: any) {
        console.error("Error al generar la URL firmada:", error);
        return { success: false, message: 'No se pudo generar la URL para subir el archivo.' };
    }
}

export async function createStripeOnboardingLinkAction(userId: string): Promise<{ success: boolean; url?: string; message: string; }> {
    if (!userId) return { success: false, message: 'Usuario no autenticado.' };
    try {
        const profileRef = adminDb.collection('profiles').doc(userId);
        const profileSnap = await profileRef.get();
        if (!profileSnap.exists) throw new Error("Perfil de usuario no encontrado.");
        
        const profileData = profileSnap.data() as ProfileData;
        let stripeAccountId = profileData.stripeAccountId;

        if (!stripeAccountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                email: profileData.email!,
                business_type: 'individual',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
            stripeAccountId = account.id;
            await profileRef.update({ stripeAccountId: stripeAccountId });
        }
        
        const origin = headers().get('origin') || 'http://localhost:3000';
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${origin}/settings?reauth=true`,
            return_url: `${origin}/settings?stripe_connected=true`,
            type: 'account_onboarding',
        });
        return { success: true, url: accountLink.url, message: 'Enlace de onboarding creado.' };
    } catch (error: any) {
        console.error('[Action] Error en createStripeOnboardingLinkAction:', error);
        return { success: false, message: `Error del servidor: ${error.message}` };
    }
}

export async function createStripeLoginLinkAction(stripeAccountId: string): Promise<{ success: boolean; url?: string; message: string; }> {
    if (!stripeAccountId) return { success: false, message: 'El ID de la cuenta de Stripe no fue proporcionado.' };
    try {
        const loginLink = await stripe.accounts.createLoginLink(stripeAccountId);
        return { success: true, url: loginLink.url, message: 'Enlace de inicio de sesión creado.' };
    } catch (error: any) {
        console.error(`[Stripe Connect] Error al crear login link para ${stripeAccountId}:`, error);
        return { success: false, message: `Error del servidor: ${error.message}` };
    }
}

export async function getAllPublicSellersForSitemap(): Promise<{ username: string, updatedAt: admin.firestore.Timestamp | null }[]> {
    try {
        const profilesQuery = await adminDb.collection('profiles')
            .where('role', '==', 'seller')
            .where('username', '!=', null)
            .select('username', 'updatedAt')
            .get();

        if (profilesQuery.empty) {
            return [];
        }

        return profilesQuery.docs.map(doc => {
            const data = doc.data();
            return {
                username: data.username,
                updatedAt: data.updatedAt || data.createdAt || null,
            };
        });

    } catch (error) {
        console.error("Error fetching seller usernames for sitemap:", error);
        return [];
    }
}