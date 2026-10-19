
 // src/context/SettingsContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import translations from '../translations';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('websiteTheme') || 'light'
  );

  const [language, setLanguage] = useState(
    () => localStorage.getItem('websiteLanguage') || 'en'
  );
  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('websiteTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('websiteLanguage', language);
  }, [language]);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used inside SettingsProvider'
    );
  }

  return context;
};

export default SettingsContext;
