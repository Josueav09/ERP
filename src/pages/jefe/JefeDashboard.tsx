import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, Building2, Users, UserCheck, Activity, TrendingUp, ArrowUp, ArrowDown, FileText, User } from "lucide-react";
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
    if (!user || user.role !== "jefe") {
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

  const actividadesData = stats.actividadesPorEjecutiva.map((item) => ({
    name: item.ejecutiva.split(" ")[0],
    actividades: Number.parseInt(item.total_actividades),
  }));

  const estadoData = stats.trazabilidadPorEstado.map((item) => ({
    name: item.estado.replace("_", " "),
    value: Number.parseInt(item.total),
  }));

  const clientesData = stats.clientesPorEmpresa.slice(0, 5).map((item) => ({
    name: item.nombre_empresa.length > 15 ? item.nombre_empresa.substring(0, 15) + "..." : item.nombre_empresa,
    clientes: Number.parseInt(item.total_clientes),
  }));

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
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Building2 className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Empresas</p>
            <p className="text-3xl font-bold text-white">{stats.totalEmpresas}</p>
            <p className="text-white/40 text-xs mt-2">Empresas registradas</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Ejecutivas</p>
            <p className="text-3xl font-bold text-white">{stats.totalEjecutivas}</p>
            <p className="text-white/40 text-xs mt-2">Ejecutivas activas</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>23%</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Clientes</p>
            <p className="text-3xl font-bold text-white">{stats.totalClientes}</p>
            <p className="text-white/40 text-xs mt-2">Clientes activos</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Activity className="w-6 h-6 text-[#C7E196]" />
              </div>
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <ArrowDown className="w-4 h-4" />
                <span>5%</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Actividades</p>
            <p className="text-3xl font-bold text-white">{stats.actividadesMes}</p>
            <p className="text-white/40 text-xs mt-2">Este mes</p>
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
          </Card>

          {/* Status Distribution */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Estado de Actividades</h3>
                <p className="text-sm text-white/60 mt-1">Distribución por estado</p>
              </div>
            </div>
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
                    {estadoData.map((entry, index) => (
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
          </Card>
        </div>

        {/* Clients by Company */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Top Empresas por Clientes</h3>
              <p className="text-sm text-white/60 mt-1">Empresas con más clientes</p>
            </div>
          </div>
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
        </Card>
      </div>
    </DashboardLayout>
  );
}