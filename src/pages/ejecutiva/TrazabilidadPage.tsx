// frontend/src/pages/ejecutiva/TrazabilidadPage.tsx
// import { useEffect, useState } from "react"
// import { useAuth } from "@/context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import { DashboardLayout } from "@/components/layout/DashboardLayout"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Building2, Users, Activity, Plus, TrendingUp, Target, Award } from "lucide-react"
// import { TrazabilidadEtapa1 } from "../../components/ejecutivaComponents/TrazabilidadEtapa1"
// import { TrazabilidadEtapa2 } from "../../components/ejecutivaComponents/TrazabilidadEtapa2"
// import { AddTrazabilidadDialog } from "../../components/ejecutivaComponents/AddTrazabilidadDialog"

// const navItems = [
//   { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
//   { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
//   { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
//   { label: "Mi Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
// ]

// export default function TrazabilidadPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [activeTab, setActiveTab] = useState("etapa1")
//   const [showAddTrazabilidad, setShowAddTrazabilidad] = useState(false)
//   const [stats, setStats] = useState({
//     totalContactos: 0,
//     oportunidadesGeneradas: 0,
//     ventasGanadas: 0,
//     tasaConversion: 0,
//     montoTotal: 0,
//     enProceso: 0
//   })
//   const [refreshKey, setRefreshKey] = useState(0)

//   useEffect(() => {
//     if (!user || user.role !== "ejecutiva") {
//       navigate("/login")
//       return
//     }
//     fetchStats()
//   }, [user, navigate, refreshKey])

//   const fetchStats = async () => {
//     try {
//       // TODO: Implementar llamada real al backend
//       // const response = await fetch(`/api/ejecutiva/${user.id}/trazabilidad/stats`)
//       // const data = await response.json()
      
//       // Mock temporal
//       setStats({
//         totalContactos: 45,
//         oportunidadesGeneradas: 18,
//         ventasGanadas: 8,
//         tasaConversion: 44.4,
//         montoTotal: 450000,
//         enProceso: 10
//       })
//     } catch (error) {
//       console.error("Error fetching stats:", error)
//     }
//   }

//   const handleTrazabilidadCreated = () => {
//     setRefreshKey(prev => prev + 1)
//     fetchStats()
//   }

//   return (
//     <DashboardLayout 
//       navItems={navItems} 
//       title="Mi Trazabilidad" 
//       subtitle="Gestión de oportunidades y seguimiento de ventas"
//     >
//       <div className="space-y-6">
//         {/* Header con botón de acción */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Mi Trazabilidad</h2>
//             <p className="text-white/60">Gestiona tus contactos y oportunidades de venta</p>
//           </div>
//           <Button
//             onClick={() => setShowAddTrazabilidad(true)}
//             className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Nueva Actividad
//           </Button>
//         </div>

//         {/* KPI Stats */}
//         <div className="grid gap-4 md:grid-cols-6">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Total Contactos</CardTitle>
//               <Activity className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.totalContactos}</div>
//               <p className="text-xs text-white/60 mt-1">Etapa 1</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Oportunidades</CardTitle>
//               <Target className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.oportunidadesGeneradas}</div>
//               <p className="text-xs text-white/60 mt-1">Generadas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">En Proceso</CardTitle>
//               <TrendingUp className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.enProceso}</div>
//               <p className="text-xs text-white/60 mt-1">Activas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Ganadas</CardTitle>
//               <Award className="h-4 w-4 text-[#10B981]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.ventasGanadas}</div>
//               <p className="text-xs text-white/60 mt-1">Cerradas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Monto Total</CardTitle>
//               <TrendingUp className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">
//                 ${(stats.montoTotal / 1000).toFixed(0)}K
//               </div>
//               <p className="text-xs text-white/60 mt-1">Pipeline</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Conversión</CardTitle>
//               <Target className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.tasaConversion.toFixed(1)}%</div>
//               <p className="text-xs text-white/60 mt-1">Efectividad</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs para Etapas */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 bg-gradient-to-br from-[#024a46] to-[#013936] border border-[#C7E196]/20 p-1">
//             <TabsTrigger
//               value="etapa1"
//               className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
//             >
//               <Activity className="w-4 h-4 mr-2" />
//               Etapa 1: Generación de Oportunidad
//             </TabsTrigger>
//             <TabsTrigger
//               value="etapa2"
//               className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
//             >
//               <Target className="w-4 h-4 mr-2" />
//               Etapa 2: Gestión de Oportunidad
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="etapa1" className="space-y-4 mt-6">
//             <TrazabilidadEtapa1 
//               ejecutivaId={user?.id || ""}
//               refreshKey={refreshKey}
//             />
//           </TabsContent>

//           <TabsContent value="etapa2" className="space-y-4 mt-6">
//             <TrazabilidadEtapa2 
//               ejecutivaId={user?.id || ""}
//               refreshKey={refreshKey}
//             />
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Dialog para agregar trazabilidad */}
//       <AddTrazabilidadDialog
//         open={showAddTrazabilidad}
//         ejecutivaId={user?.id || ""}
//         onSuccess={handleTrazabilidadCreated}
//         onClose={() => setShowAddTrazabilidad(false)}
//       />
//     </DashboardLayout>
//   )
// }

