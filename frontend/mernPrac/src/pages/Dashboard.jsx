import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/portfolio/portfolio.css'; // adjust path to your project
import { Reveal, Stat, completeness } from './PortfolioUtils'; // adjust path

/* Dashboard = quick overview. Full management lives in My Portfolios. */
const Dashboard = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/portfolios');
        setList(Array.isArray(res.data) ? res.data : res.data.portfolios || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const publicCount = list.filter((p) => p.isPublic).length;
  const totalViews = list.reduce((sum, p) => sum + (p.views || 0), 0);
  const scored = list.map((p) => ({ p, ...completeness(p) }));
  const avgComplete = scored.length
    ? Math.round(scored.reduce((s, x) => s + x.percent, 0) / scored.length)
    : 0;

  // Least complete portfolio that still needs work
  const needsWork = [...scored].filter((x) => x.percent < 100).sort((a, b) => a.percent - b.percent)[0];

  // 3 most recently updated
  const recent = [...list]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3);

  return (
    <div className="relative min-h-screen bg-base-100 overflow-hidden">
      <div className="pf-blob bg-primary w-72 h-72 -top-16 -left-16 pointer-events-none" />
      <div className="pf-blob bg-secondary w-80 h-80 bottom-0 -right-20 pointer-events-none" style={{ animationDelay: '-4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 space-y-6 sm:space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="pf-gradient-text text-3xl sm:text-5xl font-extrabold leading-tight">
                Dashboard
              </h1>
              <p className="opacity-70 mt-1 text-sm sm:text-base">Your portfolios at a glance</p>
            </div>
          </div>
        </Reveal>

        {error && <div className="alert alert-error text-sm">{error}</div>}

        {list.length === 0 && !error ? (
          <Reveal className="text-center py-12 sm:py-20 px-4">
            <p className="text-5xl sm:text-6xl mb-4">🚀</p>
            <h2 className="text-xl sm:text-2xl font-bold">Create your first portfolio</h2>
            <p className="opacity-70 mt-2 mb-6 text-sm sm:text-base">Get a public portfolio link in a few minutes.</p>
            <Link to="/create-portfolio" className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto">
              Create portfolio
            </Link>
          </Reveal>
        ) : (
          list.length > 0 && (
            <>
              {/* stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                <Reveal><Stat label="Portfolios" value={list.length} /></Reveal>
                <Reveal delay={100}><Stat label="Public" value={`${publicCount} / ${list.length}`} /></Reveal>
                <Reveal delay={200}><Stat label="Total views" value={totalViews} /></Reveal>
                <Reveal delay={300}><Stat label="Avg. completeness" value={`${avgComplete}%`} /></Reveal>
              </div>

              {/* needs attention */}
              {needsWork && (
                <Reveal>
                  <div className="pf-card card bg-base-200 border border-base-300">
                    <div className="card-body p-4 sm:p-6 flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm opacity-60">Next step</p>
                        <h3 className="font-bold text-base sm:text-lg truncate">
                          {needsWork.p.basic?.name || 'Untitled portfolio'}: {needsWork.hint?.toLowerCase()}
                        </h3>
                        <progress
                          className="progress progress-primary w-full mt-2"
                          value={needsWork.percent}
                          max="100"
                        />
                      </div>
                      <Link to={`/portfolio/edit/${needsWork.p._id}`} className="btn btn-primary btn-sm w-full sm:w-auto shrink-0">
                        Continue editing
                      </Link>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* recent */}
              <Reveal>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-bold">Recently updated</h2>
                  <Link to="/my-portfolios" className="link link-primary text-xs sm:text-sm">
                    View all portfolios
                  </Link>
                </div>
                <div className="space-y-3">
                  {recent.map((p) => (
                    <div key={p._id} className="card bg-base-200 border border-base-300">
                      <div className="card-body p-4 flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{p.basic?.name || 'Untitled portfolio'}</h3>
                          <p className="text-xs opacity-60 mt-0.5">
                            {p.updatedAt ? `Updated ${new Date(p.updatedAt).toLocaleDateString()}` : ''}
                            {` · ${p.views ?? 0} views`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <span className={`badge ${p.isPublic ? 'badge-success' : 'badge-ghost'} badge-sm`}>
                            {p.isPublic ? 'Public' : 'Private'}
                          </span>
                          <Link to={`/portfolio/edit/${p._id}`} className="btn btn-ghost btn-sm">
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;