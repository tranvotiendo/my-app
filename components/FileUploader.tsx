import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';

interface ImageFileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageFileUploader: React.FC<ImageFileUploaderProps> = ({ onFilesSelected }) => {
  const { t } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesSelected]);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 cursor-pointer
        ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-100/50 dark:bg-slate-800/50'
        }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-slate-500 dark:text-slate-400">
        <UploadIcon className="w-12 h-12" />
        <p className="text-lg font-semibold">
          <span className="text-indigo-600 dark:text-indigo-400">{t('uploader.clickToUpload')}</span> {t('uploader.orDragAndDrop')}
        </p>
        <p className="text-sm">{t('imageToPdf.fileTypes')}</p>
      </div>
    </div>
  );
};

export default ImageFileUploader;