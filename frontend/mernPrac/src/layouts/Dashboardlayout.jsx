// DashboardLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  // sirf lg+ ke liye: sidebar side mein open hai ya nahi
  const [desktopOpen, setDesktopOpen] = useState(true);

  return (
    <div className={`drawer ${desktopOpen ? 'lg:drawer-open' : ''}`}>
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col min-h-screen">
        <Navbar onDesktopToggle={() => setDesktopOpen((o) => !o)} />
        <main className="flex-1 p-4 min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Sidebar (drawer side) */}
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;