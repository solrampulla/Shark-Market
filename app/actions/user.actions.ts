// --- ARCHIVO ACTUALIZADO: app/actions/user.actions.ts ---
// CAMBIO: Se añade la nueva función 'getAllPublicSellersForSitemap' al final.
'use server';

import * as admin from 'firebase-admin';
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getDownloadURL } from 'firebase-admin/storage';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { type Product, type PurchasedProductEntry, type ProfileData } from '@/types';

// (Aquí va todo tu código existente para las acciones de usuario, desde getUserProfileRoleAction hasta createStripeLoginLinkAction)
// ...

// ========================================================================
// ---> INICIO: NUEVA FUNCIÓN PARA EL SITEMAP
// ========================================================================

export async function getAllPublicSellersForSitemap(): Promise<{ username: string, updatedAt: admin.firestore.Timestamp | null }[]> {
    try {
        const profilesQuery = await adminDb.collection('profiles')
            .where('role', '==', 'seller')
            .where('username', '!=', null)
            .select('username', 'updatedAt') // Optimizamos la consulta
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