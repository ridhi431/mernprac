import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { language } = useSettings();
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content">
      <p>© 2026 DevFolio. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}</p>
    </footer>
  );
};

export default Footer;
