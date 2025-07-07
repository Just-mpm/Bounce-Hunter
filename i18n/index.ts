import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

type Locale = 'en' | 'pt';

const getNestedTranslation = (localeData: any, keys: string[]): string | undefined => {
  let result: any = localeData;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return undefined;
    }
  }
  return result;
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [translations, setTranslations] = useState<any>(null);

  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);
      return (savedLocale === 'en' || savedLocale === 'pt') ? savedLocale : 'pt';
    } catch (error) {
        console.error("Could not access localStorage:", error);
        return 'pt';
    }
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, ptResponse] = await Promise.all([
          fetch('./i18n/locales/en.json'),
          fetch('./i18n/locales/pt.json')
        ]);
        const en = await enResponse.json();
        const pt = await ptResponse.json();
        setTranslations({ en, pt });
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    fetchTranslations();
  }, []);

  const setLocale = (newLocale: Locale) => {
    try {
        localStorage.setItem(STORAGE_KEYS.LOCALE, newLocale);
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
    setLocaleState(newLocale);
  };
  
  const t = (key: string): string => {
    if (!translations) return key;
    const keys = key.split('.');
    
    let result = getNestedTranslation(translations[locale], keys);
    if (result !== undefined) return result;
  
    // Fallback to English if translation is missing in the current locale
    if (locale !== 'en' && translations.en) {
        result = getNestedTranslation(translations.en, keys);
        if (result !== undefined) return result;
    }
    
    // Return the key itself if no translation is found
    return key;
  };
  
  if (!translations) {
    // Show loading state instead of blocking render
    return React.createElement('div', { 
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#0f172a', 
        color: 'white' 
      } 
    }, 'Carregando...');
  }

  return React.createElement(I18nContext.Provider, { value: { locale, setLocale, t } }, children);
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
