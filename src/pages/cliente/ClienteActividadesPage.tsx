import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';

const ClienteActividadesPage: React.FC = () => {
  const navItems = [
    { label: "Mi Progreso", icon: <div>📊</div>, href: "/dashboard/empresa" },
    { label: "Mi Ejecutiva", icon: <div>👤</div>, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <div>📋</div>, href: "/dashboard/empresa/actividades" },
  ];

  return (
    <DashboardLayout 
      navItems={navItems} 
      title="Mis Actividades" 
      subtitle="Gestión y seguimiento de actividades"
    >
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Página en Desarrollo</h3>
          <p className="text-white/60">
            Esta sección estará disponible próximamente para gestionar tus actividades.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ClienteActividadesPage;