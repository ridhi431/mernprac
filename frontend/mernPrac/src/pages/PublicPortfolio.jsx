import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PortfolioView from '../components/portfolio/PortfolioView';
import { useSettings } from '../context/SettingsContext';

const PublicPortfolio = () => {
  const { t, language } = useSettings();
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/portfolios/public/${slug}`);
        setP(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio load nahi hua');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (p?.theme) {
      document.documentElement.setAttribute('data-theme', p.theme);
    }
    return () => {
      const saved = localStorage.getItem('websiteTheme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
    };
  }, [p?.theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    const isPrivate = error.toLowerCase().includes('private');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-base-200 text-base-content">
        <div className="card bg-base-100 border border-base-300 max-w-md w-full shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">{isPrivate ? '🔒' : '⚠️'}</div>
          <h2 className="text-2xl font-bold mb-2">
            {isPrivate ? (language === 'hi' ? 'निजी पोर्टफोलियो' : 'Private Portfolio') : (language === 'hi' ? 'पोर्टफोलियो नहीं मिला' : 'Portfolio Not Found')}
          </h2>
          <p className="opacity-70 text-sm mb-6">{error}</p>
          <div className="flex justify-center gap-3">
            <Link to="/" className="btn btn-primary btn-sm">
              {t.home}
            </Link>
            {isPrivate && (
              <Link to="/login" className="btn btn-outline btn-sm">
                {language === 'hi' ? 'निर्माता के रूप में लॉग इन करें' : 'Login as Creator'}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Skills agar objects ({name}) mein aaye to strings mein convert karo
  const data = {
    ...p,
    skills: (p.skills || [])
      .map((s) => (typeof s === 'string' ? s : s?.name))
      .filter(Boolean),
  };

  return (
    <>
      {!p.isPublic && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-neutral/90 text-neutral-content px-4 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-neutral-content/20 backdrop-blur">
          <span>🔒 {t.privateMode}</span>
          <span className="opacity-70">{t.privateDescription}</span>
        </div>
      )}
      <PortfolioView data={data} theme={p.theme} />
    </>
  );
};

export default PublicPortfolio;
