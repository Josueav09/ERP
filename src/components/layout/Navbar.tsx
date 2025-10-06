import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-semibold text-emerald-800">ERP</div>
        <div className="flex items-center gap-4">User</div>
      </div>
    </header>
  );
};

export default Navbar;
