import React from 'react';
import { useNavigation } from './context/NavigationContext';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const AppRouter: React.FC = () => {
  const { currentPage } = useNavigation();
  const { isAuthenticated } = useAuth();
//agregar loading
//   if (loading) return (
//     <div className="flex items-center justify-center h-screen bg-[#0A332C]">
//       <div className="text-[#B5E385] text-xl">Cargando...</div>
//     </div>
//   );

  if (!isAuthenticated && currentPage !== 'login') {
    return <Login />;
  }

  if (currentPage === 'login') return <Login />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
};

export default AppRouter;
