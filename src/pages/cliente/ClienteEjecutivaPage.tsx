// frontend/src/pages/empresa/EquipoPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, User, Award, Star, Target, TrendingUp, BookOpen,
  Activity, Calendar, Filter, Mail, Phone, Linkedin,
  BarChart3
} from "lucide-react";
import { clienteService, ClienteReal, EjecutivaCompleta } from "@/services/clienteService";

interface Certificacion {
  id: number;
  nombre: string;
  institucion: string;
  fecha_obtencion: string;
  nivel: string;
}

interface EmbudoVentas {
  etapa: string;
  cantidad: number;
  tasa_conversion: string;
  monto_potencial: number;
}

interface EquipoStats {
  totalEjecutivas: number;
  totalClientes: number;
  ventasTotales: number;
  pipelineTotal: number;
  actividadesMes: number;
  conversionPromedio: string;
}

export default function ProveedorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ejecutivas, setEjecutivas] = useState<EjecutivaCompleta[]>([]);
  const [ejecutivaSeleccionada, setEjecutivaSeleccionada] = useState<EjecutivaCompleta | null>(null);
  const [clientesRecientes, setClientesRecientes] = useState<ClienteReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipoStats, setEquipoStats] = useState<EquipoStats>({
    totalEjecutivas: 0,
    totalClientes: 0,
    ventasTotales: 0,
    pipelineTotal: 0,
    actividadesMes: 0,
    conversionPromedio: '0%'
  });

  useEffect(() => {
    if (!user || user.role !== "empresa") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empresaId = user!.id.toString();
      

      // Obtener TODAS las ejecutivas de la empresa
      const todasEjecutivas = await clienteService.getEjecutivasByEmpresa(empresaId);

      // Obtener estadísticas del equipo
      const stats = await getEquipoStats(empresaId, todasEjecutivas);
      setEquipoStats(stats);

      // Obtener clientes recientes
      const clientes = await clienteService.getClientesRecientes(empresaId);
      setClientesRecientes(clientes);

      // Agregar certificaciones en español para las ejecutivas
      const ejecutivasConCertificaciones = todasEjecutivas.map(ejecutiva => ({
        ...ejecutiva,
        certificaciones: ejecutiva.certificaciones.length > 0 ? ejecutiva.certificaciones : [
          {
            id: 1,
            nombre: "Ventas Consultivas B2B",
            institucion: "Cámara de Comercio de Lima",
            fecha_obtencion: "2024-03-15",
            nivel: "Avanzado"
          },
          {
            id: 2,
            nombre: "Gestión de Cartera de Clientes",
            institucion: "Universidad ESAN",
            fecha_obtencion: "2024-06-20",
            nivel: "Intermedio"
          },
          {
            id: 3,
            nombre: "Técnicas de Negociación Comercial",
            institucion: "Instituto Peruano de Marketing",
            fecha_obtencion: "2024-01-10",
            nivel: "Avanzado"
          },
          {
            id: 4,
            nombre: "CRM y Automatización de Ventas",
            institucion: "Asociación de Ejecutivos de Ventas",
            fecha_obtencion: "2024-08-05",
            nivel: "Intermedio"
          }
        ]
      }));

      setEjecutivas(ejecutivasConCertificaciones);
      
      // Seleccionar la primera ejecutiva por defecto si existe
      if (ejecutivasConCertificaciones.length > 0) {
        setEjecutivaSeleccionada(ejecutivasConCertificaciones[0]);
      } else {
        setEjecutivaSeleccionada(null);
      }

    } catch (error) {
      setEjecutivas([]);
      setEjecutivaSeleccionada(null);
    } finally {
      setLoading(false);
    }
  };

  const getEquipoStats = async (empresaId: string, ejecutivas: EjecutivaCompleta[]): Promise<EquipoStats> => {
    try {
      const totalEjecutivas = ejecutivas.length;
      const totalClientes = ejecutivas.reduce((sum, e) => sum + e.clientesAsignados, 0);
      const ventasTotales = ejecutivas.reduce((sum, e) => sum + e.ventasMes, 0);
      const actividadesMes = ejecutivas.reduce((sum, e) => sum + e.clientesPotenciales, 0);
      const conversionPromedio = ejecutivas.length > 0 
        ? Math.round(ejecutivas.reduce((sum, e) => sum + e.tasaConversion, 0) / ejecutivas.length)
        : 0;

      return {
        totalEjecutivas,
        totalClientes,
        ventasTotales,
        pipelineTotal: actividadesMes * 2, // Estimado
        actividadesMes,
        conversionPromedio: `${conversionPromedio}%`
      };
    } catch (error) {
      return {
        totalEjecutivas: 0,
        totalClientes: 0,
        ventasTotales: 0,
        pipelineTotal: 0,
        actividadesMes: 0,
        conversionPromedio: '0%'
      };
    }
  };

  const navItems = [
    { label: "Dashboard", icon: <Activity className="w-5 h-5" />, href: "/dashboard/empresa" },
    { label: "Mi Equipo", icon: <Users className="w-5 h-5" />, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <Calendar className="w-5 h-5" />, href: "/dashboard/empresa/actividades" },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEjecutivaChange = (ejecutivaId: string) => {
    const ejecutiva = ejecutivas.find(e => e.id_ejecutiva.toString() === ejecutivaId);
    if (ejecutiva) {
      setEjecutivaSeleccionada(ejecutiva);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Cargando información del equipo...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      title="Mi Equipo de Ejecutivas"
      subtitle="Especialistas dedicados a tu crecimiento"
    >

      <div className="space-y-8">
        {/* Resumen del Equipo - MANTENIENDO EL DISEÑO ORIGINAL */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Resumen del Equipo
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Métricas consolidadas de todo tu equipo comercial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-[#C7E196]">
                  {equipoStats.totalEjecutivas}
                </p>
                <p className="text-white/60 text-sm">Total Ejecutivas</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-[#C7E196]">
                  ${(equipoStats.ventasTotales / 1000).toFixed(0)}K
                </p>
                <p className="text-white/60 text-sm">Ventas Mensuales</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-[#C7E196]">
                  {equipoStats.totalClientes}
                </p>
                <p className="text-white/60 text-sm">Clientes Activos</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-[#C7E196]">
                  {equipoStats.conversionPromedio}
                </p>
                <p className="text-white/60 text-sm">Conversión Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Section con Selector */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              Detalle de Ejecutiva
            </h1>
            <p className="text-white/60 text-base">
              {ejecutivaSeleccionada 
                ? `Información completa de ${ejecutivaSeleccionada.nombre_completo} - ${ejecutivaSeleccionada.especialidad}`
                : 'Selecciona una ejecutiva para ver sus detalles completos'
              }
            </p>
          </div>

          {/* Selector de Ejecutiva */}
          <div className="w-full lg:w-80">
            <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Seleccionar Ejecutiva
            </label>
            <Select
              value={ejecutivaSeleccionada?.id_ejecutiva.toString()}
              onValueChange={handleEjecutivaChange}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white !h-12">
                <SelectValue placeholder="Selecciona una ejecutiva" />
              </SelectTrigger>
              <SelectContent className="bg-[#024a46] border-[#C7E196]/20">
                {ejecutivas.map((ejecutiva) => (
                  <SelectItem
                    key={ejecutiva.id_ejecutiva}
                    value={ejecutiva.id_ejecutiva.toString()}
                    className="text-white hover:bg-white/10 focus:bg-white/10 focus:!text-[#013936]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#013936]">
                          {getInitials(ejecutiva.nombre_completo)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{ejecutiva.nombre_completo}</div>
                        <div className="text-white/60 text-xs truncate">{ejecutiva.especialidad}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mensaje si no hay ejecutivas */}
        {ejecutivas.length === 0 && (
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">No hay ejecutivas asignadas</h3>
              <p className="text-white/60 text-base max-w-md mx-auto">
                Actualmente no tienes ejecutivas asignadas a tu empresa. 
                Contacta con el administrador para asignar profesionales a tu equipo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ejecutiva Seleccionada - DISEÑO EXPANDIDO Y MEJORADO */}
        {ejecutivaSeleccionada && (
          <div className="space-y-6">
            {/* Tarjeta Principal de Información */}
            <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar y Información Básica */}
                  <div className="flex flex-col items-center lg:items-start gap-4 lg:w-1/4">
                    <div className="w-20 h-20 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-[#013936]">
                        {getInitials(ejecutivaSeleccionada.nombre_completo)}
                      </span>
                    </div>
                    <div className="text-center lg:text-left">
                      <h3 className="text-lg font-bold text-white mb-1">{ejecutivaSeleccionada.nombre_completo}</h3>
                      <p className="text-[#C7E196] font-medium text-sm">{ejecutivaSeleccionada.especialidad}</p>
                      <div className="flex items-center gap-1 mt-2 justify-center lg:justify-start">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white/80 text-xs">Experta en ventas</span>
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto y Métricas */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de Contacto */}
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Información de Contacto
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-white/60" />
                          <span className="text-white/80 text-sm">{ejecutivaSeleccionada.correo}</span>
                        </div>
                        {ejecutivaSeleccionada.telefono && ejecutivaSeleccionada.telefono !== 'No disponible' && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm">{ejecutivaSeleccionada.telefono}</span>
                          </div>
                        )}
                        {ejecutivaSeleccionada.linkedin && (
                          <div className="flex items-center gap-3">
                            <Linkedin className="w-4 h-4 text-white/60" />
                            <a 
                              href={ejecutivaSeleccionada.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-white/80 text-sm hover:text-[#C7E196] transition-colors"
                            >
                              Ver perfil de LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Métricas Principales */}
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Métricas de Rendimiento
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-[#C7E196]">{ejecutivaSeleccionada.clientesAsignados}</p>
                          <p className="text-white/60 text-xs">Clientes Activos</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-[#C7E196]">${(ejecutivaSeleccionada.ventasMes / 1000).toFixed(0)}K</p>
                          <p className="text-white/60 text-xs">Ventas Mensuales</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-[#C7E196]">{ejecutivaSeleccionada.clientesPotenciales}</p>
                          <p className="text-white/60 text-xs">Prospectos</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <p className="text-lg font-bold text-[#C7E196]">{ejecutivaSeleccionada.tasaConversion}%</p>
                          <p className="text-white/60 text-xs">Tasa Conversión</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segunda Fila: Certificaciones y Embudo de Ventas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certificaciones Expandidas */}
                <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5 mb-3" />
                      Certificaciones y Especialidades
                    </CardTitle>
                    <CardDescription className="text-white/60 text-sm">
                      Credenciales profesionales de la ejecutiva
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ejecutivaSeleccionada.certificaciones.map((cert) => {
                        // Definir colores según el nivel
                        const getBadgeColor = (nivel: string) => {
                          switch (nivel.toLowerCase()) {
                            case 'avanzado':
                            case 'estratégico':
                            case 'directivo':
                              return {
                                bg: 'bg-green-500/20',
                                text: 'text-green-300',
                                border: 'border-green-400/30'
                              };
                            case 'intermedio':
                            case 'especialista':
                              return {
                                bg: 'bg-blue-500/20',
                                text: '!text-blue-600',
                                border: 'border-blue-400/30'
                              };
                            case 'básico':
                            case 'inicial':
                              return {
                                bg: 'bg-yellow-500/20',
                                text: 'text-yellow-300',
                                border: 'border-yellow-400/30'
                              };
                            default:
                              return {
                                bg: 'bg-[#C7E196]/20',
                                text: 'text-[#C7E196]',
                                border: 'border-[#C7E196]/30'
                              };
                          }
                        };

                        const badgeColors = getBadgeColor(cert.nivel);

                        return (
                          <div key={cert.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="p-2 bg-[#C7E196]/20 rounded">
                              <BookOpen className="w-4 h-4 text-[#C7E196]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h5 className="text-white font-medium text-sm">{cert.nombre}</h5>
                                <Badge 
                                  variant="outline" 
                                  className={`${badgeColors.bg} ${badgeColors.text} ${badgeColors.border} text-xs`}
                                >
                                  {cert.nivel}
                                </Badge>
                              </div>
                              <p className="text-white/60 text-xs mt-1">{cert.institucion}</p>
                              <p className="text-white/40 text-xs">Obtenido: {new Date(cert.fecha_obtencion).toLocaleDateString('es-PE')}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

              {/* Embudo de Ventas - MEJOR ALINEACIÓN Y DISEÑO DE MÉTRICAS */}
              <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 mb-3" />
                    Embudo de Ventas
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm mb-1">
                    Progreso actual del pipeline comercial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ejecutivaSeleccionada.embudoVentas.map((etapa, index) => {
                      const width = 100 - (index * 20);
                      return (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <div className="w-28 text-white/80 flex-shrink-0 text-sm font-medium">
                            {etapa.etapa}
                          </div>
                          <div className="flex-1 flex justify-center">
                            <div
                              className="h-8 flex items-center justify-center text-white font-medium text-sm transition-all duration-300 relative group"
                              style={{
                                width: `${width}%`,
                                backgroundColor: [
                                  '#6F9E2B', '#8CBD35', '#A9D45E', '#B2C48A', '#C7E196'
                                ][index] || '#6B7280',
                                borderRadius: '6px',
                                minWidth: '120px'
                              }}
                            >
                              <span className="group-hover:hidden">{etapa.cantidad}</span>
                              <span className="hidden group-hover:block text-xs whitespace-nowrap">
                                {etapa.cantidad} {etapa.cantidad === 1 ? 'oportunidad' : 'oportunidades'}
                              </span>
                            </div>
                          </div>
                          <div className="w-20 text-white/60 text-right flex-shrink-0 text-sm font-bold">
                            ${(etapa.monto_potencial / 1000).toFixed(0)}K
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Resumen del Embudo - DISEÑO MEJORADO PARA LLENAR ESPACIO */}
                  <div className="mt-7 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-[#C7E196] font-bold text-lg mb-1">
                          {ejecutivaSeleccionada.embudoVentas[ejecutivaSeleccionada.embudoVentas.length - 1]?.tasa_conversion}
                        </p>
                        <p className="text-white/60 text-xs">Conversión Final</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-[#C7E196] font-bold text-lg mb-1">
                          {ejecutivaSeleccionada.tasaConversion}%
                        </p>
                        <p className="text-white/60 text-xs">Tasa Personal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tercera Fila: Clientes de la Ejecutiva */}
            {clientesRecientes.filter(cliente => cliente.ejecutiva_nombre === ejecutivaSeleccionada.nombre_completo).length > 0 && (
              <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5" />
                    Clientes de {ejecutivaSeleccionada.nombre_completo.split(' ')[0]}
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
                    Portafolio de clientes gestionados activamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {clientesRecientes
                      .filter(cliente => cliente.ejecutiva_nombre === ejecutivaSeleccionada.nombre_completo)
                      .slice(0, 6)
                      .map((cliente) => (
                        <div key={cliente.id_cliente_final} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-white font-semibold text-sm leading-tight">{cliente.razon_social}</h4>
                            <Badge variant="outline" className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30 text-xs">
                              {cliente.estado}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-white/60">RUC:</span>
                              <span className="text-white/80">{cliente.ruc}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Rubro:</span>
                              <span className="text-white/80">{cliente.rubro}</span>
                            </div>

                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}