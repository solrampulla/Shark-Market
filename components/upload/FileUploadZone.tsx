// Contenido CORREGIDO para: components/upload/FileUploadZone.tsx
'use client';
    
import React, { useState, useCallback, useRef } from 'react';

// AÑADIMOS la nueva prop 'singleFile' para que el componente sepa si debe ser de subida única o múltiple
interface FileUploadZoneProps {
    onFileChange: (files: File[]) => void;
    singleFile?: boolean; // Hacemos la prop opcional
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileChange, singleFile = false }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
        else if (e.type === "dragleave") setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange(Array.from(e.dataTransfer.files));
        }
    }, [onFileChange]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(Array.from(e.target.files));
        }
    };

    return (
        <div
            onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
        >
            {/* USAMOS la prop 'singleFile' para decidir si el input es múltiple o no */}
            <input 
              ref={inputRef} 
              type="file" 
              multiple={!singleFile} 
              className="hidden" 
              onChange={handleChange} 
              // Para la imagen de portada, solo aceptamos imágenes
              accept={singleFile ? "image/*" : ".pdf,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx"} 
            />
            <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path></svg>
                <p className="mt-2 text-sm text-slate-500"><span className="font-semibold text-blue-600">Haz clic para subir</span> o arrastra y suelta.</p>
                <p className="text-xs text-slate-400 mt-1">{singleFile ? "Sube una imagen (JPG, PNG, etc.)" : "PDF, ZIP, DOCX, etc."}</p>
            </div>
        </div>
    );
};

export default FileUploadZone;