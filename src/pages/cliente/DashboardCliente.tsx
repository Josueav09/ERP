import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail, Phone, DollarSign, UserCheck, UserPlus,
  TrendingUp, Calendar, Activity, Clock, User, Users, MessageCircle
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { ClienteReal, clienteService, ClienteStats, EjecutivaCompleta, Trazabilidad } from "@/services/clienteService";

// Interfaces actualizadas con datos REALES del backend
interface EjecutivaInfo {
  ejecutiva: {
    nombre_completo: string;
    correo: string;
    telefono: string;
    especialidad: string;
  };
  estadisticas: {
    clientes_activos: number;
    tasa_conversion: string;
    ventas_ganadas: number;
    tiempo_respuesta: string;
  };
}

// En ProveedorDashboard.tsx - actualiza las interfaces
interface EjecutivaDashboard {
  id_ejecutiva: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  especialidad: string;
  clientesAsignados: number;
  clientesPotenciales: number;
  ventasMes: number;
  tasaConversion: number;
}

interface ActividadComercial {
  id: number;
  ejecutiva: string;
  actividad: string;
  tipo: string;
  fecha: string;
  cliente: string;
  estado: string;
}

// Interface extendida para stats con datos REALES
interface StatsCompletas extends ClienteStats {
  totalClientes?: number;
  totalEjecutivas?: number;
  actividadesEsteMes?: number;
  clientesEsteMes?: number;
  revenueTotal?: number;
  pipelineOportunidades?: number;
  tasaConversion?: string;
  ventasGanadas?: number;
}