// frontend/src/pages/ejecutiva/TrazabilidadPage.tsx
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Building2, Users, Activity, Plus, TrendingUp, Target, Award } from "lucide-react"
import { TrazabilidadEtapa1 } from "../../components/ejecutivaComponents/TrazabilidadEtapa1"
import { TrazabilidadEtapa2 } from "../../components/ejecutivaComponents/TrazabilidadEtapa2"
import { AddTrazabilidadDialog } from "../../components/ejecutivaComponents/AddTrazabilidadDialog"
import { ejecutivaService } from "@/services/ejecutivaService"
import { toast } from "sonner"

const navItems = [
  { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

interface TrazabilidadStats {
  totalContactos: number
  oportunidadesGeneradas: number
  ventasGanadas: number
  tasaConversion: number
  montoTotal: number
  enProceso: number
}

export default function TrazabilidadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("etapa1")
  const [showAddTrazabilidad, setShowAddTrazabilidad] = useState(false)
  const [stats, setStats] = useState<TrazabilidadStats>({
    totalContactos: 0,
    oportunidadesGeneradas: 0,
    ventasGanadas: 0,
    tasaConversion: 0,
    montoTotal: 0,
    enProceso: 0
  })
  const [refreshKey, setRefreshKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchStats()
  }, [user, navigate, refreshKey])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      console.log('📊 Fetching trazabilidad stats for ejecutiva:', user?.id)
      
      // Usar el endpoint específico de trazabilidad
      const statsData = await ejecutivaService.getTrazabilidadStats(user!.id)
      console.log('✅ Trazabilidad stats received:', statsData)
      
      setStats(statsData)
    } catch (error) {
      console.error("❌ Error fetching trazabilidad stats:", error)
      toast.error("Error al cargar estadísticas")
      
      // Fallback con datos en 0 si falla
      setStats({
        totalContactos: 0,
        oportunidadesGeneradas: 0,
        ventasGanadas: 0,
        tasaConversion: 0,
        montoTotal: 0,
        enProceso: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrazabilidadCreated = () => {
    console.log('✅ Trazabilidad created, refreshing data...')
    setRefreshKey(prev => prev + 1)
    toast.success("Actividad registrada exitosamente")
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return `${value.toFixed(0)}`
  }

  return (
    <DashboardLayout 
      navItems={navItems} 
      title="Mi Trazabilidad" 
      subtitle="Gestión de oportunidades y seguimiento de ventas"
    >
      <div className="space-y-6">
        {/* Header con botón de acción */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Mi Trazabilidad</h2>
            <p className="text-white/60">Gestiona tus contactos y oportunidades de venta</p>
          </div>
          <Button
            onClick={() => setShowAddTrazabilidad(true)}
            className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Actividad
          </Button>
        </div>

        {/* KPI Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Total Contactos</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : stats.totalContactos}
              </div>
              <p className="text-xs text-white/60 mt-1">Etapa 1</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Oportunidades</CardTitle>
              <Target className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : stats.oportunidadesGeneradas}
              </div>
              <p className="text-xs text-white/60 mt-1">Generadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">En Proceso</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : stats.enProceso}
              </div>
              <p className="text-xs text-white/60 mt-1">Activas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Ganadas</CardTitle>
              <Award className="h-4 w-4 text-[#10B981]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : stats.ventasGanadas}
              </div>
              <p className="text-xs text-white/60 mt-1">Cerradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Monto Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : formatCurrency(stats.montoTotal)}
              </div>
              <p className="text-xs text-white/60 mt-1">Pipeline</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C7E196]">Conversión</CardTitle>
              <Target className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLoading ? "..." : `${stats.tasaConversion}%`}
              </div>
              <p className="text-xs text-white/60 mt-1">Efectividad</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para Etapas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-br from-[#024a46] to-[#013936] border border-[#C7E196]/20 p-1">
            <TabsTrigger
              value="etapa1"
              className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
            >
              <Activity className="w-4 h-4 mr-2" />
              Etapa 1: Generación de Oportunidad
            </TabsTrigger>
            <TabsTrigger
              value="etapa2"
              className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
            >
              <Target className="w-4 h-4 mr-2" />
              Etapa 2: Gestión de Oportunidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="etapa1" className="space-y-4 mt-6">
            <TrazabilidadEtapa1 
              ejecutivaId={user?.id || ""}
              refreshKey={refreshKey}
            />
          </TabsContent>

          <TabsContent value="etapa2" className="space-y-4 mt-6">
            <TrazabilidadEtapa2 
              ejecutivaId={user?.id || ""}
              refreshKey={refreshKey}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para agregar trazabilidad */}
      <AddTrazabilidadDialog
        open={showAddTrazabilidad}
        ejecutivaId={user?.id || ""}
        onSuccess={handleTrazabilidadCreated}
        onClose={() => setShowAddTrazabilidad(false)}
      />
    </DashboardLayout>
  )
}