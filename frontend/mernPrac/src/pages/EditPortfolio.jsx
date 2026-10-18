// src/pages/EditPortfolio.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { portfolioSections } from '../data/portfolioSections';
import PortfolioView from '../components/portfolio/PortfolioView';
import { publicUrl } from './PortfolioUtils';

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

const EditPortfolio = () => {
  const { id } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [skillInput, setSkillInput] = useState('');

  const fileRef = useRef(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`/api/portfolios/${id}`);
        const p = res.data;

        setPortfolio({
          ...p,
          theme: p.theme || 'light',
          isPublic: p.isPublic !== undefined ? p.isPublic : true,
          basic: {
            name: '',
            title: '',
            bio: '',
            photo: '',
            ...(p.basic || {}),
          },
          contact: {
            email: '',
            github: '',
            linkedin: '',
            ...(p.contact || {}),
          },
          skills: Array.isArray(p.skills)
            ? p.skills
                .map((s) => (typeof s === 'string' ? s : s?.name || ''))
                .filter(Boolean)
            : [],
          projects:
            p.projects && p.projects.length > 0
              ? p.projects
              : [{ title: '', description: '', link: '' }],
          experience:
            p.experience && p.experience.length > 0
              ? p.experience
              : [{ company: '', role: '', duration: '', description: '' }],
          education:
            p.education && p.education.length > 0
              ? p.education
              : [{ institute: '', degree: '', year: '' }],
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load portfolio for editing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPortfolio();
    }
  }, [id]);

  // Image resizing helper (256x256 jpeg)
  const resizeImage = (file, size = 256) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2;
          const sy = (img.height - min) / 2;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas is unavailable'));
            return;
          }
          ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('Could not read image'));
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.');
      return;
    }

    try {
      const photo = await resizeImage(file);
      setPortfolio((prev) => ({
        ...prev,
        basic: { ...prev.basic, photo },
      }));
    } catch {
      alert('Could not process this image.');
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({
      ...prev,
      basic: { ...prev.basic, [name]: value },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (s && !portfolio.skills.includes(s)) {
      setPortfolio((prev) => ({
        ...prev,
        skills: [...prev.skills, s],
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Dynamic list handlers (projects, experience, education)
  const handleListItemChange = (sectionKey, index, field, value) => {
    setPortfolio((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddListItem = (sectionKey, emptyItem) => {
    setPortfolio((prev) => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], emptyItem],
    }));
  };

  const handleRemoveListItem = (sectionKey, index) => {
    setPortfolio((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, i) => i !== index),
    }));
  };

  // Save changes via PUT /api/portfolios/:id
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!portfolio.basic?.name?.trim() || !portfolio.basic?.title?.trim()) {
      setError('Full Name and Title are required.');
      return;
    }
    if (!portfolio.contact?.email?.trim()) {
      setError('Contact Email is required.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.put(`/api/portfolios/${id}`, portfolio);
      setPortfolio((prev) => ({
        ...prev,
        ...res.data,
      }));
      setSuccessMsg('Portfolio updated successfully! 🎉');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update portfolio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="alert alert-error mb-6">{error}</div>
        <Link to="/my-portfolios" className="btn btn-primary">
          Back to My Portfolios
        </Link>
      </div>
    );
  }

  const allTabs = [
    ...portfolioSections.map((s) => ({
      slug: s.slug,
      title: s.title,
      emoji: s.emoji,
      gradient: s.gradient,
      description: s.description,
    })),
    {
      slug: 'settings',
      title: 'Theme & Visibility',
      emoji: '⚙️',
      gradient: 'from-primary to-accent',
      description: 'Choose your portfolio theme and visibility.',
    },
    {
      slug: 'preview',
      title: 'Live Preview',
      emoji: '👁️',
      gradient: 'from-accent to-secondary',
      description: 'Live interactive preview of your updated portfolio.',
    },
  ];

  const currentTabInfo = allTabs.find((t) => t.slug === activeTab) || allTabs[0];
  const currentTabIndex = allTabs.findIndex((t) => t.slug === activeTab);
  const nextTab = currentTabIndex >= 0 && currentTabIndex < allTabs.length - 2 ? allTabs[currentTabIndex + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-base-300">
        <div>
          <Link to="/my-portfolios" className="btn btn-ghost btn-sm gap-2 mb-2">
            ← Back to My Portfolios
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold">
              Edit Portfolio
            </h1>
            <span className={`badge ${portfolio.isPublic ? 'badge-success' : 'badge-ghost'}`}>
              {portfolio.isPublic ? 'Public' : 'Private'}
            </span>
            <span className="badge badge-outline">{portfolio.theme}</span>
          </div>
          <p className="opacity-70 text-sm mt-1">
            Updating {portfolio.basic?.name || 'Untitled Portfolio'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {portfolio.slug && (
            <a
              href={publicUrl(portfolio.slug)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              {portfolio.isPublic ? 'Open Live ↗' : 'View (Private) ↗'}
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
          >
            {saving ? <span className="loading loading-spinner loading-xs" /> : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="alert alert-error text-sm">{error}</div>}
      {successMsg && <div className="alert alert-success text-sm">{successMsg}</div>}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-base-300 pb-3">
        {allTabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setActiveTab(tab.slug)}
            className={`btn btn-sm ${
              activeTab === tab.slug ? 'btn-primary' : 'btn-ghost'
            } gap-2`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'preview' ? (
        <div className="card bg-base-100 border border-base-300 shadow overflow-hidden">
          <div className="p-4 bg-base-200 border-b border-base-300 flex items-center justify-between">
            <span className="font-semibold text-sm">Interactive Preview ({portfolio.theme} theme)</span>
            <div className="flex items-center gap-2">
              <label className="text-xs opacity-75">Switch Theme:</label>
              <select
                value={portfolio.theme}
                onChange={(e) => setPortfolio((p) => ({ ...p, theme: e.target.value }))}
                className="select select-bordered select-xs"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative max-h-[800px] overflow-y-auto">
            <PortfolioView data={portfolio} theme={portfolio.theme} />
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-300 shadow">
          {/* Section banner */}
          <div
            className={`bg-linear-to-br ${currentTabInfo.gradient} p-6 text-white flex items-center gap-4 rounded-t-2xl`}
          >
            <div className="text-4xl">{currentTabInfo.emoji}</div>
            <div>
              <h2 className="text-xl font-bold">{currentTabInfo.title}</h2>
              <p className="opacity-90 text-sm mt-0.5">{currentTabInfo.description}</p>
            </div>
          </div>

          <div className="card-body gap-6">
            {/* 1. Basic Info */}
            {activeTab === 'basic' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="relative group rounded-full shrink-0"
                    aria-label="Change profile photo"
                  >
                    <div className="avatar placeholder">
                      <div className="w-20 rounded-full bg-base-300 ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center overflow-hidden">
                        {portfolio.basic.photo ? (
                          <img
                            src={portfolio.basic.photo}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      📷 Change
                    </div>
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="btn btn-outline btn-sm"
                    >
                      Upload Photo
                    </button>
                    {portfolio.basic.photo && (
                      <button
                        type="button"
                        onClick={() =>
                          setPortfolio((prev) => ({
                            ...prev,
                            basic: { ...prev.basic, photo: '' },
                          }))
                        }
                        className="btn btn-ghost btn-sm text-error"
                      >
                        Remove Photo
                      </button>
                    )}
                    <p className="text-xs opacity-60">
                      JPG, PNG or web formats. Auto-cropped to square (max 5 MB).
                    </p>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name *</span>
                  </label>
                  <input
                    name="name"
                    value={portfolio.basic.name}
                    onChange={handleBasicChange}
                    className="input input-bordered w-full"
                    placeholder="e.g. Alex Doe"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Title / Tagline *</span>
                  </label>
                  <input
                    name="title"
                    value={portfolio.basic.title}
                    onChange={handleBasicChange}
                    className="input input-bordered w-full"
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={portfolio.basic.bio}
                    onChange={handleBasicChange}
                    className="textarea textarea-bordered w-full"
                    rows={4}
                    placeholder="A short introduction about yourself and your passions..."
                  />
                </div>
              </div>
            )}

            {/* 2. Contact */}
            {activeTab === 'contact' && (
              <div className="flex flex-col gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email Address *</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={portfolio.contact.email}
                    onChange={handleContactChange}
                    className="input input-bordered w-full"
                    placeholder="e.g. alex@example.com"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">GitHub Profile URL</span>
                  </label>
                  <input
                    name="github"
                    value={portfolio.contact.github}
                    onChange={handleContactChange}
                    className="input input-bordered w-full"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">LinkedIn Profile URL</span>
                  </label>
                  <input
                    name="linkedin"
                    value={portfolio.contact.linkedin}
                    onChange={handleContactChange}
                    className="input input-bordered w-full"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            )}

            {/* 3. Skills */}
            {activeTab === 'skills' && (
              <div className="flex flex-col gap-4">
                <div className="join w-full">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="input input-bordered join-item w-full"
                    placeholder="Type a skill (e.g. React, Node.js) and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn btn-primary join-item"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {portfolio.skills.length === 0 && (
                    <p className="text-sm opacity-60">No skills added yet.</p>
                  )}
                  {portfolio.skills.map((s) => (
                    <span key={s} className="badge badge-lg badge-primary gap-2">
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        aria-label={`Remove skill ${s}`}
                        className="hover:font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Projects */}
            {activeTab === 'projects' && (
              <div className="flex flex-col gap-4">
                {portfolio.projects.map((item, i) => (
                  <div
                    key={i}
                    className="border border-base-300 rounded-box p-4 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Project {i + 1}</span>
                      {portfolio.projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('projects', i)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      value={item.title || ''}
                      onChange={(e) =>
                        handleListItemChange('projects', i, 'title', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Project title"
                    />
                    <textarea
                      value={item.description || ''}
                      onChange={(e) =>
                        handleListItemChange('projects', i, 'description', e.target.value)
                      }
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      placeholder="Project description"
                    />
                    <input
                      value={item.link || ''}
                      onChange={(e) =>
                        handleListItemChange('projects', i, 'link', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Live or GitHub link"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleAddListItem('projects', { title: '', description: '', link: '' })
                  }
                  className="btn btn-outline btn-sm self-start"
                >
                  + Add Project
                </button>
              </div>
            )}

            {/* 5. Experience */}
            {activeTab === 'experience' && (
              <div className="flex flex-col gap-4">
                {portfolio.experience.map((item, i) => (
                  <div
                    key={i}
                    className="border border-base-300 rounded-box p-4 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Experience {i + 1}</span>
                      {portfolio.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('experience', i)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      value={item.company || ''}
                      onChange={(e) =>
                        handleListItemChange('experience', i, 'company', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Company"
                    />
                    <input
                      value={item.role || ''}
                      onChange={(e) =>
                        handleListItemChange('experience', i, 'role', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Role (e.g. Frontend Engineer)"
                    />
                    <input
                      value={item.duration || ''}
                      onChange={(e) =>
                        handleListItemChange('experience', i, 'duration', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Duration (e.g. Jun 2024 - Present)"
                    />
                    <textarea
                      value={item.description || ''}
                      onChange={(e) =>
                        handleListItemChange('experience', i, 'description', e.target.value)
                      }
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      placeholder="What did you achieve or work on?"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleAddListItem('experience', {
                      company: '',
                      role: '',
                      duration: '',
                      description: '',
                    })
                  }
                  className="btn btn-outline btn-sm self-start"
                >
                  + Add Experience
                </button>
              </div>
            )}

            {/* 6. Education */}
            {activeTab === 'education' && (
              <div className="flex flex-col gap-4">
                {portfolio.education.map((item, i) => (
                  <div
                    key={i}
                    className="border border-base-300 rounded-box p-4 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Education {i + 1}</span>
                      {portfolio.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveListItem('education', i)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      value={item.institute || ''}
                      onChange={(e) =>
                        handleListItemChange('education', i, 'institute', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="College / Institute / School"
                    />
                    <input
                      value={item.degree || ''}
                      onChange={(e) =>
                        handleListItemChange('education', i, 'degree', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Degree / Major (e.g. B.Tech Computer Science)"
                    />
                    <input
                      value={item.year || ''}
                      onChange={(e) =>
                        handleListItemChange('education', i, 'year', e.target.value)
                      }
                      className="input input-bordered w-full"
                      placeholder="Year (e.g. 2021 - 2025)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleAddListItem('education', { institute: '', degree: '', year: '' })
                  }
                  className="btn btn-outline btn-sm self-start"
                >
                  + Add Education
                </button>
              </div>
            )}

            {/* 7. Settings (Theme & Visibility) */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Portfolio Theme</span>
                  </label>
                  <select
                    value={portfolio.theme}
                    onChange={(e) =>
                      setPortfolio((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    className="select select-bordered w-full max-w-xs"
                  >
                    {themes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs opacity-60 mt-1">
                    Select the styling theme for your public portfolio.
                  </p>
                </div>

                {/* Live Theme Preview Box */}
                <div
                  data-theme={portfolio.theme}
                  className="rounded-box p-4 border border-base-300 bg-base-100 text-base-content max-w-md shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                      Sample Preview: {portfolio.theme}
                    </p>
                    <span className="badge badge-primary badge-sm">{portfolio.theme}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="btn btn-primary btn-xs">Primary</span>
                    <span className="btn btn-secondary btn-xs">Secondary</span>
                    <span className="btn btn-accent btn-xs">Accent</span>
                    <span className="badge badge-neutral badge-sm">Neutral</span>
                  </div>
                  <div className="p-3 bg-base-200 rounded-lg text-xs space-y-1">
                    <p className="font-semibold">Live theme check</p>
                    <p className="opacity-80">
                      Your portfolio will render using these exact colors. Switch to the <strong>Live Preview</strong> tab above to see the full page!
                    </p>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={portfolio.isPublic}
                      onChange={(e) =>
                        setPortfolio((prev) => ({ ...prev, isPublic: e.target.checked }))
                      }
                      className="toggle toggle-primary"
                    />
                    <div>
                      <span className="label-text font-semibold block">Public Visibility</span>
                      <span className="text-xs opacity-60">
                        {portfolio.isPublic
                          ? 'Anyone with the link can view your portfolio.'
                          : 'Only you can view this portfolio.'}
                      </span>
                    </div>
                  </label>
                </div>

                {portfolio.slug && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Public Link</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={publicUrl(portfolio.slug)}
                        className="input input-bordered flex-1 bg-base-200 text-sm"
                      />
                      <a
                        href={publicUrl(portfolio.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        Open ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="card-actions justify-between pt-4 border-t border-base-300">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  '💾 Save Changes'
                )}
              </button>

              {nextTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab(nextTab.slug)}
                  className="btn btn-ghost"
                >
                  Next: {nextTab.title} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPortfolio;
