import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Building2, Users, UserCheck, Activity, TrendingUp, ArrowUp, ArrowDown, FileText, User, Award, Badge, DollarSign, Minus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/useToast";
import { jefeService, DashboardStats } from "@/services/jefeService";

const COLORS = ["#C7E196", "#013936", "#4ade80", "#fbbf24", "#f87171"];

export default function JefeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ✅ SOLUCIÓN: Verificar tanto contexto como localStorage
    const storedUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    // ✅ PERMITIR acceso si hay token, incluso si el contexto no se actualizó aún
    if (!user && !storedUser) {
      navigate("/login");
      return;
    }

    // ✅ Usar el usuario del contexto O del localStorage
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const allowedRoles = ["jefe", "Jefe", "Administrador"];
    if (!allowedRoles.includes(currentUser.role)) {
      navigate("/login");
      return;
    }

    fetchStats();
  }, [user, navigate]);


  const fetchStats = async () => {
    try {
      const data = await jefeService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "completado":
      case "venta ganada":
        return "bg-[#C7E196] text-[#013936]";
      case "en_proceso":
      case "negociación":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "pendiente":
      case "prospección":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "cancelado":
      case "venta perdida":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-white/10 text-white/60";
    }
  };


  const navItems = [
    { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
    { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
    { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
    { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
    { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
    { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
    { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
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
        <div className="text-white text-lg">Error al cargar datos</div>
      </div>
    );
  }

  // ✅ CORREGIDO: Datos reales para gráficos
  const actividadesData = stats.dashboardEjecutivas?.map((item) => ({
    name: item.nombre_ejecutiva.split(" ")[0], // Solo primer nombre
    actividades: Number.parseInt(item.total_gestiones) || 0,
  })) || [];

  // ✅ CORREGIDO: Datos reales para gráfico de estado
  const estadoData = stats.pipeline?.reduce((acc: any[], item) => {
    const etapa = item.etapa_oportunidad || 'Sin etapa';
    const existing = acc.find(e => e.name === etapa);

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: etapa, value: 1 });
    }
    return acc;
  }, []) || [];

  // ✅ CORREGIDO: Datos reales para clientes por empresa
  const clientesData = stats.dashboardEjecutivas?.reduce((acc: any[], item) => {
    const empresa = item.empresa_proveedora || 'Sin empresa';
    const clientes = Number.parseInt(item.total_clientes) || 0;

    if (clientes > 0) {
      const existing = acc.find(e => e.name === empresa);
      if (existing) {
        existing.clientes += clientes;
      } else {
        acc.push({ name: empresa, clientes });
      }
    }
    return acc;
  }, []).slice(0, 5) || []; // Mostrar solo top 5



  return (
    <DashboardLayout navItems={navItems} title="Panel de Administración" subtitle="Vista general del sistema">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Hola, {user?.name}! 👋</h2>
          <p className="text-white/60">Aquí está el resumen de tu negocio hoy</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Empresas */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Building2 className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.totalEmpresas > 0 ? 'text-green-400' : 'text-gray-400'
                }`}>
                {stats.totalEmpresas > 0 ? <ArrowUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                <span>{stats.totalEmpresas > 0 ? 'Activas' : 'Sin datos'}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Empresas</p>
            <p className="text-3xl font-bold text-white">{stats.totalEmpresas}</p>
            <p className="text-white/40 text-xs mt-2">Empresas registradas</p>
          </Card>

          {/* Ejecutivas */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.totalEjecutivas > 0 ? 'text-green-400' : 'text-gray-400'
                }`}>
                {stats.totalEjecutivas > 0 ? <ArrowUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                <span>{stats.totalEjecutivas > 0 ? 'Activas' : 'Sin datos'}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Ejecutivas</p>
            <p className="text-3xl font-bold text-white">{stats.totalEjecutivas}</p>
            <p className="text-white/40 text-xs mt-2">Ejecutivas activas</p>
          </Card>

          {/* Clientes */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.totalClientes > 0 ? 'text-green-400' : 'text-gray-400'
                }`}>
                {stats.totalClientes > 0 ? <ArrowUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                <span>{stats.totalClientes > 0 ? 'Activos' : 'Sin datos'}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Clientes</p>
            <p className="text-3xl font-bold text-white">{stats.totalClientes}</p>
            <p className="text-white/40 text-xs mt-2">Clientes activos</p>
          </Card>

          {/* Actividades */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Activity className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.kpis.actividadesMes > 0 ? 'text-green-400' : 'text-gray-400'
                }`}>
                {stats.kpis.actividadesMes > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                <span>Este mes</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Actividades</p>
            <p className="text-3xl font-bold text-white">{stats.kpis.actividadesMes || 0}</p>
            <p className="text-white/40 text-xs mt-2">Gestiones comerciales</p>
          </Card>



        </div>

        {/* Top Performance Cards */}
        <div className="grid gap-4 md:grid-cols-3">

          {/* Top Ejecutivas - CON DATOS REALES */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Top Ejecutivas</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Por número de actividades realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topEjecutivas && stats.topEjecutivas.length > 0 ? (
                  stats.topEjecutivas.map((ejecutiva, index) => (
                    <div key={ejecutiva.id_ejecutiva} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-400 text-[#013936]' :
                            index === 1 ? 'bg-gray-300 text-[#013936]' :
                              index === 2 ? 'bg-orange-400 text-[#013936]' :
                                'bg-[#C7E196] text-[#013936]'
                          }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{ejecutiva.nombre}</p>
                          <p className="text-xs text-white/60">
                            {ejecutiva.clientes} clientes • {ejecutiva.conversion} conversión
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-[#C7E196] text-[#013936] font-semibold">
                        {ejecutiva.actividades}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/60">
                    <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay datos de ejecutivas</p>
                    <p className="text-sm">Las ejecutivas aún no han registrado actividades</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Empresas - CON DATOS REALES */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Top Empresas Proveedoras</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Mayor actividad comercial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topEmpresas && stats.topEmpresas.length > 0 ? (
                  stats.topEmpresas.map((empresa, index) => (
                    <div key={empresa.id_empresa_prov} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{empresa.nombre}</p>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${empresa.revenue.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{empresa.actividades} actividades</span>
                        <span>{empresa.ejecutivas} ejecutivas</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/60">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay datos de empresas</p>
                    <p className="text-sm">No se han registrado actividades comerciales</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Clientes - CON DATOS REALES */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Top Clientes Finales</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Mayor volumen de gestiones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topClientes && stats.topClientes.length > 0 ? (
                  stats.topClientes.map((cliente, index) => (
                    <div key={cliente.id_cliente_final} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{cliente.nombre}</p>
                        <Badge className={getEstadoBadgeColor(cliente.estado)}>
                          {cliente.estado}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{cliente.gestiones} gestiones</span>
                        <span>{cliente.etapa}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-white/60">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay datos de clientes</p>
                    <p className="text-sm">No se han registrado gestiones comerciales</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Chart */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Actividades por Ejecutiva</h3>
                <p className="text-sm text-white/60 mt-1">Rendimiento del equipo</p>
              </div>
              <TrendingUp className="w-5 h-5 text-[#C7E196]" />
            </div>
            {actividadesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={actividadesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                  <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                    labelStyle={{ color: "#ffffff" }}
                  />
                  <Bar dataKey="actividades" fill="#C7E196" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-white/60">
                No hay datos de actividades disponibles
              </div>
            )}
          </Card>

          {/* Status Distribution */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Estado de Actividades</h3>
                <p className="text-sm text-white/60 mt-1">Distribución por estado</p>
              </div>
            </div>
            {estadoData.length > 0 ? (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={estadoData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {estadoData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {estadoData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm text-white/80 capitalize">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-white/60">
                No hay datos de estados disponibles
              </div>
            )}
          </Card>
        </div>

        {/* Clients by Company */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Clientes por Empresa</h3>
              <p className="text-sm text-white/60 mt-1">Distribución de clientes</p>
            </div>
          </div>
          {clientesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis type="number" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis dataKey="name" type="category" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="clientes" fill="#C7E196" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-white/60">
              No hay datos de clientes por empresa disponibles
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}