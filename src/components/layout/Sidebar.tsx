import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        <Link to="/" className="text-sm text-gray-700">Dashboard</Link>
        <Link to="/products" className="text-sm text-gray-700">Products</Link>
        <Link to="/marketing" className="text-sm text-gray-700">Marketing</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
