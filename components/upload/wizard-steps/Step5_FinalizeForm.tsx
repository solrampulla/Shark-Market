// --- ARCHIVO ACTUALIZADO: components/upload/wizard-steps/Step5_FinalizeForm.tsx ---
// CAMBIO: Se lista los archivos y se añade la funcionalidad de eliminarlos.
'use client';

import React from 'react';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';

interface Step5Props {
  executiveSummary: string;
  onSummaryChange: (value: string) => void;
  files: File[];
  onFilesChange: (files: FileList | null) => void;
  onFileRemove: (fileName: string) => void; // Nueva prop para eliminar archivos
}

export default function Step5_FinalizeForm({
  executiveSummary,
  onSummaryChange,
  files,
  onFilesChange,
  onFileRemove,
}: Step5Props) {
  
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";
  const subTextStyle = "mt-1 text-xs text-slate-500";

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="executiveSummary" className={labelStyle}>Resumen Ejecutivo (Editable)</label>
        <p className={subTextStyle + " mb-2"}>Hemos generado un borrador basado en tus respuestas. Siéntete libre de editarlo para darle tu toque final.</p>
        <textarea id="executiveSummary" value={executiveSummary} onChange={(e) => onSummaryChange(e.target.value)} rows={6} className="block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm" />
      </div>

      <div>
        <label className={labelStyle}>Archivos Adicionales del Producto *</label>
        <p className={subTextStyle + " mb-3"}>Sube aquí los documentos que recibirá el comprador (PDF, hojas de cálculo, etc.).</p>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
            <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-300" />
                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label htmlFor="productFiles" className="relative cursor-pointer rounded-md bg-white font-semibold text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:text-accent-hover">
                        <span>Añadir archivos</span>
                        <input id="productFiles" name="productFiles" type="file" className="sr-only" multiple onChange={(e) => onFilesChange(e.target.files)} />
                    </label>
                </div>
                <p className="text-xs leading-5 text-slate-500">Puedes añadir varios archivos.</p>
            </div>
        </div>
        {/* ---> NUEVO: Lista de archivos subidos con opción de borrar */}
        {files.length > 0 && (
            <div className="mt-4 border-t pt-4">
                <p className="font-semibold text-sm">Archivos adjuntos:</p>
                <ul className="mt-2 space-y-2">
                    {files.map(file => (
                        <li key={file.name} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-md border">
                            <div className="flex items-center gap-2">
                                <FileIcon className="w-4 h-4 text-slate-500" />
                                <span className="font-medium text-slate-700">{file.name}</span>
                                <span className="text-slate-400">({ (file.size / 1024).toFixed(1) } KB)</span>
                            </div>
                            <button type="button" onClick={() => onFileRemove(file.name)} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100">
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
}