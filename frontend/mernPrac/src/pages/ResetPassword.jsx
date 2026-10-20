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

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 p-8 shadow-xl"
      >
        <h1 className="mb-4 text-2xl font-bold">Reset password</h1>

        <label htmlFor="password" className="label">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
        />

        <label htmlFor="confirmPassword" className="label mt-3">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input input-bordered w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary mt-5 w-full"
        >
          {loading ? 'Resetting…' : 'Set new password'}
        </button>

        {message && (
          <p role="status" className="mt-4 text-success">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-error">
            {error}
          </p>
        )}

        {message && (
          <Link to="/login" className="link link-primary mt-4">
            Go to login
          </Link>
        )}
      </form>
    </div>
  );
}