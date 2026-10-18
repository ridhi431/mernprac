import { useSettings } from './context/SettingsContext';

function WebsiteLayout({ children }) {
  const { theme } = useSettings();

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-base-200 text-base-content"
    >
      {/* Navbar, sidebar and website pages */}
      {children}
    </div>
  );
}

export default WebsiteLayout;