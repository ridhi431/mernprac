import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = ({ onDesktopToggle }) => {
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
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4">
      {/* LEFT - Hamburger (mobile, drawer toggle) + Logo */}
      <div className="navbar-start gap-1">
        <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle btn-sm sm:btn-md lg:hidden" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
        <Link to="/" className="btn btn-ghost text-lg sm:text-xl font-extrabold px-1 sm:px-4">
          DevFolio
        </Link>
      </div>

      {/* CENTER - only when logged in, desktop */}
      {token && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 font-medium">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/my-portfolios">My Portfolios</Link></li>
          </ul>
        </div>
      )}

      {/* RIGHT - conditional based on login state */}
      <div className="navbar-end gap-1.5 sm:gap-2">
        {token ? (
          <>
            {/* Desktop direct logout button */}
            <button onClick={handleLogout} className="btn btn-secondary btn-sm hidden md:inline-flex">
              Logout
            </button>
            <Link to="/create-portfolio" className="btn btn-primary btn-sm">
              <span className="hidden sm:inline">+ Create Portfolio</span>
              <span className="sm:hidden">+ Create</span>
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md">
                <div className="w-8 sm:w-10 rounded-full ring-1 ring-primary/30">
                  {photo ? (
                    <img src={photo} alt="profile" />
                  ) : (
                    <div className="bg-neutral text-neutral-content flex items-center justify-center w-full h-full text-xs sm:text-sm">
                      👤
                    </div>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-300">
                <li className="lg:hidden"><Link to="/dashboard">📊 Dashboard</Link></li>
                <li className="lg:hidden"><Link to="/my-portfolios">📂 My Portfolios</Link></li>
                <li><Link to="/profile">📄 My Profile</Link></li>
                <li><Link to="/settings">⚙️ Settings</Link></li>
                <div className="divider my-1 md:hidden"></div>
                <li className="md:hidden">
                  <button onClick={handleLogout} className="text-error font-medium">🚪 Logout</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">Get Started</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;