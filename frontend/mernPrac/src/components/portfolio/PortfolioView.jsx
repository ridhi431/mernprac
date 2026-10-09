// src/components/portfolio/PortfolioView.jsx
import { useEffect, useRef, useState } from 'react';
import './portfolio.css';

/* ---------- helpers ---------- */
const url = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const useInView = () => {
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

const useTyping = (text, speed = 70) => {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
};

const Reveal = ({ children, delay = 0, className = '' }) => {
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

const Section = ({ id, eyebrow, title, alt, children }) => (
  <section id={id} className={`py-20 px-6 ${alt ? 'bg-base-200/60' : ''}`}>
    <div className="max-w-5xl mx-auto">
      <Reveal className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-primary font-semibold">{eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">{title}</h2>
      </Reveal>
      {children}
    </div>
  </section>
);

const Timeline = ({ items, render }) => (
  <div className="pf-line ml-3 max-w-3xl mx-auto flex flex-col gap-8 pl-8">
    {items.map((item, i) => (
      <Reveal key={i} delay={i * 120} className="relative">
        <span className="pf-dot" />
        {render(item)}
      </Reveal>
    ))}
  </div>
);

/* ---------- main component ---------- */
const PortfolioView = ({ data, theme }) => {
  const {
    basic = {},
    contact = {},
    skills = [],
    projects = [],
    experience = [],
    education = [],
  } = data || {};

  // Hide empty items so half-filled data still looks good
  const projectList = projects.filter((p) => p.title?.trim());
  const expList = experience.filter((e) => e.company?.trim() || e.role?.trim());
  const eduList = education.filter((e) => e.institute?.trim());

  const typed = useTyping(basic.title);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sections = [
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projectList.length > 0 },
    { id: 'experience', label: 'Experience', show: expList.length > 0 },
    { id: 'education', label: 'Education', show: eduList.length > 0 },
    { id: 'contact', label: 'Contact', show: !!contact.email?.trim() },
  ].filter((s) => s.show);

  return (
    <div data-theme={theme} className="bg-base-100 text-base-content min-h-screen">
      {/* Navbar + scroll progress */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-base-100/70 border-b border-base-300">
        <div className="h-1 bg-primary transition-[width] duration-100" style={{ width: `${progress}%` }} />
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <button onClick={() => go('top')} className="font-extrabold text-lg">
            {basic.name || 'Portfolio'}
          </button>
          <nav className="hidden sm:flex gap-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => go(s.id)} className="btn btn-ghost btn-sm">
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16"
      >
        <div className="pf-blob bg-primary w-72 h-72 -top-10 -left-10" />
        <div className="pf-blob bg-secondary w-96 h-96 bottom-0 -right-20" style={{ animationDelay: '-4s' }} />
        <div className="pf-blob bg-accent w-64 h-64 top-1/2 left-1/3" style={{ animationDelay: '-8s' }} />

        <div className="relative z-10 text-center max-w-3xl flex flex-col items-center gap-5">
          <Reveal>
            <div className="pf-ring">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-base-200 border-4 border-base-100 flex items-center justify-center">
                {basic.photo ? (
                  <img
                    src={basic.photo}
                    alt={basic.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="opacity-70">Hi, I'm</p>
            <h1 className="pf-gradient-text text-5xl sm:text-7xl font-extrabold leading-tight">
              {basic.name || 'Your Name'}
            </h1>
          </Reveal>

          {basic.title && (
            <Reveal delay={300}>
              <p className="text-xl sm:text-2xl font-semibold min-h-8">
                {typed}
                <span className="pf-cursor text-primary">|</span>
              </p>
            </Reveal>
          )}

          {basic.bio && (
            <Reveal delay={450}>
              <p className="opacity-75 text-base sm:text-lg max-w-2xl">{basic.bio}</p>
            </Reveal>
          )}

          <Reveal delay={600}>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn btn-primary">Get in touch</a>
              )}
              {contact.github && (
                <a href={url(contact.github)} target="_blank" rel="noreferrer" className="btn btn-outline">GitHub</a>
              )}
              {contact.linkedin && (
                <a href={url(contact.linkedin)} target="_blank" rel="noreferrer" className="btn btn-outline">LinkedIn</a>
              )}
            </div>
          </Reveal>
        </div>

        {sections.length > 0 && (
          <button
            onClick={() => go(sections[0].id)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-60"
            aria-label="scroll down"
          >
            ↓
          </button>
        )}
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <Section id="skills" eyebrow="What I use" title="Skills" alt>
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((s, i) => (
              <Reveal key={s} delay={i * 60}>
                <span className="pf-chip badge badge-primary badge-lg cursor-default">{s}</span>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projectList.length > 0 && (
        <Section id="projects" eyebrow="My work" title="Projects">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((p, i) => (
              <Reveal key={i} delay={i * 100} className="h-full">
                <div className="pf-card card bg-base-200 border border-base-300 h-full">
                  <div className="card-body">
                    <span className="text-primary font-mono text-sm">0{i + 1}</span>
                    <h3 className="card-title">{p.title}</h3>
                    {p.description && <p className="opacity-70 text-sm">{p.description}</p>}
                    {p.link && (
                      <div className="card-actions justify-end mt-auto pt-3">
                        <a href={url(p.link)} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                          View project ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      {expList.length > 0 && (
        <Section id="experience" eyebrow="Where I worked" title="Experience" alt>
          <Timeline
            items={expList}
            render={(e) => (
              <>
                <h3 className="text-lg font-bold">{e.role || e.company}</h3>
                <p className="text-primary text-sm font-medium">
                  {e.role ? e.company : ''}{e.duration ? `${e.role ? ' · ' : ''}${e.duration}` : ''}
                </p>
                {e.description && <p className="opacity-70 mt-2 text-sm">{e.description}</p>}
              </>
            )}
          />
        </Section>
      )}

      {/* Education */}
      {eduList.length > 0 && (
        <Section id="education" eyebrow="Where I studied" title="Education">
          <Timeline
            items={eduList}
            render={(e) => (
              <>
                <h3 className="text-lg font-bold">{e.institute}</h3>
                <p className="text-primary text-sm font-medium">
                  {e.degree}{e.year ? `${e.degree ? ' · ' : ''}${e.year}` : ''}
                </p>
              </>
            )}
          />
        </Section>
      )}

      {/* Contact */}
      {contact.email && (
        <Section id="contact" eyebrow="Contact" title="Let's work together" alt>
          <Reveal className="text-center max-w-xl mx-auto flex flex-col items-center gap-6">
            <p className="opacity-70">Have a project or an opportunity in mind? Send me a message.</p>
            <a href={`mailto:${contact.email}`} className="btn btn-primary btn-lg">
              ✉️ {contact.email}
            </a>
            <div className="flex gap-3">
              {contact.github && (
                <a href={url(contact.github)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">GitHub</a>
              )}
              {contact.linkedin && (
                <a href={url(contact.linkedin)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">LinkedIn</a>
              )}
            </div>
          </Reveal>
        </Section>
      )}

      <footer className="text-center py-8 opacity-60 text-sm">Built with PortfolioGen ✨</footer>
    </div>
  );
};

export default PortfolioView;