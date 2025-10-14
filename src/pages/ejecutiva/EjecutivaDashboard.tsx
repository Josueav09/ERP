// frontend/src/modules/ejecutiva/pages/EjecutivaDashboard.tsx
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Building2, Users, Activity, Plus, Clock, CheckCircle2 } from "lucide-react"
import { AddEmpresaDialog } from "../../components/ejecutivaComponents/AddEmpresaDialog"
import { AddClienteDialog } from "../../components/ejecutivaComponents/AddClienteDialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ejecutivaService } from "@/services/ejecutivaService"

interface Stats {
  totalEmpresas: number
  totalClientes: number
  actividadesMes: number
}

interface Trazabilidad {
  id_trazabilidad: number
  tipo_actividad: string
  descripcion: string
  fecha_actividad: string
  estado: string
  nombre_empresa: string
  nombre_cliente: string | null
}

export default function EjecutivaDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats | null>(null)
  const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddEmpresa, setShowAddEmpresa] = useState(false)
  const [showAddCliente, setShowAddCliente] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    if (!user) return
    try {
      const [statsData, trazabilidadData] = await Promise.all([
        ejecutivaService.getStats(user.id),
        ejecutivaService.getTrazabilidad(user.id)
      ])
      
      console.log("[v1] Ejecutiva stats:", statsData)
      console.log("[v1] Ejecutiva trazabilidad:", trazabilidadData)
      
      setStats(statsData)
      setTrazabilidad(trazabilidadData)
    } catch (error) {
      console.error("[v1] Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
    { label: "Mis Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
    { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
    { label: "Mi Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
  ]

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`
    if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
    return "Hace unos minutos"
  }

  const getEstadoBadge = (estado: string) => {
    const badges = {
      completado: "bg-[#C7E196] text-[#013936]",
      en_proceso: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      pendiente: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      cancelado: "bg-red-500/20 text-red-400 border border-red-500/30",
    }
    return badges[estado as keyof typeof badges] || "bg-gray-500/20 text-gray-400"
  }

  const getEstadoLabel = (estado: string) => {
    const labels = {
      completado: "Completado",
      en_proceso: "En proceso",
      pendiente: "Pendiente",
      cancelado: "Cancelado",
    }
    return labels[estado as keyof typeof labels] || estado
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Cargando dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Error al cargar datos</div>
      </div>
    )
  }

  const actividadesPorEstado = trazabilidad.reduce(
    (acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(actividadesPorEstado).map(([estado, count]) => ({
    name: estado.replace("_", " "),
    value: count,
  }))

  return (
    <DashboardLayout navItems={navItems} title="Panel de Ejecutiva" subtitle="Gestiona tus empresas y clientes">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Bienvenida, {user?.name}! 👋</h2>
            <p className="text-white/60">Gestiona tus empresas, clientes y actividades</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddEmpresa(true)}
              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Empresa
            </Button>
            <Button
              onClick={() => setShowAddCliente(true)}
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Building2 className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Mis Empresas</p>
            <p className="text-3xl font-bold text-white">{stats.totalEmpresas}</p>
            <p className="text-white/40 text-xs mt-2">Empresas asignadas</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Mis Clientes</p>
            <p className="text-3xl font-bold text-white">{stats.totalClientes}</p>
            <p className="text-white/40 text-xs mt-2">Clientes activos</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Activity className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Actividades</p>
            <p className="text-3xl font-bold text-white">{stats.actividadesMes}</p>
            <p className="text-white/40 text-xs mt-2">Este mes</p>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Chart */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Estado de Actividades</h3>
              <p className="text-sm text-white/60 mt-1">Distribución por estado</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <YAxis stroke="#ffffff60" tick={{ fill: "#ffffff60" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E19640", borderRadius: "8px" }}
                />
                <Bar dataKey="value" fill="#C7E196" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
              <p className="text-sm text-white/60 mt-1">Últimas 5 actividades</p>
            </div>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {trazabilidad.length === 0 ? (
                <p className="text-white/40 text-center py-8 text-sm">No hay actividades registradas</p>
              ) : (
                trazabilidad.slice(0, 5).map((item) => (
                  <div key={item.id_trazabilidad} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="p-2 bg-[#C7E196]/20 rounded flex-shrink-0">
                      {item.estado === "completado" ? (
                        <CheckCircle2 className="w-4 h-4 text-[#C7E196]" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.tipo_actividad}</p>
                      <p className="text-xs text-white/60 mt-1">{item.nombre_empresa}</p>
                      <p className="text-xs text-white/40 mt-1">{getTimeAgo(item.fecha_actividad)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getEstadoBadge(item.estado)}`}>
                      {getEstadoLabel(item.estado)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {showAddEmpresa && (
        <AddEmpresaDialog
          ejecutivaId={user?.id || ""}
          onSuccess={() => {
            fetchData()
            setShowAddEmpresa(false)
          }}
          onClose={() => setShowAddEmpresa(false)}
        />
      )}
      {showAddCliente && (
        <AddClienteDialog
          ejecutivaId={user?.id || ""}
          onSuccess={() => {
            fetchData()
            setShowAddCliente(false)
          }}
          onClose={() => setShowAddCliente(false)}
        />
      )}
    </DashboardLayout>
  )
}