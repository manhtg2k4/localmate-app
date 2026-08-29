import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = '@localmate_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi'); // Default to Vietnamese for local user preference

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLang === 'en' || savedLang === 'vi') {
        setLanguageState(savedLang);
      }
    } catch (err) {
      console.error('Error loading language preference:', err);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      console.error('Error saving language preference:', err);
    }
  };

  const t = (key: keyof typeof translations['en']): string => {
    const langDict = translations[language] || translations['vi'];
    return langDict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
