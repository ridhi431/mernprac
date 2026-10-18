import { Link } from 'react-router-dom';

const closeDrawer = () => {
  const drawer = document.getElementById('dashboard-drawer');
  if (drawer) drawer.checked = false;
};

const Sidebar = () => (
  <ul className="menu bg-base-200 min-h-full w-64 p-4 gap-1 text-sm sm:text-base">
    <li className="menu-title text-xs tracking-wider opacity-60">PORTFOLIOS</li>
    <li><Link to="/dashboard" onClick={closeDrawer}>📊 Dashboard</Link></li>
    <li><Link to="/my-portfolios" onClick={closeDrawer}>📂 My Portfolios</Link></li>
    <li><Link to="/create-portfolio" onClick={closeDrawer}>✨ Create Portfolio</Link></li>
    <div className="divider my-2"></div>
    <li className="menu-title text-xs tracking-wider opacity-60">ACCOUNT</li>
    <li><Link to="/profile" onClick={closeDrawer}>👤 My Profile</Link></li>
    <li><Link to="/settings" onClick={closeDrawer}>⚙️ Settings</Link></li>
  </ul>
);

export default Sidebar;