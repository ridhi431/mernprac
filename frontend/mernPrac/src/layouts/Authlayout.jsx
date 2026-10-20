import { Outlet } from 'react-router-dom';

const Authlayout = () => {
  return (
    <div className="min-h-screen bg-base-200/60 flex flex-col justify-between items-center relative overflow-hidden py-8 px-4">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Page Content */}
      <div className="w-full flex items-center justify-center my-auto relative z-10">
        <Outlet />
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-base-content/40 mt-6 relative z-10">
        DevFolio • The Developer Portfolio Builder
      </div>
    </div>
  );
};

export default Authlayout;