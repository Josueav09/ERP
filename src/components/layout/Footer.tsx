import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div>
          <p>© 2024 ERP System. Todos los derechos reservados.</p>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-primary transition">
            Términos de Servicio
          </a>
          <a href="#" className="hover:text-primary transition">
            Política de Privacidad
          </a>
          <a href="#" className="hover:text-primary transition">
            Soporte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;