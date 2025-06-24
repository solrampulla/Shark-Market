// --- NUEVO ARCHIVO: components/seller/ProfileHeader.tsx ---

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, Linkedin } from 'lucide-react';

// Usamos un tipo parcial porque no todos los campos son obligatorios
interface Profile {
    avatar_url?: string | null;
    full_name?: string | null;
    professional_title?: string | null;
    website_url?: string | null;
    linkedin_url?: string | null;
}

interface ProfileHeaderProps {
    profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-md p-6 md:p-8 w-full">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                    <Image
                        src={profile.avatar_url || '/default-avatar.png'} // Ten una imagen por defecto en public/
                        alt={`Avatar de ${profile.full_name || 'Vendedor'}`}
                        width={128}
                        height={128}
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{profile.full_name || 'Nombre no disponible'}</h1>
                    <p className="text-lg text-accent mt-1">{profile.professional_title || 'Especialista en Founder Market'}</p>
                    
                    {/* Social Links */}
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                        {profile.website_url && (
                            <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors">
                                <Globe className="w-5 h-5" />
                                <span className="sr-only">Sitio Web</span>
                            </Link>
                        )}
                        {profile.linkedin_url && (
                            <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-accent transition-colors">
                                <Linkedin className="w-5 h-5" />
                                <span className="sr-only">Perfil de LinkedIn</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}