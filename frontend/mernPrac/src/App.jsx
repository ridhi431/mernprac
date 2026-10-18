import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Mainlayout from './layouts/Mainlayout';
import Authlayout from './layouts/Authlayout';
import Dashboardlayout from './layouts/Dashboardlayout';
import Protectedroute from './components/Protectedroute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreatePortfolio from './pages/CreatePortfolio';
import SectionPage from './pages/SectionPage';
import MyPortfolios from './pages/MyPortfolio';
import PublicPortfolio from './pages/PublicPortfolio';
import { PortfolioProvider } from './context/PortfolioContext';
import PortfolioPreview from './pages/PortfolioPreview';
import Profile from './pages/Profile';
import EditPortfolio from './pages/EditPortfolio';
import { Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import Settings from './pages/TempSettings';

function App() {
  return (
    <BrowserRouter>
      
        <PortfolioProvider>
          <SettingsProvider>
        <Routes>
          {/* Public pages - Navbar + Footer */}
          <Route element={<Mainlayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Auth pages - minimal */}
          <Route element={<Authlayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Published portfolio website: public, no layout, no login */}
          <Route path="/p/:slug" element={<PublicPortfolio />} />

          {/* Protected pages */}
          <Route element={<Protectedroute />}>
            {/* Navbar + Sidebar + Footer */}
            <Route element={<Dashboardlayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-portfolios" element={<MyPortfolios />} />
              <Route path="/portfolio/edit/:id" element={<EditPortfolio />} />
              <Route path="/create-portfolio" element={<CreatePortfolio />} />
              <Route path="/create-portfolio/:section" element={<SectionPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Protected, bina sidebar */}
            <Route path="/preview" element={<PortfolioPreview />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </SettingsProvider>
      </PortfolioProvider>
    </BrowserRouter>

  );
}

export default App;