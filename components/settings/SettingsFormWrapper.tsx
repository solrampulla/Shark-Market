// --- ARCHIVO FINAL Y DEFINITIVO: components/settings/SettingsFormWrapper.tsx ---
// CORRECCIÓN: La comprobación del rol ahora es insensible a mayúsculas y más segura.
'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import ProfileForm from './ProfileForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { type ProfileData } from '@/types';
import StripeConnectManager from './StripeConnectManager';

// Importamos las acciones desde la ubicación unificada y correcta
import { 
    generateAvatarUploadUrlAction, 
    updateProfileMetadataAction 
} from '@/app/actions/user.actions';

export default function SettingsFormWrapper() { 
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                setCurrentUser(userAuth);
                const profileDocRef = doc(db, "profiles", userAuth.uid);
                const profileSnap = await getDoc(profileDocRef);
                if (profileSnap.exists()) {
                    setProfileData({ id: profileSnap.id, ...profileSnap.data() } as ProfileData);
                }
            } else {
                setCurrentUser(null);
                setProfileData(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSaveProfile = async (
        formData: Omit<ProfileData, 'id' | 'email' | 'role' | 'avatar_url' | 'stripeAccountId'>,
        newAvatarFile?: File | null
    ): Promise<void> => {
        setIsSaving(true);
        if (!currentUser) {
            toast.error("Debes iniciar sesión para guardar cambios.");
            setIsSaving(false);
            return;
        }

        let avatarStoragePath: string | null = null;
        try {
            if (newAvatarFile) {
                const signedUrlResult = await generateAvatarUploadUrlAction(currentUser.uid, newAvatarFile.name, newAvatarFile.type);
                if (!signedUrlResult.success || !signedUrlResult.uploadUrl) throw new Error(signedUrlResult.message);
                
                const uploadResponse = await fetch(signedUrlResult.uploadUrl, { method: 'PUT', headers: { 'Content-Type': newAvatarFile.type }, body: newAvatarFile });
                if (!uploadResponse.ok) throw new Error('Error al subir el nuevo avatar.');
                
                avatarStoragePath = signedUrlResult.filePath!;
            }

            const metadataResult = await updateProfileMetadataAction(currentUser.uid, formData, avatarStoragePath);
            if (!metadataResult.success) throw new Error(metadataResult.message);

            toast.success(metadataResult.message);
            setProfileData(prev => ({ ...prev, ...formData, ...(metadataResult.newAvatarUrl && { avatar_url: metadataResult.newAvatarUrl }) } as ProfileData));
            router.refresh();

        } catch (error: any) {
            toast.error(error.message || 'Ocurrió un error inesperado al guardar.');
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="text-center p-4"><p className="animate-pulse text-slate-500">Cargando tu perfil...</p></div>;
    }
    if (!currentUser || !profileData) { 
        return <div className="p-6 text-center bg-orange-100 border-l-4 border-orange-500 text-orange-700 rounded-md"><p className="font-bold">Acceso Requerido</p><p>Debes iniciar sesión para acceder a esta página.</p></div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Información del Perfil</h2>
                <ProfileForm
                    profile={profileData} 
                    onSave={handleSaveProfile}
                    isSaving={isSaving}
                />
            </div>

            {/* ---> CORRECCIÓN: Hacemos la comprobación más segura y no sensible a mayúsculas */}
            {profileData?.role?.toLowerCase() === 'seller' && (
                <StripeConnectManager profile={profileData} />
            )}
        </div>
    );
}