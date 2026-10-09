import { useEffect, useRef, useState } from 'react';

export const publicUrl = (slug) => `${window.location.origin}/p/${slug}`;

// How many of the 5 sections are filled, plus the next hint
export const completeness = (p) => {
  const checks = [
    { ok: !!(p.basic?.name && p.basic?.title), hint: 'Add your name and title' },
    { ok: (p.skills || []).length > 0, hint: 'Add skills' },
    { ok: (p.projects || []).some((x) => x.title?.trim()), hint: 'Add projects' },
    { ok: (p.experience || []).some((x) => x.company?.trim() || x.role?.trim()), hint: 'Add experience' },
    { ok: (p.education || []).some((x) => x.institute?.trim()), hint: 'Add education' },
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    hint: checks.find((c) => !c.ok)?.hint || null,
  };
};

export const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

export const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ '--d': `${delay}ms` }}
      className={`pf-reveal ${inView ? 'pf-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const Stat = ({ label, value }) => (
  <div className="pf-card card bg-base-200 border border-base-300">
    <div className="card-body py-5">
      <p className="text-sm opacity-60">{label}</p>
      <p className="text-3xl font-extrabold">{value}</p>
    </div>
  </div>
);