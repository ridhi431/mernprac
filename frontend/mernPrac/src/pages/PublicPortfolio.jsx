import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// Path apne project ke hisaab se adjust karo
import PortfolioView from '../components/portfolio/PortfolioView';

const PublicPortfolio = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">{error}</div>
      </div>
    );
  }

  // Skills agar objects ({name}) mein aaye to strings mein convert karo,
  // kyunki PortfolioView skills ko string maan ke render karta hai
  const data = {
    ...p,
    skills: (p.skills || [])
      .map((s) => (typeof s === 'string' ? s : s?.name))
      .filter(Boolean),
  };

  return <PortfolioView data={data} theme={p.theme} />;
};

export default PublicPortfolio;