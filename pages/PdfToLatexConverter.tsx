import React, { useState, useCallback } from 'react';
import { PdfFileUploader } from '../components/PdfFileUploader';
import { LatexOutput } from '../components/LatexOutput';
import { convertPdfToLatex } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';

const PdfToLatexConverter: React.FC = () => {
  const { t, language } = useAppContext();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [latexCode, setLatexCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    setPdfFile(file);
    setLatexCode('');
    setError(null);
  }, []);

  const handleConvert = async () => {
    if (!pdfFile) {
      setError(t('pdfToLatex.errorSelectFile'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setLatexCode('');

    try {
      const result = await convertPdfToLatex(pdfFile, language);
      setLatexCode(result);
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : t('pdfToLatex.errorUnknown');
      setError(`${t('pdfToLatex.errorConversionFailed')} ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-semibold">{t('pdfToLatex.step1Title')}</h2>
        <PdfFileUploader onFileSelect={handleFileSelect} file={pdfFile} />
        <button
          onClick={handleConvert}
          disabled={!pdfFile || isLoading}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('pdfToLatex.buttonConverting') : t('pdfToLatex.buttonConvert')}
        </button>
      </div>
      
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-semibold">{t('pdfToLatex.step2Title')}</h2>
        <LatexOutput
          latexCode={latexCode}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default PdfToLatexConverter;