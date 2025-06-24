// --- ARCHIVO CORREGIDO: app/api/stripe/webhook/route.ts ---
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebaseAdmin'; 
import { FieldValue } from "firebase-admin/firestore"; 
import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: "Firma de Stripe no encontrada." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error de verificación de firma: ${err.message}`);
    return NextResponse.json({ error: `Error de Webhook: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // ---> CORRECCIÓN: Leemos los metadatos con los nombres correctos
    const orderId = session.metadata?.orderId;
    const buyerUserId = session.metadata?.buyerUserId;
    const productId = session.metadata?.productId;
    
    if (orderId && buyerUserId && productId && session.payment_status === 'paid') {
      try {
        const orderDocRef = adminDb.collection("orders").doc(orderId);
        const orderSnap = await orderDocRef.get();

        if (orderSnap.exists && orderSnap.data()?.status !== 'succeeded') {
            await orderDocRef.update({ 
                status: 'succeeded', 
                stripePaymentIntentId: session.payment_intent,
                updatedAt: FieldValue.serverTimestamp() 
            });

            const accessDocRef = adminDb.collection("user_product_access").doc();
            await accessDocRef.set({
                userId: buyerUserId, // Usamos el ID del comprador
                productId: productId,
                orderId: orderId, 
                grantedAt: FieldValue.serverTimestamp(),
            });
            console.log(`✅ Registro de acceso creado para el usuario ${buyerUserId}`);
        }
      } catch (dbError: any) {
        console.error(`❌ ERROR DE BASE DE DATOS: ${dbError.message}`);
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}