export default function ProveedorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsCompletas | null>(null);
  const [ejecutivaInfo, setEjecutivaInfo] = useState<EjecutivaInfo | null>(null);
  const [ejecutivas, setEjecutivas] = useState<EjecutivaCompleta[]>([]); // ✅ CAMBIAR A ARRAY
  const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([]);
  const [clientesRecientes, setClientesRecientes] = useState<ClienteReal[]>([]); // ✅ NUEVO

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "empresa") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     console.log('🔄 [ProveedorDashboard] Cargando datos REALES...');

  //     const clienteUsuarioId = user?.id || '1';
  //     console.log('🔍 ID de empresa:', clienteUsuarioId);

  //     const [statsData, trazabilidadData, ejecutivaData, clientesData] = await Promise.all([
  //       clienteService.getStats(clienteUsuarioId),
  //       clienteService.getTrazabilidad(clienteUsuarioId),
  //       clienteService.getEjecutivaInfo(clienteUsuarioId),
  //       clienteService.getClientesRecientes(clienteUsuarioId), // ✅ NUEVO
  //       clienteService.getEjecutivasByEmpresa(clienteUsuarioId) // ✅ CAMBIAR A getEjecutivasByEmpresa

  //     ]);

  //     console.log('✅ [ProveedorDashboard] Datos REALES cargados:');
  //     console.log('📊 Stats:', statsData);
  //     console.log('📋 Trazabilidad:', trazabilidadData.length, 'registros');
  //     console.log('👩‍💼 Ejecutiva:', ejecutivaData);

  //     setStats(statsData as StatsCompletas);
  //     setTrazabilidad(trazabilidadData);
  //     setEjecutivaInfo(ejecutivaData);
  //     setEjecutivas(ejecutivaData); // ✅ GUARDAR ARRAY COMPLETO
  //     setClientesRecientes(clientesData); // ✅ NUEVO


  //   } catch (error) {
  //     console.error('❌ [ProveedorDashboard] Error cargando datos REALES:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Agrega esto después del fetchData
  
  const fetchData = async () => {
  setLoading(true);
  try {
    console.log('🔄 [ProveedorDashboard] Cargando datos REALES...');

    const clienteUsuarioId = user?.id || '1';
    console.log('🔍 ID de empresa:', clienteUsuarioId);

    // ✅ CORREGIR: Obtener ejecutivasData correctamente
    const [statsData, trazabilidadData, ejecutivaData, clientesData, ejecutivasData] = await Promise.all([
      clienteService.getStats(clienteUsuarioId),
      clienteService.getTrazabilidad(clienteUsuarioId),
      clienteService.getEjecutivaInfo(clienteUsuarioId),
      clienteService.getClientesRecientes(clienteUsuarioId),
      clienteService.getEjecutivasByEmpresa(clienteUsuarioId) // ✅ Este es el array de ejecutivas
    ]);

    console.log('✅ [ProveedorDashboard] Datos REALES cargados:');
    console.log('📊 Stats:', statsData);
    console.log('📋 Trazabilidad:', trazabilidadData.length, 'registros');
    console.log('👩‍💼 Ejecutiva individual:', ejecutivaData);
    console.log('👥 Todas las ejecutivas:', ejecutivasData?.length || 0, 'ejecutivas');

    setStats(statsData as StatsCompletas);
    setTrazabilidad(trazabilidadData);
    setEjecutivaInfo(ejecutivaData);
    setEjecutivas(ejecutivasData || []); // ✅ ASIGNAR ejecutivasData, no ejecutivaData
    setClientesRecientes(clientesData);

  } catch (error) {
    console.error('❌ [ProveedorDashboard] Error cargando datos REALES:', error);
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    if (clientesRecientes.length > 0) {
      console.log('🔍 [Debug] Verificando datos de clientes:');
      clientesRecientes.forEach((cliente, index) => {
        console.log(`Cliente ${index}:`, {
          id: cliente.id_cliente_final,
          nombre: cliente.razon_social,
          ejecutiva: cliente.ejecutiva_nombre
        });
      });
    }
  }, [clientesRecientes]);

  // ✅ FUNCIONES CON DATOS REALES - REEMPLAZANDO MOCKS

  /**
   * Gráfico de evolución de actividades por mes (DATOS REALES)
   */
  const getEvolucionActividadesData = () => {
    if (!trazabilidad.length) return [];

    // Agrupar actividades por mes
    const actividadesPorMes = trazabilidad.reduce((acc, actividad) => {
      const fecha = new Date(actividad.fecha_actividad);
      const mes = fecha.toLocaleString('es-ES', { month: 'short' });

      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes]++;

      return acc;
    }, {} as Record<string, number>);

    // Convertir a array para el gráfico
    return Object.entries(actividadesPorMes)
      .map(([mes, cantidad]) => ({ mes, actividades: cantidad }))
      .slice(-6); // Últimos 6 meses
  };

  /**
   * Gráfico de ventas vs pipeline (DATOS REALES)
   */
  const getVentasVsPipelineData = () => {
    if (!stats) return [];

    return [
      {
        categoria: 'Ventas Ganadas',
        valor: stats.ventasGanadas || 0,
        color: '#C7E196'
      },
      {
        categoria: 'Pipeline Activo',
        valor: stats.pipelineOportunidades || 0,
        color: '#FBBF24'
      },
      {
        categoria: 'Clientes Activos',
        valor: stats.totalClientes || 0,
        color: '#60A5FA'
      }
    ];
  };

  /**
   * Gráfico de actividades por estado (DATOS REALES)
   */
  const getActividadesPorEstadoData = () => {
    if (!trazabilidad.length) return [];

    const conteoEstados = trazabilidad.reduce((acc, actividad) => {
      const estado = actividad.resultado_contacto || 'pendiente';
      if (!acc[estado]) {
        acc[estado] = 0;
      }
      acc[estado]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(conteoEstados).map(([estado, cantidad]) => ({
      estado: estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' '),
      cantidad
    }));
  };

  /**
   * Gráfico de eficiencia semanal (DATOS REALES)
   */
  const getEficienciaSemanalData = () => {
    if (!trazabilidad.length) return [];

    // Agrupar por semana y calcular eficiencia
    const actividadesPorSemana = trazabilidad.reduce((acc, actividad) => {
      const fecha = new Date(actividad.fecha_actividad);
      const semana = `Sem ${Math.ceil(fecha.getDate() / 7)}`;
      const estado = actividad.resultado_contacto;

      if (!acc[semana]) {
        acc[semana] = { completadas: 0, total: 0 };
      }

      acc[semana].total++;
      if (estado === 'completada') {
        acc[semana].completadas++;
      }

      return acc;
    }, {} as Record<string, { completadas: number; total: number }>);

    return Object.entries(actividadesPorSemana)
      .map(([semana, datos]) => ({
        semana,
        completadas: datos.completadas,
        total: datos.total,
        eficiencia: datos.total > 0 ? Math.round((datos.completadas / datos.total) * 100) : 0
      }))
      .slice(-4); // Últimas 4 semanas
  };

  const navItems = [
    { label: "Dashboard", icon: <Activity className="w-5 h-5" />, href: "/dashboard/empresa" },
    { label: "Mi Equipo", icon: <Users className="w-5 h-5" />, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <Calendar className="w-5 h-5" />, href: "/dashboard/empresa/actividades" },
  ];

  // Transformar trazabilidad a actividades comerciales
  const actividadesComerciales: ActividadComercial[] = trazabilidad.map(item => {
    const estadoRaw = item.resultado_contacto || 'pendiente';
    const tipoActividad = item.tipo_actividad || 'seguimiento';

    // Usar datos REALES de la trazabilidad
    return {
      id: item.id_trazabilidad,
      ejecutiva: item.ejecutiva_nombre || 'Ejecutiva',
      actividad: item.descripcion || `Contacto ${tipoActividad} con ${item.contacto_nombre || 'cliente'}`,
      tipo: tipoActividad.toLowerCase().includes('llamada') ? 'llamada' :
        tipoActividad.toLowerCase().includes('reunión') ? 'reunion' :
          tipoActividad.toLowerCase().includes('correo') ? 'email' :
            tipoActividad.toLowerCase().includes('whatsapp') ? 'whatsapp' : 'seguimiento',
      fecha: item.fecha_actividad,
      cliente: item.cliente_nombre || item.nombre_empresa || 'Cliente',
      estado: estadoRaw
    };
  });

  // Funciones auxiliares
  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
      if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
      return "Hace unos minutos";
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo": return "bg-green-500";
      case "potencial": return "bg-yellow-500";
      case "inactivo": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getEstadoActividadColor = (estado: string) => {
    switch (estado) {
      case "completada": return "bg-green-500";
      case "en_proceso": return "bg-yellow-500";
      case "pendiente": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getTipoActividadIcon = (tipo: string) => {
    switch (tipo) {
      case "llamada": return <Phone className="w-4 h-4 text-purple-400" />;
      case "reunion": return <Users className="w-4 h-4 text-blue-400" />;
      case "email": return <Mail className="w-4 h-4 text-green-400" />;
      case "whatsapp": return <MessageCircle className="w-4 h-4 text-green-500" />;
      case "propuesta": return <TrendingUp className="w-4 h-4 text-orange-400" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  // ✅ DATOS REALES para ejecutivas
  const ejecutivasReales = [
    {
      id: 1,
      nombre: ejecutivaInfo?.ejecutiva?.nombre_completo || "Ejecutiva no asignada",
      email: ejecutivaInfo?.ejecutiva?.correo || "contacto@growvia.com",
      telefono: ejecutivaInfo?.ejecutiva?.telefono || "No disponible",
      clientesAsignados: ejecutivaInfo?.estadisticas?.clientes_activos || 0,
      clientesPotenciales: stats?.pipelineOportunidades || 0,
      ventasMes: stats?.revenueTotal || 0
    }
  ];

  // ✅ DATOS REALES para clientes
  const clientesReales = [
    {
      id: 1,
      nombre: stats?.cliente?.nombre_cliente || "Cliente",
      empresa: stats?.cliente?.nombre_empresa || "Empresa",
      estado: "activo" as const,
      fechaIngreso: new Date().toISOString().split('T')[0],
      ejecutiva: ejecutivaInfo?.ejecutiva?.nombre_completo || "Ejecutiva",
      actividadesCompletadas: stats?.completadas || 0,
      actividadesPendientes: (stats?.totalActividades || 0) - (stats?.completadas || 0)
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Error cargando datos</div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Dashboard Empresa" subtitle="Resumen de tus actividades y seguimiento comercial">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Bienvenido, {stats.cliente.nombre_cliente}! 👋</h2>
          <p className="text-white/60">Seguimiento del desempeño de tu equipo comercial</p>
        </div>

        {/* Stats Cards - TODOS LOS DATOS SON REALES AHORA */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Ventas Totales</p>
            <p className="text-3xl font-bold text-white">${(stats.revenueTotal || 0).toLocaleString()}</p>
            <p className="text-white/40 text-xs mt-2">Ingresos acumulados</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Clientes Gestionados</p>
            <p className="text-3xl font-bold text-white">{stats.totalClientes || 0}</p>
            <p className="text-white/40 text-xs mt-2">Clientes activos</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <UserPlus className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Clientes Potenciales</p>
            <p className="text-3xl font-bold text-white">{stats.pipelineOportunidades || 0}</p>
            <p className="text-white/40 text-xs mt-2">En seguimiento</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Actividades Completadas</p>
            <p className="text-3xl font-bold text-white">{stats.completadas}</p>
            <p className="text-white/40 text-xs mt-2">Este mes</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-white">{stats.enProceso}</p>
            <p className="text-white/40 text-xs mt-2">Actividades activas</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Rendimiento</p>
            <p className="text-3xl font-bold text-white">{stats.rendimiento}%</p>
            <p className="text-white/40 text-xs mt-2">Tasa de efectividad</p>
          </Card>


        </div>

        {/* Charts Section - DATOS REALES */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico 1: Evolución de Actividades (REAL) */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Evolución de Actividades</h3>
              <p className="text-sm text-white/60 mt-1">
                {trazabilidad.length} actividades reales en los últimos meses
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getEvolucionActividadesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="mes" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                />
                <Bar dataKey="actividades" fill="#C7E196" name="Actividades" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico 2: Ventas vs Pipeline (REAL) */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Desempeño Comercial</h3>
              <p className="text-sm text-white/60 mt-1">
                Ventas ganadas vs Oportunidades en pipeline
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getVentasVsPipelineData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="categoria" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                />
                <Bar dataKey="valor" fill="#C7E196" name="Cantidad">
                  {getVentasVsPipelineData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Segunda fila de gráficos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico 3: Actividades por Estado (REAL) */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Estado de Actividades</h3>
              <p className="text-sm text-white/60 mt-1">
                Distribución por estado de finalización
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getActividadesPorEstadoData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="estado" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                />
                <Bar dataKey="cantidad" fill="#C7E196" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico 4: Eficiencia Semanal (REAL) */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Eficiencia Semanal</h3>
              <p className="text-sm text-white/60 mt-1">
                Tasa de completitud por semana
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getEficienciaSemanalData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="semana" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                />
                <Line
                  type="monotone"
                  dataKey="eficiencia"
                  stroke="#C7E196"
                  strokeWidth={3}
                  dot={{ fill: "#C7E196" }}
                  name="Eficiencia %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Ejecutivas Section - TODAS LAS EJECUTIVAS REALES */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">
              Tu Equipo de Ejecutivas {ejecutivas.length > 0 && `(${ejecutivas.length})`}
            </h3>
            <p className="text-sm text-white/60 mt-1">
              {ejecutivas.length > 0
                ? "Especialistas dedicados a tu crecimiento"
                : "No hay ejecutivas asignadas a tu empresa"
              }
            </p>
          </div>

          {ejecutivas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ejecutivas.map((ejecutiva) => (
                <div key={ejecutiva.id_ejecutiva} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[#013936]">
                        {ejecutiva.nombre_completo.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{ejecutiva.nombre_completo}</h4>
                      <p className="text-sm text-[#C7E196] truncate">{ejecutiva.correo}</p>
                      <p className="text-xs text-white/60 truncate">{ejecutiva.especialidad}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center mb-3">
                    <div>
                      <p className="text-xl font-bold text-white">{ejecutiva.clientesAsignados}</p>
                      <p className="text-xs text-white/60">Clientes</p>
                    </div>

                    <div>
                      <p className="text-xl font-bold text-white">${(ejecutiva.ventasMes / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-white/60">Ventas</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 flex-1"
                      onClick={() => (window.location.href = `mailto:${ejecutiva.correo}`)}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                    {ejecutiva.telefono && ejecutiva.telefono !== 'No disponible' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => (window.location.href = `tel:${ejecutiva.telefono}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Indicador de rendimiento */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-white/60">Tasa de conversion:</span>
                      <span className="text-[#C7E196] font-bold">{ejecutiva.tasaConversion}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-[#C7E196] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(ejecutiva.tasaConversion, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Sin ejecutivas asignadas</h4>
              <p className="text-white/60 text-sm">
                Actualmente no tienes ejecutivas asignadas a tu empresa.
                <br />
                Contacta con el administrador para asignar profesionales a tu equipo.
              </p>
            </div>
          )}
        </Card>

        {/* Two Columns Section - DATOS REALES */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Clientes Recientes - DATOS REALES */}
          {/* Clientes Recientes - DATOS REALES CON ESTADÍSTICAS INDIVIDUALES */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Clientes Recientes</h3>
              <p className="text-sm text-white/60 mt-1">
                {clientesRecientes?.length || 0} clientes gestionados
              </p>
            </div>
            <div className="space-y-4">
              {clientesRecientes && clientesRecientes.length > 0 ? (
                clientesRecientes.map((cliente, index) => {
                  if (!cliente) return null;

                  const clienteKey = cliente.id_cliente_final
                    ? `cliente-${cliente.id_cliente_final}`
                    : `cliente-temp-${index}-${Date.now()}`;

                  // ✅ USAR LAS ESTADÍSTICAS INDIVIDUALES DEL BACKEND
                  const actividadesCompletadas = cliente.actividades_completadas || 0;
                  const actividadesEnProceso = cliente.actividades_en_proceso || 0;
                  const totalActividades = cliente.total_actividades || 0;

                  return (
                    <div
                      key={clienteKey}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">
                            {cliente.razon_social || 'Cliente sin nombre'}
                          </h4>
                          <p className="text-sm text-white/60 truncate">
                            {cliente.rubro || 'Sin rubro'}
                          </p>
                          <p className="text-xs text-[#C7E196] truncate">
                            {cliente.ejecutiva_nombre || 'Sin ejecutiva asignada'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="flex gap-2 text-xs">
                          <span className="text-green-400">{actividadesCompletadas} complet.</span>
                          <span className="text-yellow-400">{actividadesEnProceso} en proc.</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1">
                          {cliente.fecha_creacion ?
                            new Date(cliente.fecha_creacion).toLocaleDateString('es-ES') :
                            'Fecha no disponible'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60 text-sm">No hay clientes registrados</p>
                  <p className="text-white/40 text-xs mt-1">Los clientes aparecerán aquí cuando sean agregados</p>
                </div>
              )}
            </div>
          </Card>

          {/* Actividades Recientes - Se mantiene igual */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Actividades Recientes</h3>
              <p className="text-sm text-white/60 mt-1">Últimas acciones de tu ejecutiva</p>
            </div>
            <div className="space-y-4">
              {actividadesComerciales.slice(0, 4).map((actividad, index) => (
                <div
                  key={`actividad-${actividad.id}-${actividad.fecha}-${index}`}
                  className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="p-2 bg-white/10 rounded-lg">
                    {getTipoActividadIcon(actividad.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-white text-sm">{actividad.actividad}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getEstadoActividadColor(actividad.estado)}`}></div>
                        <span className="text-xs text-white/40">{getTimeAgo(actividad.fecha)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 mb-1">
                      {actividad.ejecutiva} • {actividad.cliente}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded ${actividad.estado === 'completada' ? 'bg-green-500/20 text-green-400' :
                        actividad.estado === 'en_proceso' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                        {actividad.estado.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-white/40 capitalize">{actividad.tipo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout >
  );
}
