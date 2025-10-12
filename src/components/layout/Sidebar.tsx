import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface MenuItem {
  icon: string;
  label: string;
  path: string;
  roles: (UserRole | 'all')[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', roles: ['all'] },
    { icon: '📦', label: 'Auditoria', path: '/jefe/auditoria', roles: ['admin', 'jefe', 'ejecutiva', 'desarrollador'] },
    { icon: '📢', label: 'Marketing', path: '/marketing', roles: ['admin', 'jefe', 'ejecutiva'] },
    { icon: '💼', label: 'Ventas', path: '/sales', roles: ['admin', 'jefe', 'ejecutiva'] },
    { icon: '📈', label: 'Reportes', path: '/reports', roles: ['all'] },
    { icon: '👤', label: 'Mi Desempeño', path: '/performance', roles: ['admin', 'jefe', 'ejecutiva'] },
    { icon: '📚', label: 'Capacitación', path: '/learning', roles: ['all'] },
    { icon: '👥', label: 'Usuarios', path: '/users', roles: ['admin', 'jefe'] },
  ];

  const hasAccess = (item: MenuItem): boolean => {
    if (item.roles.includes('all')) return true;
    return user ? item.roles.includes(user.role) : false;
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-primary min-h-screen p-6 shadow-lg">
      <div className="space-y-2">
        {menuItems.map((item) => {
          if (!hasAccess(item)) return null;

          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-primary-dark text-accent shadow-md scale-105'
                  : 'text-accent-light hover:bg-primary-dark hover:text-accent'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User info at bottom */}
      <div className="mt-8 pt-6 border-t border-primary-dark">
        <div className="text-accent-light text-sm space-y-1">
          <p className="font-semibold">Sesión activa</p>
          <p className="text-xs opacity-75">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Version info */}
      <div className="mt-4 text-accent-light text-xs text-center opacity-50">
        <p>ERP System v1.0.0</p>
        <p>© 2024 - Todos los derechos reservados</p>
      </div>
    </aside>
  );
};

export default Sidebar;