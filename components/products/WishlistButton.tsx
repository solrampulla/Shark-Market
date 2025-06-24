// components/products/WishlistButton.tsx
'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { toggleWishlistAction } from '@/app/wishlist/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  // Pasaremos el estado inicial para que el corazón se muestre lleno si ya está en favoritos.
  initialIsWishlisted: boolean;
}

export const WishlistButton = ({ productId, initialIsWishlisted }: WishlistButtonProps) => {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Previene cualquier acción del elemento padre (como la navegación del Link)
    e.stopPropagation();

    const user = auth.currentUser;
    if (!user) {
      toast.info('Debes iniciar sesión para añadir a favoritos.');
      // Opcional: redirigir a login
      // router.push('/login'); 
      return;
    }

    setIsLoading(true);
    
    // Actualización optimista: cambiamos el estado visualmente al instante.
    setIsWishlisted(!isWishlisted);

    const result = await toggleWishlistAction(user.uid, productId);

    if (result.success) {
      toast.success(result.message);
    } else {
      // Si la acción falla, revertimos el cambio visual y mostramos un error.
      setIsWishlisted(isWishlisted); 
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const buttonStyle = `absolute top-2 right-2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait`;
  const iconStyle = `text-2xl ${isWishlisted ? 'text-accent' : 'text-white'}`;

  return (
    <button onClick={handleToggleWishlist} disabled={isLoading} className={buttonStyle} aria-label="Añadir a favoritos">
      {isWishlisted ? (
        <i className={`ri-heart-fill ${iconStyle}`}></i>
      ) : (
        <i className={`ri-heart-line ${iconStyle}`}></i>
      )}
    </button>
  );
};