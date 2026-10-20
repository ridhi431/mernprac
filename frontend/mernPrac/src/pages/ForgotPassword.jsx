import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Forgot password?</h2>
            <p className="text-base-content/50 text-sm mt-1">
              No worries! Enter your email and we'll send you a reset link.
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Email address</span>
              </div>
              <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow bg-transparent outline-none"
                  placeholder="you@example.com"
                />
              </label>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending…
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send reset link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="divider text-xs text-base-content/40 my-4">OR</div>
          <Link to="/login" className="btn btn-ghost btn-sm w-full gap-2 text-base-content/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
