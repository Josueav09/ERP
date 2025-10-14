import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar } from 'lucide-react';

const ClienteEjecutivaPage: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: "Mi Progreso", icon: <div>📊</div>, href: "/dashboard/cliente" },
    { label: "Mi Ejecutiva", icon: <div>👤</div>, href: "/dashboard/cliente/ejecutiva" },
    { label: "Actividades", icon: <div>📋</div>, href: "/dashboard/cliente/actividades" },
  ];

  // Datos de ejemplo - luego conectar con servicio
  const ejecutivaInfo = {
    nombre: "María González",
    email: "maria.gonzalez@growvia.com",
    telefono: "+56 9 1234 5678",
    especialidad: "Onboarding y Desarrollo de Negocio",
    experiencia: "3 años en Growvia",
    ultimoContacto: "2024-01-15"
  };

  return (
    <DashboardLayout 
      navItems={navItems} 
      title="Mi Ejecutiva de Cuenta" 
      subtitle="Información de contacto y seguimiento"
    >
      <div className="space-y-6">
        {/* Tarjeta de Información */}
        <Card className="bg-gradient-to-r from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#013936]">
                {ejecutivaInfo.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{ejecutivaInfo.nombre}</h2>
              <p className="text-[#C7E196] mb-4">{ejecutivaInfo.especialidad}</p>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Mail className="w-4 h-4" />
                  <span>{ejecutivaInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Phone className="w-4 h-4" />
                  <span>{ejecutivaInfo.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>Experiencia: {ejecutivaInfo.experiencia}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4" />
                  <span>Último contacto: {new Date(ejecutivaInfo.ultimoContacto).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Acciones Rápidas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 h-16"
            onClick={() => window.location.href = `mailto:${ejecutivaInfo.email}`}
          >
            <Mail className="w-5 h-5 mr-2" />
            Enviar Email
          </Button>
          
          <Button 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-16"
            onClick={() => window.location.href = `tel:${ejecutivaInfo.telefono}`}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar
          </Button>
          
          <Button 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-16"
            onClick={() => window.location.href = `https://wa.me/${ejecutivaInfo.telefono.replace(/\D/g, '')}`}
          >
            <div className="w-5 h-5 mr-2">💬</div>
            WhatsApp
          </Button>
        </div>

        {/* Información Adicional */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Horarios de Contacto</h3>
          <div className="grid gap-4 md:grid-cols-2 text-white/80">
            <div>
              <p className="font-semibold">Lunes - Viernes</p>
              <p>9:00 - 18:00 hrs</p>
            </div>
            <div>
              <p className="font-semibold">Sábados</p>
              <p>10:00 - 14:00 hrs</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClienteEjecutivaPage;