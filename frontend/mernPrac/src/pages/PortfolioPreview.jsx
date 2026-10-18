// src/pages/PortfolioPreview.jsx
import { Link } from 'react-router-dom';
import PortfolioView from '../components/portfolio/PortfolioView';
import { usePortfolio } from '../context/PortfolioContext';

const themes = [
  'light',
  'dark',
  'cupcake',
  'corporate',
  'emerald',
  'synthwave',
  'retro',
  'cyberpunk',
  'dracula',
  'night',
  'valentine',
  'halloween',
  'forest',
  'aqua',
  'luxury',
  'nord',
  'sunset',
];

const PortfolioPreview = () => {
  const { data, updateSection } = usePortfolio();
  const theme = data?.theme || 'light';

  return (
    <>
      <PortfolioView data={data} theme={theme} />

      {/* Floating toolbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-box bg-neutral text-neutral-content px-3 py-2 shadow-xl max-w-[95vw]">
        <Link to="/create-portfolio" className="btn btn-sm btn-ghost">← Edit</Link>
        <select
          value={theme}
          onChange={(e) => updateSection('theme', e.target.value)}
          className="select select-sm select-ghost text-neutral-content"
        >
          {themes.map((t) => (
            <option key={t} value={t} className="text-base-content">{t}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default PortfolioPreview;