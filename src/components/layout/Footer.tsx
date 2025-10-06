import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">© {new Date().getFullYear()} ERP</div>
    </footer>
  );
};

export default Footer;
