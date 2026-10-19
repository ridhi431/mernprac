import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useSettings();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', formData);

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-8">
      <div className="card w-full max-w-sm sm:max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 sm:p-8">
          <h2 className="card-title justify-center text-2xl font-bold">{t.signup}</h2>

        {error && (
  <div role="alert" className="alert alert-warning">
    <span>{error}</span>
  </div>
)}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder={t.name}
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t.email}
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t.password}
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              {t.signup}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            {t.alreadyAccount} <Link to="/login" className="link link-primary">{t.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
