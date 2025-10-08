import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-light opacity-10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default AuthLayout;