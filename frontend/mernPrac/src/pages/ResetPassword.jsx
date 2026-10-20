import { useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/auth/reset-password', {
        token,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not reset password. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* simple strength indicator */
  const strength =
    password.length === 0
      ? null
      : password.length < 6
        ? 'weak'
        : password.length < 10
          ? 'medium'
          : 'strong';

  const strengthBar = { weak: 'w-1/3 bg-error', medium: 'w-2/3 bg-warning', strong: 'w-full bg-success' };
  const strengthColor = { weak: 'text-error', medium: 'text-warning', strong: 'text-success' };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card bg-base-100 shadow-2xl border border-base-300/50">
        <div className="card-body p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Reset password</h2>
            <p className="text-base-content/50 text-sm mt-1">
              Choose a strong new password for your account
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div role="status" className="alert alert-success alert-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div role="alert" className="alert alert-error alert-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form (hide after success) */}
          {!message ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              {/* New Password */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">New password</span>
                </div>
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="grow bg-transparent outline-none"
                    placeholder="••••••••"
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

              {/* Confirm Password */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-medium">Confirm new password</span>
                </div>
                <label className={`input input-bordered flex items-center gap-3 focus-within:input-primary ${passwordsMismatch ? 'input-error' : ''} ${passwordsMatch ? 'input-success' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="grow bg-transparent outline-none"
                    placeholder="••••••••"
                  />
                  {/* Match indicator */}
                  {passwordsMatch && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {passwordsMismatch && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </label>
                {passwordsMismatch && (
                  <p className="text-xs text-error mt-1">Passwords do not match</p>
                )}
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Resetting…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Set new password
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success — show login button */
            <div className="mt-4">
              <Link to="/login" className="btn btn-primary w-full gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Go to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
