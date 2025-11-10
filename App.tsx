import React, { useState, useEffect } from 'react';
import ImageToPdfConverter from './pages/ImageToPdfConverter';
import PdfToLatexConverter from './pages/PdfToLatexConverter';
import LatexSolver from './pages/LatexSolver';
import { useAppContext } from './contexts/AppContext';
// Fix: Import `DocumentIcon` to resolve reference error.
import { SunIcon, MoonIcon, GlobeIcon, WandIcon, PdfIcon, DocumentIcon } from './components/icons';
import { FaFileImage } from 'react-icons/fa';

type Tab = 'image-to-pdf' | 'pdf-to-latex' | 'latex-solver';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image-to-pdf');
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();
  
  useEffect(() => {
    document.body.className = theme === 'light' 
      ? 'animated-gradient-light' 
      : 'animated-gradient-dark';
  }, [theme]);

  const TabButton: React.FC<{ tabId: Tab; children: React.ReactNode; icon: React.ReactNode }> = ({ tabId, children, icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 ${
        activeTab === tabId
          ? 'bg-indigo-600 text-white shadow-lg scale-105'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
      }`}
      aria-pressed={activeTab === tabId}
      role="tab"
      aria-controls={`tabpanel-${tabId}`}
      id={`tab-${tabId}`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <header className="py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {t('header.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('header.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
                <GlobeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
                    className="pl-9 pr-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-800 dark:text-slate-200"
                    aria-label="Select language"
                >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                </select>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={t(theme === 'dark' ? 'header.switchToLight' : 'header.switchToDark')}
            >
              {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8 p-1.5 bg-white/50 dark:bg-slate-800/50 rounded-xl shadow-inner backdrop-blur-sm gap-2" role="tablist" aria-label="Converter type">
            <TabButton tabId="image-to-pdf" icon={<PdfIcon className="w-5 h-5"/>}>{t('tabs.imageToPdf')}</TabButton>
            <TabButton tabId="pdf-to-latex" icon={<DocumentIcon className="w-5 h-5"/>}>{t('tabs.pdfToLatex')}</TabButton>
            <TabButton tabId="latex-solver" icon={<WandIcon className="w-5 h-5"/>}>{t('tabs.latexSolver')}</TabButton>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8">
            <div role="tabpanel" id="tabpanel-image-to-pdf" aria-labelledby="tab-image-to-pdf" hidden={activeTab !== 'image-to-pdf'}>
              {activeTab === 'image-to-pdf' && <ImageToPdfConverter />}
            </div>
            <div role="tabpanel" id="tabpanel-pdf-to-latex" aria-labelledby="tab-pdf-to-latex" hidden={activeTab !== 'pdf-to-latex'}>
               {activeTab === 'pdf-to-latex' && <PdfToLatexConverter />}
            </div>
             <div role="tabpanel" id="tabpanel-latex-solver" aria-labelledby="tab-latex-solver" hidden={activeTab !== 'latex-solver'}>
               {activeTab === 'latex-solver' && <LatexSolver />}
            </div>
          </div>
        </div>
      </main>
       <footer className="text-center py-6 text-slate-800 dark:text-slate-200 text-sm font-semibold">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default App;