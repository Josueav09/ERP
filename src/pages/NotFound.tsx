import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-dark">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Volver Atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;