
 // src/pages/Settings.jsx
import { useState } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const { theme, setTheme, language, setLanguage, t } =
    useSettings();

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  const handlePasswordChange = (e) => {
    setPasswords((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match.',
      });
      return;
    }

    if (passwords.newPassword.length < 8) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 8 characters.',
      });
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      // Is URL ko apne backend ke actual endpoint se match karna.
      await axios.put(
        '/api/users/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setMessage({
        type: 'success',
        text: t.passwordChanged,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Failed to change password. Check your backend API.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.settings}</h1>
        <p className="opacity-70 mt-1">{t.settingsSubtitle}</p>
      </div>

      {/* Appearance */}
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{t.appearance}</h2>
          <p className="text-sm opacity-70">{t.appearanceDesc}</p>

          <div className="flex flex-wrap gap-3 mt-3">
            {['light', 'dark'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                aria-pressed={theme === option}
                className={`btn ${
                  theme === option
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {option === 'light' ? '☀️' : '🌙'}{' '}
                {t[option] || option}
              </button>
            ))}
          </div>

          <div className="mt-4 max-w-xs">
            <label className="label py-1">
              <span className="label-text text-xs opacity-75 font-semibold">{t.allThemes}</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {[
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
              ].map((th) => (
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs opacity-60 mt-3">
            {t.themeApplied}
          </p>
        </div>
      </section>

      {/* Language */}
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{t.language}</h2>
          <p className="text-sm opacity-70">{t.languageDesc}</p>

          <select
            className="select select-bordered w-full max-w-xs mt-3"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </section>

      {/* Security */}
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{t.security}</h2>
          <p className="text-sm opacity-70">{t.securityDesc}</p>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4 mt-3"
          >
            <label className="form-control w-full">
              <span className="label-text mb-1">{t.currentPassword}</span>
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">{t.newPassword}</span>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="input input-bordered w-full"
                minLength={8}
                required
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">{t.confirmPassword}</span>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="input input-bordered w-full"
                minLength={8}
                required
              />
            </label>

            {message.text && (
              <div
                role="status"
                className={`alert ${
                  message.type === 'success'
                    ? 'alert-success'
                    : 'alert-error'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? t.updating : t.changePassword}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Settings;
