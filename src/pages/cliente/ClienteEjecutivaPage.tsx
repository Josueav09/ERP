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
  Activity, Calendar, Filter, Mail, Phone, Linkedin
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
      
      console.log('🔄 Cargando datos COMPLETOS para empresa:', empresaId);

      // Obtener TODAS las ejecutivas de la empresa
      const todasEjecutivas = await clienteService.getEjecutivasByEmpresa(empresaId);
      console.log('✅ Ejecutivas obtenidas:', todasEjecutivas);

      // Obtener estadísticas del equipo
      const stats = await getEquipoStats(empresaId, todasEjecutivas);
      setEquipoStats(stats);

      // Obtener clientes recientes
      const clientes = await clienteService.getClientesRecientes(empresaId);
      setClientesRecientes(clientes);

      setEjecutivas(todasEjecutivas);
      
      // Seleccionar la primera ejecutiva por defecto si existe
      if (todasEjecutivas.length > 0) {
        setEjecutivaSeleccionada(todasEjecutivas[0]);
      } else {
        setEjecutivaSeleccionada(null);
      }

    } catch (error) {
      console.error('❌ Error cargando datos del equipo:', error);
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
      console.error('Error obteniendo stats del equipo:', error);
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

      <div className="space-y-6">
        {/* Resumen del Equipo */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumen del Equipo
            </CardTitle>
            <CardDescription className="text-white/60">
              Métricas consolidadas de todo tu equipo comercial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-3xl font-bold text-[#C7E196]">
                  {equipoStats.totalEjecutivas}
                </p>
                <p className="text-white/60">Total Ejecutivas</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-3xl font-bold text-[#C7E196]">
                  ${(equipoStats.ventasTotales / 1000).toFixed(0)}K
                </p>
                <p className="text-white/60">Ventas Mensuales</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-3xl font-bold text-[#C7E196]">
                  {equipoStats.totalClientes}
                </p>
                <p className="text-white/60">Clientes Activos</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-3xl font-bold text-[#C7E196]">
                  {equipoStats.conversionPromedio}
                </p>
                <p className="text-white/60">Conversión Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Section con Selector */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {ejecutivaSeleccionada ? ejecutivaSeleccionada.nombre_completo : 'Tu Ejecutiva'}
            </h1>
            <p className="text-white/60 text-lg">
              {ejecutivaSeleccionada ? ejecutivaSeleccionada.especialidad : 'Selecciona una ejecutiva para ver sus detalles'}
            </p>
          </div>

          {/* Selector de Ejecutiva */}
          <div className="w-full lg:w-64">
            <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Seleccionar Ejecutiva
            </label>
            <Select
              value={ejecutivaSeleccionada?.id_ejecutiva.toString()}
              onValueChange={handleEjecutivaChange}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecciona una ejecutiva" />
              </SelectTrigger>
              <SelectContent className="bg-[#024a46] border-[#C7E196]/20">
                {ejecutivas.map((ejecutiva) => (
                  <SelectItem
                    key={ejecutiva.id_ejecutiva}
                    value={ejecutiva.id_ejecutiva.toString()}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#013936]">
                          {getInitials(ejecutiva.nombre_completo)}
                        </span>
                      </div>
                      {ejecutiva.nombre_completo}
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
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay ejecutivas asignadas</h3>
              <p className="text-white/60">
                Actualmente no tienes ejecutivas asignadas a tu empresa. 
                Contacta con el administrador para asignar profesionales a tu equipo.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ejecutiva Seleccionada - DETALLE COMPLETO */}
        {ejecutivaSeleccionada && (
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Información Principal */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-[#013936]">
                      {getInitials(ejecutivaSeleccionada.nombre_completo)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{ejecutivaSeleccionada.nombre_completo}</h4>
                    </div>

                    {/* Información de Contacto */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-white/80">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{ejecutivaSeleccionada.correo}</span>
                      </div>
                      {ejecutivaSeleccionada.telefono && ejecutivaSeleccionada.telefono !== 'No disponible' && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{ejecutivaSeleccionada.telefono}</span>
                        </div>
                      )}
                      {ejecutivaSeleccionada.linkedin && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">LinkedIn</span>
                        </div>
                      )}
                    </div>

                    {/* Métricas Principales */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{ejecutivaSeleccionada.clientesAsignados}</p>
                        <p className="text-xs text-white/60">Clientes Activos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">${(ejecutivaSeleccionada.ventasMes / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-white/60">Ventas Mensuales</p>
                      </div>
                    </div>

                    {/* Certificaciones */}
                    <div className="mb-4">
                      <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Certificaciones
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {ejecutivaSeleccionada.certificaciones.map((cert) => (
                          <Badge key={cert.id} variant="outline" className="bg-white/10 text-white border-white/20">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {cert.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embudo de Ventas COMPLETO */}
              <div className="lg:w-80">
                <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Embudo de Ventas
                </h5>
                <div className="space-y-2">
                  {ejecutivaSeleccionada.embudoVentas.map((etapa, index) => {
                    const width = 100 - (index * 20);
                    return (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="w-20 text-white/80 flex-shrink-0">
                          {etapa.etapa}
                        </div>
                        <div className="flex-1 flex justify-center">
                          <div
                            className="h-6 flex items-center justify-center text-white font-medium text-xs transition-all duration-300"
                            style={{
                              width: `${width}%`,
                              backgroundColor: [
                                '#6F9E2B', '#8CBD35', '#A9D45E', '#B2C48A', '#C7E196'
                              ][index] || '#6B7280',
                              borderRadius: '4px',
                              minWidth: '60px'
                            }}
                          >
                            {etapa.cantidad}
                          </div>
                        </div>
                        <div className="w-12 text-white/60 text-right flex-shrink-0">
                          ${(etapa.monto_potencial / 1000).toFixed(0)}K
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumen del Embudo */}
                <div className="mt-4 pt-3 border-t border-white/10">

                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-white/60">Conversión Final:</span>
                    <span className="text-[#C7E196] font-bold">
                      {ejecutivaSeleccionada.embudoVentas[ejecutivaSeleccionada.embudoVentas.length - 1]?.tasa_conversion}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-white/60">Tasa de Conversión Personal:</span>
                    <span className="text-[#C7E196] font-bold">
                      {ejecutivaSeleccionada.tasaConversion}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Clientes Recientes de la Ejecutiva Seleccionada */}
        {ejecutivaSeleccionada && clientesRecientes.length > 0 && (
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Clientes de {ejecutivaSeleccionada.nombre_completo.split(' ')[0]}
              </CardTitle>
              <CardDescription className="text-white/60">
                Clientes gestionados por esta ejecutiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientesRecientes
                  .filter(cliente => cliente.ejecutiva_nombre === ejecutivaSeleccionada.nombre_completo)
                  .slice(0, 6)
                  .map((cliente) => (
                    <div key={cliente.id_cliente_final} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold text-sm">{cliente.razon_social}</h4>
                        <Badge variant="outline" className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30 text-xs">
                          {cliente.estado}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-xs mb-1">RUC: {cliente.ruc}</p>
                      <p className="text-white/60 text-xs mb-2">Rubro: {cliente.rubro}</p>
                      <div className="flex justify-between text-xs text-white/60">
                      </div>
                    </div>
                  ))}
              </div>
              {clientesRecientes.filter(cliente => cliente.ejecutiva_nombre === ejecutivaSeleccionada.nombre_completo).length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">No hay clientes asignados a esta ejecutiva</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

