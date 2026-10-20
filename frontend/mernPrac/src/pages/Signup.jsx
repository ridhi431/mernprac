import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useSettings();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* simple strength indicator */
  const strength =
    formData.password.length === 0
      ? null
      : formData.password.length < 6
        ? 'weak'
        : formData.password.length < 10
          ? 'medium'
          : 'strong';

  const strengthColor = { weak: 'text-error', medium: 'text-warning', strong: 'text-success' };
  const strengthBar = { weak: 'w-1/3 bg-error', medium: 'w-2/3 bg-warning', strong: 'w-full bg-success' };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card bg-base-100 shadow-2xl border border-base-300/50">
        <div className="card-body p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{t.signup}</h2>
            <p className="text-base-content/50 text-sm mt-1">Create your account to get started</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div role="alert" className="alert alert-warning alert-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            {/* Name */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">{t.name}</span>
              </div>
              <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none"
                  required
                />
              </label>
            </label>

            {/* Email */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">{t.email}</span>
              </div>
              <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none"
                  required
                />
              </label>
            </label>

            {/* Password */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">{t.password}</span>
              </div>
              <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none"
                  required
                  minLength={6}
                />
                <button type="button" className="btn btn-ghost btn-xs btn-circle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </label>

              {/* Password Strength Bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-base-300 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthBar[strength]}`} />
                  </div>
                  <p className={`text-xs mt-1 ${strengthColor[strength]}`}>
                    Password strength: {strength}
                  </p>
                </div>
              )}
            </label>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account…
                </>
              ) : (
                t.signup
              )}
            </button>
          </form>

          {/* Divider & Login Link */}
          <div className="divider text-xs text-base-content/40 my-4">OR</div>
          <p className="text-center text-sm text-base-content/60">
            {t.alreadyAccount}{' '}
            <Link to="/login" className="link link-primary font-semibold link-hover">
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
