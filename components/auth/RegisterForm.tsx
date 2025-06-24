// File: components/auth/RegisterForm.tsx (Versión Mejorada)
"use client"; 

import React, { useState, useEffect } from 'react';
// ... (el resto de tus imports se mantienen igual)
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RegisterFormProps {
  initialRole?: 'BUYER' | 'SELLER';
}

function RegisterForm({ initialRole }: RegisterFormProps) { 
  // ... (toda la lógica de estados y handleSubmit se mantiene exactamente igual)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER'>(initialRole || 'BUYER'); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "profiles", user.uid), {
        email: user.email,
        role: selectedRole,
        createdAt: new Date().toISOString(),
      });
      
      toast.success('¡Registro exitoso! Serás redirigido a la página principal.');
      
      setTimeout(() => {
        router.push('/'); 
      }, 2000);

    } catch (firebaseError: any) {
      let errorMessage = 'Ocurrió un error durante el registro.';
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "block text-sm font-semibold text-text-light mb-1";
  const inputStyle = "block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent sm:text-sm bg-white text-text-DEFAULT disabled:bg-slate-50";
  const buttonStyle = "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="emailReg" className={labelStyle}>Correo Electrónico:</label>
        <input 
          type="email" 
          id="emailReg" 
          name="emailReg"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          disabled={loading}
          className={inputStyle}
          placeholder="tu@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="passwordReg" className={labelStyle}>Contraseña (mín. 6 caracteres):</label>
        <input 
          type="password" 
          id="passwordReg" 
          name="passwordReg"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6}
          disabled={loading}
          className={inputStyle}
          placeholder="••••••••"
        />
      </div>

      {!initialRole && ( 
        <div>
          <label className={labelStyle}>Quiero registrarme como:</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {(['BUYER', 'SELLER'] as const).map((role) => (
              <div key={role}>
                <input 
                  type="radio" 
                  id={`role${role}`} 
                  name="roleReg" 
                  value={role} 
                  checked={selectedRole === role} 
                  onChange={(e) => setSelectedRole(e.target.value as 'BUYER' | 'SELLER')}
                  disabled={loading}
                  className="sr-only peer"
                />
                {/* ---> CAMBIO: Añadido bg-white y hover:bg-slate-50 para el estado inactivo */}
                <label 
                  htmlFor={`role${role}`} 
                  className="block w-full text-center px-4 py-3 border border-slate-300 rounded-lg cursor-pointer transition-colors bg-white hover:bg-slate-50 text-text-DEFAULT peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent"
                >
                  {role === 'BUYER' ? 'Comprador' : 'Vendedor'}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        disabled={loading}
        className={buttonStyle}
      >
        {loading ? 'Registrando...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}

export default RegisterForm;