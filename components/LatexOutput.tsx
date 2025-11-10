import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';
import { CopyIcon, CheckIcon, DownloadIcon, ExclamationIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';

interface LatexOutputProps {
  latexCode: string;
  isLoading: boolean;
  error: string | null;
}

export const LatexOutput: React.FC<LatexOutputProps> = ({ latexCode, isLoading, error }) => {
  const { t } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    if (latexCode) {
      navigator.clipboard.writeText(latexCode);
      setIsCopied(true);
    }
  };

  const handleDownload = () => {
    if (latexCode) {
      const blob = new Blob([latexCode], { type: 'text/x-latex' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study-guide.tex';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const hasContent = !isLoading && !error && latexCode;

  return (
    <div className="relative w-full min-h-[16rem] h-full bg-slate-100/50 dark:bg-slate-800/50 rounded-lg flex flex-col border border-slate-200 dark:border-slate-700">
      {hasContent && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            title={isCopied ? t('latexOutput.copied') : t('latexOutput.copy')}
          >
            {isCopied ? <CheckIcon className="h-5 w-5 text-indigo-500" /> : <CopyIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-md bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
            title={t('latexOutput.download')}
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-grow p-4 overflow-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <Loader />
            <p className="mt-4">{t('latexOutput.generating')}</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-500 dark:text-red-400 text-center">
            <ExclamationIcon className="h-12 w-12" />
            <p className="mt-4 font-semibold">{t('latexOutput.errorTitle')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{error}</p>
          </div>
        )}
        {!isLoading && !error && !latexCode && (
           <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
             <p>{t('latexOutput.placeholder')}</p>
           </div>
        )}
        {latexCode && (
          <pre className="text-sm whitespace-pre-wrap"><code className="language-latex text-slate-700 dark:text-slate-300">{latexCode}</code></pre>
        )}
      </div>
    </div>
  );
};