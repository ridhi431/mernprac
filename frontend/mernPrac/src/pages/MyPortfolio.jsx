import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/portfolio/portfolio.css'; // adjust path to your project
import { Reveal, completeness, publicUrl } from './PortfolioUtils'; // adjust path
import { useSettings } from '../context/SettingsContext';

/* ---------- portfolio card ---------- */
const PortfolioCard = ({ p, onDelete }) => {
  const { t, language } = useSettings();
  const [copied, setCopied] = useState(false);
  const { percent, hint } = completeness(p);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl(p.slug));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore if clipboard access is blocked */
    }
  };

  return (
    <div className="pf-card card bg-base-200 border border-base-300 h-full">
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="card-title">{p.basic?.name || t.untitledPortfolio}</h3>
            {p.basic?.title && <p className="opacity-70 text-sm">{p.basic.title}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${p.isPublic ? 'badge-success' : 'badge-ghost'}`}>
              {p.isPublic ? t.public : t.private}
            </span>
            {p.theme && <span className="badge badge-outline badge-sm">{p.theme}</span>}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs opacity-70 mb-1">
            <span>{hint ? hint : 'Profile complete 🎉'}</span>
            <span>{percent}%</span>
          </div>
          <progress className="progress progress-primary w-full" value={percent} max="100" />
        </div>

        {p.slug ? (
          <div className="mt-3">
            <div className="flex items-center gap-2 max-w-full">
              <code className="text-xs bg-base-100 border border-base-300 rounded px-2 py-1 truncate flex-1 min-w-0">
                /p/{p.slug}
              </code>
              <button onClick={copy} className="btn btn-ghost btn-xs shrink-0">
                {copied ? t.copied : t.copy}
              </button>
            </div>
            {!p.isPublic && (
              <p className="text-[11px] text-warning mt-1">
                🔒 {t.private} — {language === 'hi' ? 'लॉग इन होने पर केवल आप यह लिंक देख सकते हैं' : 'Only you can view this link when logged in'}
              </p>
            )}
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs opacity-60 mt-2">
          <span>👁 {p.views ?? 0} {t.views}</span>
          {p.updatedAt && <span>{t.updated} {new Date(p.updatedAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US')}</span>}
        </div>

        <div className="card-actions justify-end items-center gap-2 mt-auto pt-3 flex-wrap">
          <button onClick={() => onDelete(p)} className="btn btn-ghost btn-sm text-error">
            {t.delete}
          </button>
          {p.slug && (
            <a href={publicUrl(p.slug)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              {p.isPublic ? (language === 'hi' ? 'खोलें ↗' : 'Open ↗') : (language === 'hi' ? 'देखें (निजी) ↗' : 'View (Private) ↗')}
            </a>
          )}
          <Link to={`/portfolio/edit/${p._id}`} className="btn btn-primary btn-sm">
            {t.edit}
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------- main ---------- */
const MyPortfolios = () => {
  const { t } = useSettings();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/portfolios');
        setList(Array.isArray(res.data) ? res.data : res.data.portfolios || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load portfolios');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/portfolios/${toDelete._id}`);
      setList((prev) => prev.filter((x) => x._id !== toDelete._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete portfolio');
    } finally {
      setToDelete(null);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-base-100 overflow-hidden">
      <div className="pf-blob bg-primary w-72 h-72 -top-16 -left-16 pointer-events-none" />
      <div className="pf-blob bg-secondary w-80 h-80 bottom-0 -right-20 pointer-events-none" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 space-y-6 sm:space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="pf-gradient-text text-3xl sm:text-5xl font-extrabold leading-tight">
                {t.myPortfolios}
              </h1>
              <p className="opacity-70 mt-1 text-sm sm:text-base">{t.portfolioListSubtitle}</p>
            </div>
          </div>
        </Reveal>

        {error && <div className="alert alert-error text-sm">{error}</div>}

        {list.length === 0 && !error ? (
          <Reveal className="text-center py-12 sm:py-20 px-4">
            <p className="text-5xl sm:text-6xl mb-4">🚀</p>
            <h2 className="text-xl sm:text-2xl font-bold">{t.createFirst}</h2>
            <p className="opacity-70 mt-2 mb-6 text-sm sm:text-base">{t.publicLinkPrompt}</p>
            <Link to="/create-portfolio" className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto">
              {t.createPortfolio}
            </Link>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {list.map((p, i) => (
              <Reveal key={p._id} delay={i * 100} className="h-full">
                <PortfolioCard p={p} onDelete={setToDelete} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {toDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{t.deletePortfolio}</h3>
            <p className="py-4 opacity-80">
              "{toDelete.basic?.name || 'Untitled'}" will be permanently deleted and its public
              link will stop working.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setToDelete(null)} disabled={deleting}>
                {t.cancel}
              </button>
              <button className="btn btn-error" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-sm" /> : t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPortfolios;
