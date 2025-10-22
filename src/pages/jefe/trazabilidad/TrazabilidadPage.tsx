import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building2,
  UserCheck,
  Activity,
  LayoutDashboard,
  FileText,
  User,
  TrendingUp,
  Target,
  Award,
  Zap,
} from "lucide-react"
import { jefeService } from "@/services/jefeService"
import { TrazabilidadFilters } from "@/components/trazabilidad/filters-section"
import { TrazabilidadKPIs } from "@/components/trazabilidad/kpis-sections"
import { TrazabilidadEtapa1 } from "@/components/trazabilidad/etapa1-table"
import { TrazabilidadEtapa2 } from "@/components/trazabilidad/etapa2-table"

const navItems = [
  { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
  { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
  { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
  { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
  { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
  { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
]

export default function TrazabilidadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // State
  const [kpiStats, setKpiStats] = useState({
    totalOportunidades: 0,
    enProceso: 0,
    ventasGanadas: 0,
    ventasPerdidas: 0,
    montoTotal: 0,
    tasaConversion: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("etapa1")

  // Filters
  const [filters, setFilters] = useState({
    ejecutiva: searchParams.get("ejecutiva") || "all",
    empresa: "all",
    cliente: "all",
    resultadoContacto: "all",
    etapaOportunidad: "all",
    tipoContacto: "all",
    fechaDesde: "",
    fechaHasta: "",
  })

  useEffect(() => {
    fetchKPIStats()
  }, [filters])

  const fetchKPIStats = async () => {
  try {
    setLoading(true)
    const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
    const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined
    const clienteId = filters.cliente !== "all" ? parseInt(filters.cliente) : undefined

    console.log('🔍 [TrazabilidadPage] Fetching KPIs con filtros:', {
      ejecutivaId,
      empresaId, 
      clienteId,
      fechaDesde: filters.fechaDesde,
      fechaHasta: filters.fechaHasta
    })

    const stats = await jefeService.getTrazabilidadKPIs({
      ejecutivaId,
      empresaId,
      clienteId,
      fechaDesde: filters.fechaDesde || undefined,
      fechaHasta: filters.fechaHasta || undefined,
    })

    console.log('✅ [TrazabilidadPage] KPIs recibidos:', stats)
    setKpiStats(stats)
    
  } catch (error) {
    console.error("❌ [TrazabilidadPage] Error al cargar estadísticas:", error)
  } finally {
    setLoading(false)
  }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      ejecutiva: "all",
      empresa: "all",
      cliente: "all",
      resultadoContacto: "all",
      etapaOportunidad: "all",
      tipoContacto: "all",
      fechaDesde: "",
      fechaHasta: "",
    })
  }

  return (
    <DashboardLayout
      navItems={navItems}
      title="Trazabilidad de Oportunidades"
      subtitle="Monitorea el desempeño de ejecutivas y gestión de ventas"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <TrazabilidadFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClearFilters={clearFilters} 
        />

        {/* KPI Stats Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Total Oportunidades</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : kpiStats.totalOportunidades}
              </div>
              <p className="text-xs text-white/60 mt-1">En el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">En Proceso</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : kpiStats.enProceso}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {kpiStats.totalOportunidades > 0 
                  ? `${((kpiStats.enProceso / kpiStats.totalOportunidades) * 100).toFixed(0)}% activas`
                  : "0% activas"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Ganadas</CardTitle>
              <Award className="h-4 w-4 text-[#10B981]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : kpiStats.ventasGanadas}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {kpiStats.totalOportunidades > 0 
                  ? `${((kpiStats.ventasGanadas / kpiStats.totalOportunidades) * 100).toFixed(0)}% conversión`
                  : "0% conversión"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Perdidas</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : kpiStats.ventasPerdidas}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {kpiStats.totalOportunidades > 0 
                  ? `${((kpiStats.ventasPerdidas / kpiStats.totalOportunidades) * 100).toFixed(0)}% perdidas`
                  : "0% perdidas"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Monto Total</CardTitle>
              <Zap className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : `$${kpiStats.montoTotal.toLocaleString()}`}
              </div>
              <p className="text-xs text-white/60 mt-1">En oportunidades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Tasa Conversión</CardTitle>
              <Target className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : `${kpiStats.tasaConversion}%`}
              </div>
              <p className="text-xs text-white/60 mt-1">Promedio general</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos KPIs */}
        <TrazabilidadKPIs filters={filters} />

        {/* Etapas Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-br from-[#024a46] to-[#013936] border border-[#C7E196]/20 p-1">
            <TabsTrigger
              value="etapa1"
              className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
            >
              Etapa 1: Generación de Oportunidad
            </TabsTrigger>
            <TabsTrigger
              value="etapa2"
              className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
            >
              Etapa 2: Gestión de Oportunidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="etapa1" className="space-y-4">
            <TrazabilidadEtapa1 filters={filters} />
          </TabsContent>

          <TabsContent value="etapa2" className="space-y-4">
            <TrazabilidadEtapa2 filters={filters} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}