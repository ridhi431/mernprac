// components/Hero.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const features = ['fasterSetup', 'cleanerDesign', 'customizable', 'themeable', 'shareableLink', 'noCoding'];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

const Hero = () => {
  const { t } = useSettings();
  const token = localStorage.getItem('token');
  const [copied, setCopied] = useState(false);
  const command = 'npx create-portfolio --name "Your Name"';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="bg-base-100 min-h-[85vh] flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6">
        {/* Announcement pill */}
        <Link
          to={token ? '/create-portfolio' : '/signup'}
          className="badge badge-md sm:badge-lg badge-outline gap-2 hover:badge-primary transition text-xs sm:text-sm py-3 px-4 text-center max-w-[90vw] truncate"
        >
          {t.heroAnnouncement}
        </Link>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-3xl">
          {t.heroTitle}
          <br />
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.portfolioBuilding}
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-sm sm:text-lg md:text-xl opacity-75 px-2">
          {t.heroDescription}
          <br className="hidden sm:block" />
          {' '}{t.heroDescription2}
        </p>

        {/* Buttons (evenly centered on screen) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-md mx-auto">
          <Link
            to={token ? '/create-portfolio' : '/signup'}
            className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto sm:min-w-[180px] shadow-sm"
          >
            {token ? t.createPortfolio : t.getStarted}
          </Link>
          <Link
            to={token ? '/dashboard' : '/login'}
            className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto sm:min-w-[180px]"
          >
            {token ? t.goDashboard : t.login}
          </Link>
        </div>

        {/* Command box with copy (evenly centered with buttons) */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 bg-base-200 border border-base-300 rounded-box px-3 sm:px-4 py-2.5 sm:py-3 w-full max-w-xs sm:max-w-md mx-auto overflow-hidden">
          <span className="opacity-50 font-mono text-sm">$</span>
          <code className="font-mono text-xs sm:text-sm truncate flex-1 min-w-0 text-left">{command}</code>
          <button onClick={handleCopy} className="btn btn-ghost btn-xs shrink-0">
            {copied ? t.copied : t.copy}
          </button>
        </div>

        {/* Feature chips */}
        <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mt-2 sm:mt-4 max-w-2xl mx-auto">
          {features.map((key) => (
            <li key={key} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium opacity-80">
              <CheckIcon />
              {t[key]}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
