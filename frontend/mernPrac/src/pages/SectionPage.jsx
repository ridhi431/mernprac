// src/pages/SectionPage.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { portfolioSections } from '../data/portfolioSections';
import { usePortfolio } from '../context/PortfolioContext';
import BasicForm from '../components/sections/BasicForm';
import ContactForm from '../components/sections/ContactForm';
import SkillsForm from '../components/sections/SkillsForm';
import ListForm from '../components/sections/ListForm';

const renderForm = (slug) => {
  switch (slug) {
    case 'basic':
      return <BasicForm />;
    case 'contact':
      return <ContactForm />;
    case 'skills':
      return <SkillsForm />;
    case 'projects':
      return (
        <ListForm
          sectionKey="projects"
          itemLabel="Project"
          addLabel="Add project"
          fields={[
            { name: 'title', placeholder: 'Project title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
            { name: 'link', placeholder: 'Project link' },
          ]}
        />
      );
    case 'experience':
      return (
        <ListForm
          sectionKey="experience"
          itemLabel="Experience"
          addLabel="Add experience"
          fields={[
            { name: 'company', placeholder: 'Company' },
            { name: 'role', placeholder: 'Role' },
            { name: 'duration', placeholder: 'Duration (e.g. Jun 2025 - Aug 2025)' },
            { name: 'description', placeholder: 'What did you do?', type: 'textarea' },
          ]}
        />
      );
    case 'education':
      return (
        <ListForm
          sectionKey="education"
          itemLabel="Education"
          addLabel="Add education"
          fields={[
            { name: 'institute', placeholder: 'College / School' },
            { name: 'degree', placeholder: 'Degree / Course' },
            { name: 'year', placeholder: 'Year (e.g. 2022 - 2026)' },
          ]}
        />
      );
    default:
      return null;
  }
};

const SectionPage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const { data } = usePortfolio();

  const index = portfolioSections.findIndex((s) => s.slug === section);
  const current = portfolioSections[index];

  if (!current) {
    return (
      <div className="text-center py-20">
        <p className="mb-4">Section not found.</p>
        <Link to="/create-portfolio" className="btn btn-primary">Back to sections</Link>
      </div>
    );
  }

  const prev = portfolioSections[index - 1];
  const next = portfolioSections[index + 1];

  const canContinue = () => {
    if (current.slug === 'basic') return data.basic.name.trim() && data.basic.title.trim();
    if (current.slug === 'contact') return data.contact.email.trim();
    return true;
  };

  const handleSave = () => {
    // The draft is already auto-saved. Sending it to the backend comes later.
    if (next) navigate(`/create-portfolio/${next.slug}`);
    else navigate('/create-portfolio');
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4">
      <Link to="/create-portfolio" className="btn btn-ghost btn-sm mb-4">
        ← All sections
      </Link>

      {/* Banner */}
      <div className={`rounded-box bg-linear-to-br ${current.gradient} p-4 sm:p-8 text-white flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 mb-6 text-center sm:text-left`}>
        <div className="text-4xl sm:text-6xl shrink-0">{current.emoji}</div>
        <div>
          <p className="text-xs uppercase tracking-widest opacity-80">
            Step {index + 1} of {portfolioSections.length}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{current.title}</h1>
          <p className="opacity-90 mt-1 text-sm sm:text-base">{current.description}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Section navigation */}
        <aside className="lg:w-56 shrink-0">
          <ul className="menu menu-horizontal lg:menu-vertical bg-base-200 rounded-box w-full flex-nowrap overflow-x-auto gap-1 no-scrollbar p-2">
            {portfolioSections.map((s, i) => (
              <li key={s.slug}>
                <Link
                  to={`/create-portfolio/${s.slug}`}
                  className={`whitespace-nowrap ${s.slug === current.slug ? 'menu-active' : ''}`}
                >
                  <span>{s.emoji}</span>
                  {i + 1}. {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Form card */}
        <div className="card bg-base-100 border border-base-300 shadow flex-1">
          <div className="card-body p-4 sm:p-8 gap-4 sm:gap-6">
            {renderForm(current.slug)}

            <div className="card-actions justify-between flex-wrap gap-2 pt-2">
              {prev ? (
                <Link to={`/create-portfolio/${prev.slug}`} className="btn btn-sm sm:btn-md">
                  ← Back
                </Link>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={!canContinue()}
                className="btn btn-primary btn-sm sm:btn-md"
              >
                {next ? 'Save & Continue →' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPage;