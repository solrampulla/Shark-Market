// --- ARCHIVO ACTUALIZADO: components/Header.tsx ---
// CAMBIO: Se actualiza el nombre de la marca a "Shark Market".
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'sonner';

interface Profile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
}

const Header = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    const fetchProfile = async (userId: string): Promise<Profile | null> => {
      if (!userId) return null; 
      try { 
        const profileDocRef = doc(db, "profiles", userId); 
        const profileSnap = await getDoc(profileDocRef); 
        if (profileSnap.exists()) { 
          return { id: profileSnap.id, ...profileSnap.data() } as Profile; 
        } else { 
          return null; 
        } 
      } catch (error) { 
        console.error("Header: Error al obtener perfil:", error); 
        return null; 
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userProfile = await fetchProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setIsDropdownOpen(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false); 
    setLoading(true); 
    try { 
      await signOut(auth); 
      toast.success("Has cerrado sesión."); 
      router.push('/'); 
      router.refresh(); 
    } catch (error: any) { 
      toast.error(error.message || "Error al cerrar sesión.");
      console.error("Header: Error en signOut:", error); 
      setLoading(false); 
    }
  };
  
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 h-[60px] border-b border-slate-200">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-x-4">
        
        <div className="flex items-center gap-x-3">
          <Link href="/" className="flex items-center gap-x-3">
            <div className="w-8 h-8 border-2 border-slate-900 rounded-md"></div>
            {/* ---> CORRECCIÓN: Se actualiza el nombre de la marca. */}
            <span className="text-xl font-semibold text-slate-800">
              Shark Market
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-x-4">
          {isClient && (
            <>
              {loading ? ( <div className="w-24 h-8 bg-slate-200 rounded-md animate-pulse"></div> ) 
              : user ? (
                <>
                  {profile?.role?.toLowerCase() === 'seller' && (
                    <Link href="/upload" className="px-4 py-2 bg-accent text-white font-medium rounded-md whitespace-nowrap hover:bg-accent-hover transition hidden sm:flex items-center text-sm">
                       Vender
                    </Link>
                  )}
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleDropdown} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent hover:border-accent" aria-label="User menu" aria-expanded={isDropdownOpen}>
                      {profile?.avatar_url || user.photoURL ? ( <Image src={profile?.avatar_url || user.photoURL!} alt="Profile" width={40} height={40} className="w-full h-full object-cover" /> ) : profile?.full_name ? ( <span className="font-semibold text-accent">{profile.full_name[0].toUpperCase()}</span> ) : user.email ? ( <span className="font-semibold text-accent">{(user.email)[0].toUpperCase()}</span> ) : ( <span>?</span> )}
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-medium text-gray-900 truncate" title={profile?.full_name || user.displayName || user.email || ''}>{profile?.full_name || user.displayName || user.email || 'Usuario'}</p>
                            <p className="text-xs text-gray-500 capitalize">{profile?.role?.toLowerCase().replace('_', ' ') || 'Rol no definido'}</p>
                          </div>
                          <ul className="text-sm text-gray-700 py-1">
                            {profile?.role?.toLowerCase() === 'seller' && ( <li className="sm:hidden"> <Link href="/upload" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-100">Subir Producto</Link> </li> )}
                            <li><Link href="/my-purchases" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-100">Mis Compras</Link></li>
                            <li><Link href="/my-wishlist" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-100">Mis Favoritos</Link></li>
                            {profile?.role?.toLowerCase() === 'seller' && (<li><Link href="/my-products" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-100">Mis Productos</Link></li>)}
                            <li><Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 hover:bg-gray-100">Configuración</Link></li>
                            <li className="border-t mt-1 pt-1"><button onClick={handleLogout} disabled={loading} className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 disabled:opacity-50">Cerrar Sesión</button></li>
                          </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-slate-800 hover:text-accent transition">
                    Log In
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md whitespace-nowrap hover:bg-accent-hover transition">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;