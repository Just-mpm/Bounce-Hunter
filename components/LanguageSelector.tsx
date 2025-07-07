
import React from 'react';
import { useI18n } from '../i18n';

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const baseClasses = "px-5 py-2 font-bold rounded-md transition-colors duration-200 text-sm sm:text-base";
  const activeClasses = "bg-cyan-500 text-slate-900";
  const inactiveClasses = "bg-slate-700 text-white hover:bg-slate-600";

  return (
    <div className="flex items-center justify-center p-1 bg-slate-800 rounded-lg">
      <button 
        onClick={() => setLocale('pt')}
        className={`${baseClasses} ${locale === 'pt' ? activeClasses : inactiveClasses}`}
      >
        Português
      </button>
      <button 
        onClick={() => setLocale('en')}
        className={`${baseClasses} ${locale === 'en' ? activeClasses : inactiveClasses}`}
      >
        English
      </button>
    </div>
  );
};

export default React.memo(LanguageSelector);
