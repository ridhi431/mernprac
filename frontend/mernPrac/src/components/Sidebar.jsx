import { Link, useNavigate } from 'react-router-dom';

const closeDrawer = () => {
  const drawer = document.getElementById('dashboard-drawer');
  if (drawer) drawer.checked = false;
};

const Sidebar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    closeDrawer();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <ul className="menu bg-base-200 min-h-full w-64 sm:w-72 p-4 gap-1 text-sm sm:text-base border-r border-base-300">
      <div className="flex items-center justify-between px-2 py-3 mb-2 border-b border-base-300">
        <Link to="/" onClick={closeDrawer} className="font-extrabold text-xl">DevFolio</Link>
        <button onClick={closeDrawer} className="btn btn-ghost btn-circle btn-xs lg:hidden" aria-label="Close menu">✕</button>
      </div>

      {token ? (
        <>
          <li className="menu-title text-xs tracking-wider opacity-60">PORTFOLIOS</li>
          <li><Link to="/dashboard" onClick={closeDrawer}>📊 Dashboard</Link></li>
          <li><Link to="/my-portfolios" onClick={closeDrawer}>📂 My Portfolios</Link></li>
          <li><Link to="/create-portfolio" onClick={closeDrawer}>✨ Create Portfolio</Link></li>
          <div className="divider my-2"></div>
          <li className="menu-title text-xs tracking-wider opacity-60">ACCOUNT</li>
          <li><Link to="/profile" onClick={closeDrawer}>👤 My Profile</Link></li>
          <li><Link to="/settings" onClick={closeDrawer}>⚙️ Settings</Link></li>
          <div className="divider my-2"></div>
          <li><button onClick={handleLogout} className="text-error font-medium">🚪 Logout</button></li>
        </>
      ) : (
        <>
          <li className="menu-title text-xs tracking-wider opacity-60">MENU</li>
          <li><Link to="/" onClick={closeDrawer}>🏠 Home</Link></li>
          <li><Link to="/login" onClick={closeDrawer}>🔑 Login</Link></li>
          <li><Link to="/signup" onClick={closeDrawer}>🚀 Get Started</Link></li>
        </>
      )}
    </ul>
  );
};

export default Sidebar;