import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md bg-base-100 p-8 shadow-xl">
        <h1 className="mb-4 text-2xl font-bold">Forgot password</h1>

        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          placeholder="you@example.com"
        />

        <button type="submit" className="btn btn-primary mt-4">
          Send reset link
        </button>

        {message && <p role="status" className="mt-3">{message}</p>}
        {error && <p role="alert" className="mt-3 text-error">{error}</p>}

        <Link to="/login" className="link link-primary mt-4">
          Back to login
        </Link>
      </form>
    </div>
  );
}