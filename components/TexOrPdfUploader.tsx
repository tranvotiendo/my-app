import React, { useCallback, useState } from 'react';
import { UploadIcon, DocumentIcon, XCircleIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';

interface TexOrPdfUploaderProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export const TexOrPdfUploader: React.FC<TexOrPdfUploaderProps> = ({ onFileSelect, file }) => {
  const { t } = useAppContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const acceptedTypes = ['application/pdf', 'text/x-latex', 'application/x-tex'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    } else {
      onFileSelect(null);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      if (acceptedTypes.includes(files[0].type)) {
        onFileSelect(files[0]);
      }
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);
  
  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onFileSelect(null);
    const fileInput = document.getElementById('tex-pdf-file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div className="w-full">
      <label
        htmlFor="tex-pdf-file-upload"
        className={`relative flex flex-col items-center justify-center w-full min-h-[16rem] h-full border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragOver 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700' 
            : 'border-slate-300 dark:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <div className="text-center p-4">
            <DocumentIcon className="mx-auto h-12 w-12 text-indigo-500 dark:text-indigo-400" />
            <p className="mt-2 font-semibold text-slate-700 dark:text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
            <button 
              onClick={handleRemoveFile}
              className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label={t('uploader.removeFile')}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t('uploader.clickToUpload')}</span> {t('uploader.orDragAndDrop')}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('latexSolver.fileTypes')}</p>
          </div>
        )}
      </label>
      <input id="tex-pdf-file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.tex" onChange={handleFileChange} />
    </div>
  );
};