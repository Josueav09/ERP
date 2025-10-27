// import React from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Mail, Phone, Calendar } from 'lucide-react';

// const ClienteEjecutivaPage: React.FC = () => {
//   const { user } = useAuth();

//   const navItems = [
//     { label: "Mi Progreso", icon: <div>📊</div>, href: "/dashboard/empresa" },
//     { label: "Mi Ejecutiva", icon: <div>👤</div>, href: "/dashboard/empresa/ejecutiva" },
//     { label: "Actividades", icon: <div>📋</div>, href: "/dashboard/empresa/actividades" },
//   ];

//   // Datos de ejemplo - luego conectar con servicio
//   const ejecutivaInfo = {
//     nombre: "María González",
//     email: "maria.gonzalez@growvia.com",
//     telefono: "+56 9 1234 5678",
//     especialidad: "Onboarding y Desarrollo de Negocio",
//     experiencia: "3 años en Growvia",
//     ultimoContacto: "2024-01-15"
//   };

//   return (
//     <DashboardLayout 
//       navItems={navItems} 
//       title="Mi Ejecutiva de Cuenta" 
//       subtitle="Información de contacto y seguimiento"
//     >
//       <div className="space-y-6">
//         {/* Tarjeta de Información */}
//         <Card className="bg-gradient-to-r from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//           <div className="flex items-start gap-6">
//             <div className="w-20 h-20 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
//               <span className="text-2xl font-bold text-[#013936]">
//                 {ejecutivaInfo.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
//               </span>
//             </div>
            
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-white mb-2">{ejecutivaInfo.nombre}</h2>
//               <p className="text-[#C7E196] mb-4">{ejecutivaInfo.especialidad}</p>
              
//               <div className="grid gap-3 md:grid-cols-2">
//                 <div className="flex items-center gap-2 text-white/80">
//                   <Mail className="w-4 h-4" />
//                   <span>{ejecutivaInfo.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-white/80">
//                   <Phone className="w-4 h-4" />
//                   <span>{ejecutivaInfo.telefono}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-white/80">
//                   <Calendar className="w-4 h-4" />
//                   <span>Experiencia: {ejecutivaInfo.experiencia}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-white/80">
//                   <Calendar className="w-4 h-4" />
//                   <span>Último contacto: {new Date(ejecutivaInfo.ultimoContacto).toLocaleDateString('es-ES')}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Acciones Rápidas */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <Button 
//             className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 h-16"
//             onClick={() => window.location.href = `mailto:${ejecutivaInfo.email}`}
//           >
//             <Mail className="w-5 h-5 mr-2" />
//             Enviar Email
//           </Button>
          
//           <Button 
//             className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-16"
//             onClick={() => window.location.href = `tel:${ejecutivaInfo.telefono}`}
//           >
//             <Phone className="w-5 h-5 mr-2" />
//             Llamar
//           </Button>
          
//           <Button 
//             className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-16"
//             onClick={() => window.location.href = `https://wa.me/${ejecutivaInfo.telefono.replace(/\D/g, '')}`}
//           >
//             <div className="w-5 h-5 mr-2">💬</div>
//             WhatsApp
//           </Button>
//         </div>

//         {/* Información Adicional */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//           <h3 className="text-lg font-semibold text-white mb-4">Horarios de Contacto</h3>
//           <div className="grid gap-4 md:grid-cols-2 text-white/80">
//             <div>
//               <p className="font-semibold">Lunes - Viernes</p>
//               <p>9:00 - 18:00 hrs</p>
//             </div>
//             <div>
//               <p className="font-semibold">Sábados</p>
//               <p>10:00 - 14:00 hrs</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ClienteEjecutivaPage;

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Activity, 
  Users,
  Star,
  Award,
  Clock,
  MessageCircle
} from 'lucide-react';
import { clienteService } from '@/services/clienteService';
import { useToast } from '@/hooks/useToast';

interface EjecutivaInfo {
  ejecutiva: {
    nombre_completo: string;
    correo: string;
    telefono: string;
    linkedin?: string;
    especialidad: string;
    experiencia: string;
    fecha_asignacion: string;
  };
  estadisticas: {
    clientes_activos: number;
    tasa_conversion: string;
    ventas_ganadas: number;
    tiempo_respuesta: string;
  };
  proxima_reunion?: {
    fecha: string;
    tipo: string;
    descripcion: string;
  };
}

const ClienteEjecutivaPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ejecutivaInfo, setEjecutivaInfo] = useState<EjecutivaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { label: "Dashboard", icon: <Activity className="w-5 h-5" />, href: "/dashboard/empresa" },
    { label: "Mi Ejecutiva", icon: <User className="w-5 h-5" />, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <Calendar className="w-5 h-5" />, href: "/dashboard/empresa/actividades" },
    { label: "Perfil", icon: <Users className="w-5 h-5" />, href: "/dashboard/empresa/perfil" },
  ];

  useEffect(() => {
    fetchEjecutivaInfo();
  }, [user]);

  const fetchEjecutivaInfo = async () => {
    try {
      setLoading(true);
      console.log('🔄 [ClienteEjecutivaPage] Cargando información de ejecutiva...');

      const clienteUsuarioId = user?.id || '1';
      const data = await clienteService.getEjecutivaInfo(clienteUsuarioId);
      
      setEjecutivaInfo(data);
      console.log('✅ [ClienteEjecutivaPage] Información de ejecutiva cargada', data);
    } catch (error) {
      console.error('❌ [ClienteEjecutivaPage] Error cargando información:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de tu ejecutiva",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContact = (type: 'email' | 'phone' | 'whatsapp') => {
    if (!ejecutivaInfo) return;

    const { ejecutiva } = ejecutivaInfo;

    switch (type) {
      case 'email':
        window.location.href = `mailto:${ejecutiva.correo}`;
        break;
      case 'phone':
        window.location.href = `tel:${ejecutiva.telefono}`;
        break;
      case 'whatsapp':
        const phoneNumber = ejecutiva.telefono.replace(/\D/g, '');
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
        break;
    }
  };

  if (loading) {
    return (
      <DashboardLayout 
        navItems={navItems} 
        title="Mi Ejecutiva de Cuenta" 
        subtitle="Cargando información..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      navItems={navItems} 
      title="Mi Ejecutiva de Cuenta" 
      subtitle="Tu contacto directo para el crecimiento de tu negocio"
    >
      <div className="space-y-6">
        {/* Tarjeta Principal de Información */}
        {ejecutivaInfo && (
          <Card className="bg-gradient-to-r from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Avatar e Información Básica */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#013936]">
                      {getInitials(ejecutivaInfo.ejecutiva.nombre_completo)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{ejecutivaInfo.ejecutiva.nombre_completo}</h2>
                      <Badge className="bg-[#C7E196] text-[#013936]">
                        <Star className="w-3 h-3 mr-1" />
                        Ejecutiva Certificada
                      </Badge>
                    </div>
                    
                    <p className="text-[#C7E196] text-lg mb-4">{ejecutivaInfo.ejecutiva.especialidad}</p>
                    
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-white/80">
                        <Mail className="w-4 h-4" />
                        <span>{ejecutivaInfo.ejecutiva.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Phone className="w-4 h-4" />
                        <span>{ejecutivaInfo.ejecutiva.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Award className="w-4 h-4" />
                        <span>{ejecutivaInfo.ejecutiva.experiencia}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span>Asignada desde: {new Date(ejecutivaInfo.ejecutiva.fecha_asignacion).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="bg-white/10 rounded-lg p-4 min-w-[200px]">
                  <h3 className="text-white font-semibold mb-3 text-center">Estadísticas</h3>
                  <div className="space-y-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#C7E196]">{ejecutivaInfo.estadisticas.clientes_activos}</p>
                      <p className="text-white/60 text-sm">Clientes Activos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#C7E196]">{ejecutivaInfo.estadisticas.tasa_conversion}</p>
                      <p className="text-white/60 text-sm">Tasa Conversión</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#C7E196]">{ejecutivaInfo.estadisticas.ventas_ganadas}</p>
                      <p className="text-white/60 text-sm">Ventas Ganadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones Rápidas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 h-16 text-lg font-semibold"
            onClick={() => handleContact('email')}
          >
            <Mail className="w-5 h-5 mr-2" />
            Enviar Email
          </Button>
          
          <Button 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-16 text-lg font-semibold"
            onClick={() => handleContact('phone')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar Ahora
          </Button>
          
          <Button 
            className="bg-green-600 text-white hover:bg-green-700 h-16 text-lg font-semibold"
            onClick={() => handleContact('whatsapp')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>

        {/* Información Adicional */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Próxima Reunión */}
          {ejecutivaInfo?.proxima_reunion && (
            <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próxima Reunión
                </CardTitle>
                <CardDescription className="text-white/60">
                  Tu siguiente contacto programado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Fecha:</span>
                    <Badge variant="outline" className="text-[#C7E196] border-[#C7E196]">
                      {new Date(ejecutivaInfo.proxima_reunion.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Tipo:</span>
                    <span className="text-white">{ejecutivaInfo.proxima_reunion.tipo}</span>
                  </div>
                  <div>
                    <span className="text-white/80 block mb-1">Descripción:</span>
                    <p className="text-white">{ejecutivaInfo.proxima_reunion.descripcion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Horarios de Contacto */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios de Contacto
              </CardTitle>
              <CardDescription className="text-white/60">
                Mejores horarios para comunicarte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/80">Lunes - Viernes</span>
                  <span className="text-white font-medium">9:00 - 18:00 hrs</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/80">Sábados</span>
                  <span className="text-white font-medium">10:00 - 14:00 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Tiempo Respuesta</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    {ejecutivaInfo?.estadisticas.tiempo_respuesta || '< 2 horas'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Especialidades y Servicios */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Especialidades y Servicios</CardTitle>
            <CardDescription className="text-white/60">
              Áreas en las que tu ejecutiva puede ayudarte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-[#C7E196] rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-[#013936]" />
                </div>
                <h4 className="text-white font-semibold">Onboarding</h4>
                <p className="text-white/60 text-sm">Implementación inicial</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-[#C7E196] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-[#013936]" />
                </div>
                <h4 className="text-white font-semibold">Desarrollo</h4>
                <p className="text-white/60 text-sm">Crecimiento de negocio</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-[#C7E196] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-[#013936]" />
                </div>
                <h4 className="text-white font-semibold">Optimización</h4>
                <p className="text-white/60 text-sm">Mejora continua</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="w-12 h-12 bg-[#C7E196] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-[#013936]" />
                </div>
                <h4 className="text-white font-semibold">Soporte</h4>
                <p className="text-white/60 text-sm">Atención personalizada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClienteEjecutivaPage;