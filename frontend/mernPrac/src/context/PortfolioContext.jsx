// src/context/PortfolioContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const initialData = {
  basic: { name: '', title: '', bio: '', photo: '' },
  contact: { email: '', github: '', linkedin: '' },
  skills: [],
  projects: [{ title: '', description: '', link: '' }],
  experience: [{ company: '', role: '', duration: '', description: '' }],
  education: [{ institute: '', degree: '', year: '' }],
};

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolioDraft');
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
    } catch {
      return initialData;
    }
  });

  // Auto-save the draft in the browser
  useEffect(() => {
    try {
      localStorage.setItem('portfolioDraft', JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const updateSection = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const resetDraft = () => {
    localStorage.removeItem('portfolioDraft');
    setData(initialData);
  };

  return (
    <PortfolioContext.Provider value={{ data, updateSection, resetDraft }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);