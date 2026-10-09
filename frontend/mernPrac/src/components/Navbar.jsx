import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

    const [photo, setPhoto] = useState('');

  useEffect(() => {
    if (!token) return;

    const loadPhoto = () => {
      axios
        .get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setPhoto(res.data.photo || ''))
        .catch(() => {});
    };

    loadPhoto();
    // Refresh when the profile page saves
    window.addEventListener('profile-updated', loadPhoto);
    return () => window.removeEventListener('profile-updated', loadPhoto);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      {/* LEFT - Hamburger (mobile, drawer toggle) + Logo */}
      <div className="navbar-start">
        {token && (
          <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
        )}
        <Link to="/" className="btn btn-ghost text-xl font-extrabold">
          PortfolioGen
        </Link>
      </div>

      {/* CENTER - only when logged in, desktop */}
      {token && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/my-portfolios">My Portfolios</Link></li>
          </ul>
        </div>
      )}

      {/* RIGHT - conditional based on login state */}
      <div className="navbar-end gap-2">
        {token ? (
          <>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
            <Link to="/create-portfolio" className="btn btn-primary btn-sm">
              + Create Portfolio
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={photo} alt="profile" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                <li><Link to="/profile">My Profile</Link></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;