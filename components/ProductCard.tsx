// components/ProductCard.tsx (Añadidos botones Edit/Delete opcionales)
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  // Props existentes
  image_url?: string | null;
  title: string;
  price: number;
  type: string | null;
  type_icon?: string | null;
  altText?: string;
  detailUrl: string;
  // Nuevas props opcionales para acciones
  productId?: string; // Pasamos el ID para los handlers
  onEdit?: (id: string) => void; // Función para llamar al editar
  onDelete?: (id: string) => void; // Función para llamar al borrar
}

const ProductCard: React.FC<ProductCardProps> = ({
  image_url,
  title,
  price,
  type,
  type_icon,
  altText = 'Product image',
  detailUrl,
  productId, // Recibimos el ID
  onEdit,   // Recibimos la función de editar
  onDelete  // Recibimos la función de borrar
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
      {/* Imagen (sin cambios) */}
      <div className="h-48 overflow-hidden relative">
        <Image src={image_url || '/placeholder.png'} alt={altText} fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="transition duration-300 group-hover:scale-105" />
      </div>

      {/* Contenido Principal (sin cambios) */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            <Link href={detailUrl} className="hover:text-primary transition line-clamp-2">{title}</Link>
          </h3>
          <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded text-sm whitespace-nowrap ml-2 flex-shrink-0">${price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-500 text-sm">
            <i className={`${type_icon || 'ri-file-line'} mr-1`}></i> {type || 'General'}
          </div>
          {/* Ya no ponemos el botón "Buy Now" aquí, lo reemplazamos si hay acciones */}
        </div>

         {/* --- INICIO: Botones Edit/Delete Condicionales --- */}
         {(onEdit || onDelete) && productId && (
            <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(productId)}
                        className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-button hover:bg-yellow-600 transition"
                        aria-label={`Edit ${title}`}
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(productId)}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-button hover:bg-red-600 transition"
                        aria-label={`Delete ${title}`}
                    >
                        Delete
                    </button>
                )}
            </div>
         )}
         {/* --- FIN: Botones Edit/Delete Condicionales --- */}

      </div>
    </div>
  );
};

export default ProductCard;