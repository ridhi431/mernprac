import { Link } from 'react-router-dom';

const Sidebar = () => (
  <ul className="menu bg-base-200 min-h-full w-64 p-4 gap-1">
    <li><Link to="/dashboard">Dashboard</Link></li>
    <li><Link to="/my-portfolios">My Portfolios</Link></li>

  </ul>
);

export default Sidebar;