// Contenido para: components/forms/FilePreview.tsx
'use client';

import React from 'react';

const FilePreview = ({ file, onRemove }: { file: File, onRemove: () => void }) => {
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md border border-slate-200">
            <div className="flex items-center space-x-2 overflow-hidden">
                <svg className="h-6 w-6 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-800 truncate">{file.name}</span>
                    <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
                </div>
            </div>
            <button type="button" onClick={onRemove} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
        </div>
    );
};

export default FilePreview;