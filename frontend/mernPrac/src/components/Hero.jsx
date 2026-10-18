// components/Hero.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  'Faster setup',
  'Cleaner design',
  'Customizable',
  'Themeable',
  'Shareable link',
  'No coding needed',
];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

const Hero = () => {
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
    <section className="hero bg-base-100 min-h-[85vh] px-4 py-8 sm:py-16">
      <div className="hero-content flex-col text-center max-w-5xl mx-auto gap-5 sm:gap-6 px-2">
        {/* Announcement pill */}
        <Link
          to={token ? '/create-portfolio' : '/signup'}
          className="badge badge-md sm:badge-lg badge-outline gap-2 hover:badge-primary transition text-xs sm:text-sm py-3 px-3 text-center max-w-full truncate"
        >
          New: pick a theme and publish in minutes →
        </Link>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Faster, cleaner, easier
          <br />
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            portfolio building
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl text-sm sm:text-lg md:text-xl opacity-75 px-2">
          DevFolio is the portfolio builder you will love!
          <br className="hidden sm:block" />
          {' '}It gives you ready-made themes to help you build and share faster.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center gap-3">
          <Link to={token ? '/create-portfolio' : '/signup'} className="btn btn-primary btn-md sm:btn-lg w-full sm:w-auto">
            {token ? 'Create Portfolio' : 'Get Started'}
          </Link>
          <Link to={token ? '/dashboard' : '/login'} className="btn btn-outline btn-md sm:btn-lg w-full sm:w-auto">
            {token ? 'Go to Dashboard' : 'Login'}
          </Link>
        </div>

        {/* Command box with copy */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 bg-base-200 border border-base-300 rounded-box px-3 sm:px-4 py-2.5 sm:py-3 max-w-full overflow-hidden">
          <span className="opacity-50 font-mono text-sm">$</span>
          <code className="font-mono text-xs sm:text-sm truncate">{command}</code>
          <button onClick={handleCopy} className="btn btn-ghost btn-xs shrink-0">
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>

        {/* Feature chips */}
        <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 mt-2 sm:mt-4">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-medium opacity-80">
              <CheckIcon />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;