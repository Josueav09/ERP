import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Activity, TrendingUp, CheckCircle2, Clock, Mail, User, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { clienteService, ClienteStats, Trazabilidad } from "@/services/clienteService";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ClienteStats | null>(null);
  const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "cliente") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [statsData, trazabilidadData] = await Promise.all([
        clienteService.getStats(user.id),
        clienteService.getTrazabilidad(user.id)
      ]);
      
      console.log("[v0] Cliente stats:", statsData);
      console.log("[v0] Cliente trazabilidad:", trazabilidadData);
      
      setStats(statsData);
      setTrazabilidad(trazabilidadData);
    } catch (error: any) {
      console.error("[v0] Error fetching data:", error);
      setError(error.response?.data?.error || "Error al cargar los datos");
      setTrazabilidad([]);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: "Mi Progreso", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/cliente" },
    { label: "Mi Ejecutiva", icon: <User className="w-5 h-5" />, href: "/dashboard/cliente/ejecutiva" },
    { label: "Actividades", icon: <Activity className="w-5 h-5" />, href: "/dashboard/cliente/actividades" },
  ];

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return "Hace unos minutos";
  };

  const getEstadoIcon = (estado: string) => {
    if (estado === "completado") return <CheckCircle2 className="w-5 h-5 text-[#C7E196]" />;
    if (estado === "en_proceso") return <Clock className="w-5 h-5 text-yellow-400" />;
    return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout navItems={navItems} title="Portal del Cliente" subtitle="Seguimiento de tu proceso">
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <AlertCircle className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">No se encontraron datos</h3>
            <p className="text-white/60 max-w-md">
              {error || "No pudimos encontrar información asociada a tu cuenta. Por favor, contacta a tu ejecutiva de cuenta."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
            >
              Reintentar
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const progresoPercentage = stats.totalActividades > 0 ? Math.round((stats.completadas / stats.totalActividades) * 100) : 0;

  const progressData = (trazabilidad || [])
    .filter((t) => t.estado === "completado")
    .slice(-7)
    .map((t, index) => ({
      name: `Día ${index + 1}`,
      progreso: Math.round(((index + 1) / 7) * 100),
    }));

  return (
    <DashboardLayout navItems={navItems} title="Portal del Cliente" subtitle="Seguimiento de tu proceso">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Bienvenido, {stats.cliente.nombre_cliente}! 👋</h2>
          <p className="text-white/60">Seguimiento de tu proceso con Growvia</p>
        </div>

        {/* Executive Card */}
        <Card className="bg-gradient-to-r from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C7E196] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#013936]">
                {stats.cliente.ejecutiva_nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/60">Tu Ejecutiva de Cuenta</p>
              <h3 className="text-xl font-semibold text-white">{stats.cliente.ejecutiva_nombre}</h3>
              <p className="text-sm text-[#C7E196] mt-1">{stats.cliente.ejecutiva_email}</p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => (window.location.href = `mailto:${stats.cliente.ejecutiva_email}`)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contactar
            </Button>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Activity className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Actividades</p>
            <p className="text-3xl font-bold text-white">{stats.totalActividades}</p>
            <p className="text-white/40 text-xs mt-2">Registradas</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Completadas</p>
            <p className="text-3xl font-bold text-white">{stats.completadas}</p>
            <p className="text-white/40 text-xs mt-2">{progresoPercentage}% progreso</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">En Proceso</p>
            <p className="text-3xl font-bold text-white">{stats.enProceso}</p>
            <p className="text-white/40 text-xs mt-2">
              {stats.totalActividades > 0 ? Math.round((stats.enProceso / stats.totalActividades) * 100) : 0}% activo
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Rendimiento</p>
            <p className="text-3xl font-bold text-white">{stats.rendimiento}%</p>
            <p className="text-white/40 text-xs mt-2">Satisfacción</p>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Progreso del Proceso</h3>
            <p className="text-sm text-white/60 mt-1">Evolución de actividades completadas</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
              <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="progreso" stroke="#C7E196" strokeWidth={3} dot={{ fill: "#C7E196" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Timeline */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Línea de Tiempo</h3>
            <p className="text-sm text-white/60 mt-1">Historial de actividades</p>
          </div>
          {!trazabilidad || trazabilidad.length === 0 ? (
            <p className="text-white/40 text-center py-8">No hay actividades registradas aún</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
              <div className="space-y-6">
                {trazabilidad.map((item) => (
                  <div key={item.id_trazabilidad} className="flex gap-4">
                    <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#013936] border-2 border-[#C7E196]">
                      {getEstadoIcon(item.estado)}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">{item.tipo_actividad}</h4>
                          <span className="text-xs text-white/40">{getTimeAgo(item.fecha_actividad)}</span>
                        </div>
                        <p className="text-sm text-white/70 mb-2">{item.descripcion}</p>
                        {item.notas && (
                          <p className="text-xs text-white/50 italic bg-white/5 p-2 rounded mt-2">Nota: {item.notas}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}