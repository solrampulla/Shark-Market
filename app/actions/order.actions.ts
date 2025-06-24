// --- ARCHIVO CORREGIDO: app/actions/order.actions.ts ---
'use server';

import { adminDb } from "@/lib/firebaseAdmin";
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { type ProfileData } from '@/types';
import { FieldValue } from "firebase-admin/firestore";

export async function createOrderAction(
    buyerUserId: string, 
    productId: string, 
    productName: string, 
    price: number, 
    currency: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    
    if (!buyerUserId || !productId) return { success: false, error: 'Faltan datos de usuario o producto.' };

    try {
        // Obtenemos el producto para saber quién es el vendedor
        const productRef = adminDb.collection('products').doc(productId);
        const productSnap = await productRef.get();
        if (!productSnap.exists) throw new Error("El producto que intentas comprar no existe.");

        const sellerId = productSnap.data()!.sellerId;
        if (!sellerId) throw new Error("Este producto no tiene un vendedor asociado.");

        // Obtenemos el perfil del vendedor para conseguir su ID de cuenta de Stripe
        const profileRef = adminDb.collection('profiles').doc(sellerId);
        const profileSnap = await profileRef.get();
        if (!profileSnap.exists) throw new Error("El perfil del vendedor no fue encontrado.");

        const stripeAccountId = (profileSnap.data() as ProfileData).stripeAccountId;
        if (!stripeAccountId) {
            throw new Error("Este vendedor aún no ha configurado sus pagos.");
        }
        
        // Calculamos nuestra comisión (ej. 20%)
        const applicationFeeAmount = Math.round(price * 100 * 0.20);

        // Creamos una orden preliminar en nuestra base de datos
        const orderRef = adminDb.collection('orders').doc();
        await orderRef.set({
            buyerUserId,
            sellerId,
            productId,
            status: 'pending',
            amount: price,
            currency: currency,
            createdAt: FieldValue.serverTimestamp(),
        });
        
        const origin = headers().get('origin') || 'http://localhost:3000';
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: { name: productName },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: stripeAccountId,
                },
            },
            success_url: `${origin}/my-purchases?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/product/${productId}?payment_canceled=true`,
            // ---> CORRECCIÓN: Nos aseguramos de enviar todos los IDs que el webhook necesita
            metadata: { 
                orderId: orderRef.id,
                buyerUserId: buyerUserId, 
                productId: productId 
            },
        });

        if (!session.id) { throw new Error("No se pudo crear la sesión de Stripe."); }
        return { success: true, sessionId: session.id };

    } catch (error: any) {
        console.error('[Action] Error en createOrderAction:', error);
        return { success: false, error: error.message || 'Error en el servidor al procesar el pago.' };
    }
}