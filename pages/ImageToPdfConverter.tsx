import React, { useState, useEffect, useCallback } from 'react';
import { ImageFile } from '../types';
import ImageFileUploader from '../components/FileUploader';
import { CloseIcon, TrashIcon, PdfIcon } from '../components/icons';
import { useAppContext } from '../contexts/AppContext';

// To inform TypeScript about the jsPDF library from the CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

const ImageCard: React.FC<{ image: ImageFile; onRemove: (id: string) => void }> = ({ image, onRemove }) => (
    <div className="relative group bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden aspect-square border border-slate-200 dark:border-slate-700">
        <img
            src={image.previewUrl}
            alt={image.file.name}
            className="w-full h-full object-contain p-2"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={() => onRemove(image.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
                aria-label="Remove image"
            >
                <CloseIcon className="w-5 h-5" />
            </button>
            <p className="text-white text-center text-xs p-2 break-all opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-0 bg-black bg-opacity-60 w-full">
                {image.file.name}
            </p>
        </div>
    </div>
);


const Loader: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    <p className="text-white text-xl mt-4">{message}</p>
  </div>
);

const ImageToPdfConverter: React.FC = () => {
  const { t } = useAppContext();
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');

  useEffect(() => {
    return () => {
      imageFiles.forEach(imageFile => URL.revokeObjectURL(imageFile.previewUrl));
    };
  }, [imageFiles]);

  const addFiles = useCallback((newFiles: File[]) => {
    const supportedFiles = newFiles.filter(
      file => file.type === 'image/png' || file.type === 'image/webp'
    );
    const newImageFiles: ImageFile[] = supportedFiles.map(file => ({
      id: crypto.randomUUID(),
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImageFiles(prev => [...prev, ...newImageFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setImageFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearAllFiles = useCallback(() => {
    imageFiles.forEach(imageFile => URL.revokeObjectURL(imageFile.previewUrl));
    setImageFiles([]);
  }, [imageFiles]);
  
  const generatePdf = async () => {
    if (imageFiles.length === 0) return;
    setIsLoading(true);

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      for (let i = 0; i < imageFiles.length; i++) {
        if (i > 0) {
          doc.addPage();
        }
        
        const imageFile = imageFiles[i];
        const img = new Image();
        img.src = imageFile.previewUrl;
        
        await new Promise(resolve => {
          img.onload = resolve;
        });

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const aspectRatio = imgWidth / imgHeight;

        let finalWidth = pageWidth - margin * 2;
        let finalHeight = finalWidth / aspectRatio;

        if (finalHeight > pageHeight - margin * 2) {
          finalHeight = pageHeight - margin * 2;
          finalWidth = finalHeight * aspectRatio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        
        const format = imageFile.file.type === 'image/webp' ? 'WEBP' : 'PNG';
        doc.addImage(img, format, x, y, finalWidth, finalHeight);
      }
      
      doc.save('converted-images.pdf');
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert(t('imageToPdf.errorAlert'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {isLoading && <Loader message={t('imageToPdf.loaderMessage')} />}
      
      <ImageFileUploader onFilesSelected={addFiles} />

      {imageFiles.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4 text-center">{t('imageToPdf.previewTitle')} ({imageFiles.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imageFiles.map(image => (
              <ImageCard key={image.id} image={image} onRemove={removeFile} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                  <label id="orientation-label" className="font-semibold text-sm text-slate-600 dark:text-slate-300">{t('imageToPdf.orientationLabel')}:</label>
                  <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-700/50 rounded-lg" role="group" aria-labelledby="orientation-label">
                      <button
                          onClick={() => setOrientation('p')}
                          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                              orientation === 'p'
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                          aria-pressed={orientation === 'p'}
                      >
                          {t('imageToPdf.portrait')}
                      </button>
                      <button
                          onClick={() => setOrientation('l')}
                          className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                              orientation === 'l'
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                          aria-pressed={orientation === 'l'}
                      >
                          {t('imageToPdf.landscape')}
                      </button>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <button
                      onClick={generatePdf}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                  >
                      <PdfIcon className="w-5 h-5"/>
                      {t('imageToPdf.generateButton')}
                  </button>
                  <button
                      onClick={clearAllFiles}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                  >
                      <TrashIcon className="w-5 h-5"/>
                      {t('imageToPdf.clearButton')}
                  </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfConverter;