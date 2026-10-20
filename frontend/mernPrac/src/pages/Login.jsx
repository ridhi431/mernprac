import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card bg-base-100 shadow-2xl border border-base-300/50">
        <div className="card-body p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{t.login}</h2>
            <p className="text-base-content/50 text-sm mt-1">Welcome back! Sign in to continue</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div role="alert" className="alert alert-error alert-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
            </label>

            {/* Forgot Password Link */}
            <div className="text-right -mt-1">
              <Link to="/forgot-password" className="link link-primary text-sm link-hover">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in…
                </>
              ) : (
                t.login
              )}
            </button>
          </form>

          {/* Divider & Signup Link */}
          <div className="divider text-xs text-base-content/40 my-4">OR</div>
          <p className="text-center text-sm text-base-content/60">
            {t.noAccount}{' '}
            <Link to="/signup" className="link link-primary font-semibold link-hover">
              {t.signup}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
