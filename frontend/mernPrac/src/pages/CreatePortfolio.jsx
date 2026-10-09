// src/pages/CreatePortfolio.jsx
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { portfolioSections } from '../data/portfolioSections';
import { usePortfolio } from '../context/PortfolioContext';

const TiltCard = ({ to, children }) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const MAX_TILT = 12;

  const handleMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 2 * MAX_TILT;
    const rotateX = (0.5 - y) * 2 * MAX_TILT;

    card.style.transition = 'transform 0.1s ease-out';
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.04)`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 60%)`;
    }
  };

  const handleLeave = () => {
    const card = cardRef.current;
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <Link
        ref={cardRef}
        to={to}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transformStyle: 'preserve-3d' }}
        className="card relative w-72 overflow-hidden bg-base-100 border border-base-300 shadow-md hover:shadow-2xl will-change-transform"
      >
        {children}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
      </Link>
    </div>
  );
};

const CreatePortfolio = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { data, resetDraft } = usePortfolio();
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const scroll = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const canPublish =
    data.basic.name.trim() && data.basic.title.trim() && data.contact.email.trim();

  const handlePublish = async () => {
    setPublishing(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/portfolios',
        { ...data, theme: 'light', isPublic: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Created:', res.data); // check _id and slug here
      resetDraft();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Heading + arrows */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Create your portfolio</h1>
          <p className="opacity-70 mt-1">Pick a card and fill in that section.</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Link to="/preview" className="btn btn-outline btn-sm">
              👁 Preview portfolio
            </Link>
            <button
              onClick={handlePublish}
              disabled={!canPublish || publishing}
              className="btn btn-primary btn-sm"
            >
              {publishing ? <span className="loading loading-spinner loading-xs" /> : '🚀 Publish'}
            </button>
            <button onClick={resetDraft} className="btn btn-ghost btn-sm text-error">
              Clear all
            </button>
          </div>

          {error && <div className="alert alert-error text-sm mt-3">{error}</div>}
        </div>

        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className="btn btn-circle btn-outline" aria-label="previous">❮</button>
          <button onClick={() => scroll(1)} className="btn btn-circle btn-outline" aria-label="next">❯</button>
        </div>
      </div>

      {/* Carousel */}
      <div ref={carouselRef} className="carousel carousel-start w-full gap-6 py-8 px-4">
        {portfolioSections.map((s) => (
          <div key={s.slug} className="carousel-item">
            <TiltCard to={`/create-portfolio/${s.slug}`}>
              <figure className="h-40 w-full">
                {s.image ? (
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                ) : (
                  <div className={`h-full w-full flex items-center justify-center text-6xl bg-linear-to-br ${s.gradient}`}>
                    {s.emoji}
                  </div>
                )}
              </figure>

              <div className="card-body gap-3">
                <h2 className="card-title">{s.title}</h2>
                <p className="text-sm opacity-70">{s.description}</p>

                <div className="flex flex-wrap gap-1">
                  {s.items.map((i) => (
                    <span key={i} className="badge badge-ghost badge-sm">{i}</span>
                  ))}
                </div>

                <div className="card-actions justify-end mt-2">
                  <span className="btn btn-primary btn-sm">Add details →</span>
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePortfolio;