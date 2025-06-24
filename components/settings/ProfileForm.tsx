// ========================================================================
// ARCHIVO MODIFICADO: components/settings/ProfileForm.tsx
// CAMBIOS: Se añade saneamiento y validación en tiempo real para el username.
// ========================================================================
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { type ProfileData } from './SettingsFormWrapper';
import { toast } from 'sonner';

interface ProfileFormProps {
  profile: ProfileData;
  onSave: (formData: Omit<ProfileData, 'id' | 'email' | 'role' | 'avatar_url'>, newAvatarFile?: File | null) => Promise<void>;
  isSaving: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, isSaving }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile.full_name || '');
    setUsername(profile.username || '');
    setProfessionalTitle(profile.professional_title || '');
    setWebsiteUrl(profile.website_url || '');
    setLinkedinUrl(profile.linkedin_url || '');
    setAvatarPreview(profile.avatar_url || null);
    setAvatarFile(null);
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error("El avatar debe ser menor a 2MB."); return; }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast.error("Tipo de archivo no permitido."); return; }
      
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // ---> NUEVO: Saneamiento del input del username en tiempo real para una mejor UX.
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Convierte a minúsculas, elimina espacios y caracteres no permitidos.
    const sanitizedUsername = value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_-]/g, '');
    setUsername(sanitizedUsername);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) { 
      toast.error('El Nombre Completo no puede estar vacío.');
      return; 
    }
    // ---> NUEVO: Validación de formato y longitud del username antes de enviar.
    if (username && (username.length < 3 || username.length > 20)) {
        toast.error('El nombre de usuario debe tener entre 3 y 20 caracteres.');
        return;
    }

    const formData = { full_name: fullName, username, professional_title: professionalTitle, website_url: websiteUrl, linkedin_url: linkedinUrl };
    await onSave(formData, avatarFile);
  };
  
  const labelStyle = "block text-sm font-semibold text-text-light mb-1";
  const inputStyle = "block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent sm:text-sm bg-white text-text-DEFAULT disabled:bg-slate-50";
  const buttonStyle = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email (no editable) */}
      <div>
        <label htmlFor="settings-email" className={labelStyle}>Email</label>
        <input type="email" id="settings-email" value={profile.email || ''} disabled readOnly className={`${inputStyle} bg-slate-100`}/>
      </div>
      {/* Nombre Completo */}
      <div>
        <label htmlFor="settings-fullName" className={labelStyle}>Nombre Completo</label>
        <input type="text" id="settings-fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSaving} className={inputStyle}/>
      </div>

      {/* --- CAMPO DE USERNAME MEJORADO --- */}
      <div>
        <label htmlFor="settings-username" className={labelStyle}>Nombre de Usuario</label>
        <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">@</span>
            <input 
                type="text" 
                id="settings-username" 
                value={username} 
                onChange={handleUsernameChange} // ---> Usamos el nuevo manejador con saneamiento
                disabled={isSaving} 
                className={`${inputStyle} pl-7`} // ---> Añadimos padding para el '@'
                placeholder="tu-usuario-unico"
            />
        </div>
        {/* ---> NUEVO: Ayuda visual para el usuario */}
        <p className="mt-1 text-xs text-slate-500">Solo minúsculas, números, guiones (-) y guiones bajos (_). De 3 a 20 caracteres.</p>
      </div>

      {/* Titular Profesional */}
      <div>
        <label htmlFor="settings-title" className={labelStyle}>Titular Profesional</label>
        <input type="text" id="settings-title" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} disabled={isSaving} className={inputStyle} placeholder="ej: Consultor Financiero"/>
      </div>

      {/* Sitio Web */}
      <div>
        <label htmlFor="settings-website" className={labelStyle}>Sitio Web</label>
        <input type="url" id="settings-website" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} disabled={isSaving} className={inputStyle} placeholder="https://tu-sitio-web.com"/>
      </div>

      {/* Perfil de LinkedIn */}
      <div>
        <label htmlFor="settings-linkedin" className={labelStyle}>Perfil de LinkedIn</label>
        <input type="url" id="settings-linkedin" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} disabled={isSaving} className={inputStyle} placeholder="https://linkedin.com/in/tu-perfil"/>
      </div>
      
      {/* Selector de Avatar */}
      <div>
        <label htmlFor="settings-avatarFile" className={labelStyle}>Cambiar Avatar (Opcional, Max 2MB)</label>
        <div className="flex items-center gap-x-4">
          {(avatarPreview) && (
            <Image src={avatarPreview} alt="Avatar Preview" width={64} height={64} className="rounded-full object-cover border-2 border-slate-200" />
          )}
          <input type="file" id="settings-avatarFile" accept="image/jpeg, image/png, image/webp" onChange={handleAvatarChange} disabled={isSaving} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"/>
        </div>
      </div>
      
      {/* Botón de Guardar */}
      <div className="pt-4 border-t border-slate-200">
        <button type="submit" disabled={isSaving} className={buttonStyle}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;