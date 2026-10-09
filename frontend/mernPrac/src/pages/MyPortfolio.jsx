import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/portfolio/portfolio.css'; // adjust path to your project
import { Reveal, completeness, publicUrl } from './portfolioUtils'; // adjust path

/* ---------- portfolio card ---------- */
const PortfolioCard = ({ p, onDelete }) => {
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
            <h3 className="card-title">{p.basic?.name || 'Untitled portfolio'}</h3>
            {p.basic?.title && <p className="opacity-70 text-sm">{p.basic.title}</p>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${p.isPublic ? 'badge-success' : 'badge-ghost'}`}>
              {p.isPublic ? 'Public' : 'Private'}
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

        {p.isPublic && p.slug ? (
          <div className="flex items-center gap-2 mt-3">
            <code className="text-xs bg-base-100 border border-base-300 rounded px-2 py-1 truncate flex-1">
              /p/{p.slug}
            </code>
            <button onClick={copy} className="btn btn-ghost btn-xs">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        ) : (
          <p className="text-xs opacity-60 mt-3">Publish this portfolio to get a public link</p>
        )}

        <div className="flex items-center justify-between text-xs opacity-60 mt-2">
          <span>👁 {p.views ?? 0} views</span>
          {p.updatedAt && <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>}
        </div>

        <div className="card-actions justify-end mt-auto pt-3">
          <button onClick={() => onDelete(p)} className="btn btn-ghost btn-sm text-error">
            Delete
          </button>
          {p.isPublic && p.slug && (
            <a href={publicUrl(p.slug)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              Open ↗
            </a>
          )}
          <Link to={`/portfolio/edit/${p._id}`} className="btn btn-primary btn-sm">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------- main ---------- */
const MyPortfolios = () => {
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
      <div className="pf-blob bg-primary w-72 h-72 -top-16 -left-16" />
      <div className="pf-blob bg-secondary w-80 h-80 bottom-0 -right-20" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 space-y-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="pf-gradient-text text-4xl sm:text-5xl font-extrabold leading-tight">
                My Portfolios
              </h1>
              <p className="opacity-70 mt-1">Edit, publish and share your portfolios</p>
            </div>
            <Link to="/create-portfolio" className="btn btn-primary">
              + Create portfolio
            </Link>
          </div>
        </Reveal>

        {error && <div className="alert alert-error">{error}</div>}

        {list.length === 0 && !error ? (
          <Reveal className="text-center py-20">
            <p className="text-6xl mb-4">🚀</p>
            <h2 className="text-2xl font-bold">Create your first portfolio</h2>
            <p className="opacity-70 mt-2 mb-6">Get a public portfolio link in a few minutes.</p>
            <Link to="/create-portfolio" className="btn btn-primary btn-lg">
              Create portfolio
            </Link>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h3 className="font-bold text-lg">Delete this portfolio?</h3>
            <p className="py-4 opacity-80">
              "{toDelete.basic?.name || 'Untitled'}" will be permanently deleted and its public
              link will stop working.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setToDelete(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPortfolios;