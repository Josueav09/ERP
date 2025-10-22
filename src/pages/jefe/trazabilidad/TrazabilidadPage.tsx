// import { useEffect, useState } from "react"
// import { useAuth } from "@/context/AuthContext"
// import { useNavigate, useSearchParams } from "react-router-dom"
// import { DashboardLayout } from "@/components/layout/DashboardLayout"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Users,
//   Building2,
//   UserCheck,
//   Activity,
//   LayoutDashboard,
//   Filter,
//   X,
//   ChevronRight,
//   FileText,
//   User,
//   TrendingUp,
//   Target,
//   Award,
//   Zap,
//   Download,
// } from "lucide-react"
// import { useToast } from "@/hooks/useToast"
// import { jefeService, type Trazabilidad, type Empresa, type Ejecutiva, type ClienteFinal } from "@/services/jefeService"
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// const navItems = [
//   { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
//   { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
//   { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
//   { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
//   { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
//   { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
//   { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
// ]

// export default function TrazabilidadPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [searchParams] = useSearchParams()
//   const { toast } = useToast()

//   // State
//   const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([])
//   const [empresas, setEmpresas] = useState<Empresa[]>([])
//   const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([])
//   const [clientes, setClientes] = useState<ClienteFinal[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false)
//   const [selectedActivity, setSelectedActivity] = useState<Trazabilidad | null>(null)
//   const [activeTab, setActiveTab] = useState("etapa1")

//   // Filters
//   const [empresaFilter, setEmpresaFilter] = useState("all")
//   const [ejecutivaFilter, setEjecutivaFilter] = useState(searchParams.get("ejecutiva") || "all")
//   const [clienteFilter, setClienteFilter] = useState("all")
//   const [resultadoFilter, setResultadoFilter] = useState("all")
//   const [etapaFilter, setEtapaFilter] = useState("all")
//   const [tipoContactoFilter, setTipoContactoFilter] = useState("all")
//   const [fechaDesdeFilter, setFechaDesdeFilter] = useState("")
//   const [fechaHastaFilter, setFechaHastaFilter] = useState("")

//   const chartDataNuevosClientes = [
//     { mes: "Ene", clientes: 12 },
//     { mes: "Feb", clientes: 19 },
//     { mes: "Mar", clientes: 15 },
//     { mes: "Abr", clientes: 25 },
//     { mes: "May", clientes: 22 },
//     { mes: "Jun", clientes: 28 },
//   ]

//   const chartDataContactos = [
//     { name: "Llamadas", value: 45, color: "#C7E196" },
//     { name: "Emails", value: 30, color: "#3B82F6" },
//     { name: "Reuniones", value: 20, color: "#10B981" },
//     { name: "Visitas", value: 5, color: "#F59E0B" },
//   ]

//   const chartDataMontos = [
//     { etapa: "Etapa 1", monto: 45000 },
//     { etapa: "Etapa 2", monto: 120000 },
//     { etapa: "Etapa 3", monto: 85000 },
//   ]

//   const chartDataConversion = [
//     { ejecutiva: "María", tasa: 45 },
//     { ejecutiva: "Carmen", tasa: 52 },
//     { ejecutiva: "Laura", tasa: 38 },
//     { ejecutiva: "Ana", tasa: 48 },
//   ]

//   const hasActiveFilters =
//     empresaFilter !== "all" ||
//     ejecutivaFilter !== "all" ||
//     clienteFilter !== "all" ||
//     resultadoFilter !== "all" ||
//     etapaFilter !== "all" ||
//     tipoContactoFilter !== "all" ||
//     fechaDesdeFilter ||
//     fechaHastaFilter

//   const filteredTrazabilidad = trazabilidad.filter((item) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       item.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.nombre_cliente || "").toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesEmpresa = empresaFilter === "all" || item.id_empresa.toString() === empresaFilter
//     const matchesEjecutiva = ejecutivaFilter === "all" || item.id_ejecutiva.toString() === ejecutivaFilter
//     const matchesCliente = clienteFilter === "all" || item.id_cliente?.toString() === clienteFilter

//     return matchesSearch && matchesEmpresa && matchesEjecutiva && matchesCliente
//   })

//   const clearFilters = () => {
//     setEmpresaFilter("all")
//     setEjecutivaFilter("all")
//     setClienteFilter("all")
//     setResultadoFilter("all")
//     setEtapaFilter("all")
//     setTipoContactoFilter("all")
//     setFechaDesdeFilter("")
//     setFechaHastaFilter("")
//     setSearchTerm("")
//   }

//   const openDetailDialog = (item: Trazabilidad) => {
//     setSelectedActivity(item)
//     setDetailDialogOpen(true)
//   }

//   const formatDate = (date: string | Date) => {
//     return new Date(date).toLocaleDateString("es-ES", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const getTipoActividadBadge = (tipo: string) => {
//     const tipos: Record<string, string> = {
//       llamada: "bg-blue-500/20 text-blue-300 border-blue-500/30",
//       email: "bg-purple-500/20 text-purple-300 border-purple-500/30",
//       reunion: "bg-green-500/20 text-green-300 border-green-500/30",
//       visita: "bg-orange-500/20 text-orange-300 border-orange-500/30",
//     }
//     return tipos[tipo] || "bg-white/10 text-white/60 border-white/20"
//   }

//   const getEstadoBadgeColor = (estado: string) => {
//     const estados: Record<string, string> = {
//       completado: "bg-[#C7E196] text-[#013936]",
//       en_proceso: "bg-blue-500/20 text-blue-300 border-blue-500/30",
//       pendiente: "bg-orange-500/20 text-orange-300 border-orange-500/30",
//     }
//     return estados[estado] || "bg-white/10 text-white/60"
//   }

//   useEffect(() => {
//     const fetchTrazabilidad = async () => {
//       try {
//         setLoading(true)
//         const data = await jefeService.getTrazabilidad()
//         setTrazabilidad(data)
//       } catch (error) {
//         console.error("Error al cargar la trazabilidad")
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchEmpresas = async () => {
//       try {
//         const data = await jefeService.getEmpresas()
//         setEmpresas(data)
//       } catch (error) {
//         console.error("Error al cargar las empresas")
//       }
//     }

//     const fetchEjecutivas = async () => {
//       try {
//         const data = await jefeService.getEjecutivas()
//         setEjecutivas(data)
//       } catch (error) {
//         console.error("Error al cargar las ejecutivas")
//       }
//     }

//     const fetchClientes = async () => {
//       try {
//         const data = await jefeService.getClientes()
//         setClientes(data)
//       } catch (error) {
//         console.error("Error al cargar los clientes")
//       }
//     }

//     fetchTrazabilidad()
//     fetchEmpresas()
//     fetchEjecutivas()
//     fetchClientes()
//   }, [])

//   return (
//     <DashboardLayout
//       navItems={navItems}
//       title="Trazabilidad de Oportunidades"
//       subtitle="Monitorea el desempeño de ejecutivas y gestión de ventas"
//     >
//       <div className="space-y-6">
//         {/* Filters Section */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Filtros Avanzados</CardTitle>
//               </div>
//               {hasActiveFilters && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="text-white/80 hover:text-white hover:bg-white/10"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Limpiar Filtros
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-4">
//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Ejecutiva</label>
//                 <Select value={ejecutivaFilter} onValueChange={setEjecutivaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todas las ejecutivas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas las ejecutivas</SelectItem>
//                     {ejecutivas.map((ejecutiva) => (
//                       <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
//                         {ejecutiva.nombre} {ejecutiva.apellido}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Empresa Proveedora</label>
//                 <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todas las empresas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas las empresas</SelectItem>
//                     {empresas.map((empresa) => (
//                       <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
//                         {empresa.nombre_empresa}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Cliente Final</label>
//                 <Select value={clienteFilter} onValueChange={setClienteFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todos los clientes" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los clientes</SelectItem>
//                     {clientes.map((cliente_final) => (
//                       <SelectItem key={cliente_final.id_cliente_final} value={cliente_final.id_cliente_final.toString()}>
//                         {cliente_final.razon_social}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Resultado Contacto</label>
//                 <Select value={resultadoFilter} onValueChange={setResultadoFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todos los resultados" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los resultados</SelectItem>
//                     <SelectItem value="exitoso">Exitoso</SelectItem>
//                     <SelectItem value="fallido">Fallido</SelectItem>
//                     <SelectItem value="pendiente">Pendiente</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Etapa Oportunidad</label>
//                 <Select value={etapaFilter} onValueChange={setEtapaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todas las etapas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas las etapas</SelectItem>
//                     <SelectItem value="etapa1">Etapa 1 - Generación</SelectItem>
//                     <SelectItem value="etapa2">Etapa 2 - Gestión</SelectItem>
//                     <SelectItem value="etapa3">Etapa 3 - Cierre</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Tipo Contacto</label>
//                 <Select value={tipoContactoFilter} onValueChange={setTipoContactoFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Todos los tipos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los tipos</SelectItem>
//                     <SelectItem value="llamada">Llamada</SelectItem>
//                     <SelectItem value="email">Email</SelectItem>
//                     <SelectItem value="reunion">Reunión</SelectItem>
//                     <SelectItem value="visita">Visita</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Fecha Desde</label>
//                 <Input
//                   type="date"
//                   value={fechaDesdeFilter}
//                   onChange={(e) => setFechaDesdeFilter(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Fecha Hasta</label>
//                 <Input
//                   type="date"
//                   value={fechaHastaFilter}
//                   onChange={(e) => setFechaHastaFilter(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* KPIs Charts Section */}
//         <div className="grid gap-4 md:grid-cols-2">
//           {/* Nuevos Clientes Chart */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5 text-[#C7E196]" />
//                 Nuevos Clientes
//               </CardTitle>
//               <CardDescription className="text-white/60">Comparación mes anterior vs actual</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartDataNuevosClientes}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#C7E196/20" />
//                   <XAxis stroke="#C7E196" />
//                   <YAxis stroke="#C7E196" />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#013936", border: "1px solid #C7E196" }}
//                     labelStyle={{ color: "#C7E196" }}
//                   />
//                   <Legend />
//                   <Line type="monotone" dataKey="clientes" stroke="#C7E196" strokeWidth={2} dot={{ fill: "#C7E196" }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Distribución de Contactos Chart */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center gap-2">
//                 <Target className="w-5 h-5 text-[#C7E196]" />
//                 Distribución de Contactos
//               </CardTitle>
//               <CardDescription className="text-white/60">Por canal de comunicación</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={chartDataContactos}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: ${value}`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {chartDataContactos.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#013936", border: "1px solid #C7E196" }}
//                     labelStyle={{ color: "#C7E196" }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Montos por Etapa Chart */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center gap-2">
//                 <Award className="w-5 h-5 text-[#C7E196]" />
//                 Montos por Etapa
//               </CardTitle>
//               <CardDescription className="text-white/60">Distribución de oportunidades</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartDataMontos}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#C7E196/20" />
//                   <XAxis stroke="#C7E196" />
//                   <YAxis stroke="#C7E196" />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#013936", border: "1px solid #C7E196" }}
//                     labelStyle={{ color: "#C7E196" }}
//                     formatter={(value) => `$${((value as number) / 1000).toFixed(0)}K`}
//                   />
//                   <Legend />
//                   <Bar dataKey="monto" fill="#C7E196" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           {/* Tasa de Conversión Chart */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <CardTitle className="text-white flex items-center gap-2">
//                 <Zap className="w-5 h-5 text-[#C7E196]" />
//                 Tasa de Conversión
//               </CardTitle>
//               <CardDescription className="text-white/60">Por ejecutiva</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartDataConversion}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#C7E196/20" />
//                   <XAxis stroke="#C7E196" />
//                   <YAxis stroke="#C7E196" />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#013936", border: "1px solid #C7E196" }}
//                     labelStyle={{ color: "#C7E196" }}
//                     formatter={(value) => `${value}%`}
//                   />
//                   <Legend />
//                   <Bar dataKey="tasa" fill="#C7E196" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </div>

//         {/* KPI Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-6">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Total Oportunidades</CardTitle>
//               <Activity className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">347</div>
//               <p className="text-xs text-white/60 mt-1">En el sistema</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">En Proceso</CardTitle>
//               <TrendingUp className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">128</div>
//               <p className="text-xs text-white/60 mt-1">37% activas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Ganadas</CardTitle>
//               <Award className="h-4 w-4 text-[#10B981]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">156</div>
//               <p className="text-xs text-white/60 mt-1">45% conversión</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Ventas Perdidas</CardTitle>
//               <TrendingUp className="h-4 w-4 text-red-400" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">63</div>
//               <p className="text-xs text-white/60 mt-1">18% perdidas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Monto Total</CardTitle>
//               <Zap className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">$2.9M</div>
//               <p className="text-xs text-white/60 mt-1">En oportunidades</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-[#C7E196]">Tasa Conversión</CardTitle>
//               <Target className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">45%</div>
//               <p className="text-xs text-white/60 mt-1">Promedio general</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Etapas Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 bg-gradient-to-br from-[#024a46] to-[#013936] border border-[#C7E196]/20 p-1">
//             <TabsTrigger
//               value="etapa1"
//               className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
//             >
//               Etapa 1: Generación de Oportunidad
//             </TabsTrigger>
//             <TabsTrigger
//               value="etapa2"
//               className="data-[state=active]:bg-[#C7E196] data-[state=active]:text-[#013936] text-white/80"
//             >
//               Etapa 2: Gestión de Oportunidad
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="etapa1" className="space-y-4">
//             <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//               <CardHeader>
//                 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <CardTitle className="text-white">Registro de Primeros Contactos</CardTitle>
//                     <CardDescription className="text-white/60">
//                       Detección de necesidades y generación de oportunidades
//                     </CardDescription>
//                   </div>
//                   <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium whitespace-nowrap">
//                     <Download className="w-4 h-4 mr-2" />
//                     Exportar Reporte
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-md border border-white/10 overflow-hidden">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-white/10 hover:bg-transparent">
//                         <TableHead className="font-semibold text-[#C7E196]">Cliente Final</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Tipo Contacto</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Fecha Contacto</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Resultado</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Pasa Embudo</TableHead>
//                         <TableHead className="text-right font-semibold text-[#C7E196]">Detalles</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       <TableRow className="border-white/10 hover:bg-white/5">
//                         <TableCell className="text-white">Banco de Crédito BCP</TableCell>
//                         <TableCell className="text-white/80">María Fernández Rojas</TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30">Llamada</Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80">2025-10-18</TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">Exitoso</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#C7E196] text-[#013936]">Sí</Badge>
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                       <TableRow className="border-white/10 hover:bg-white/5">
//                         <TableCell className="text-white">Interbank</TableCell>
//                         <TableCell className="text-white/80">Carmen López Torres</TableCell>
//                         <TableCell>
//                           <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Email</Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80">2025-10-17</TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">Exitoso</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#C7E196] text-[#013936]">Sí</Badge>
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="etapa2" className="space-y-4">
//             <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//               <CardHeader>
//                 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <CardTitle className="text-white">Gestión de Oportunidades</CardTitle>
//                     <CardDescription className="text-white/60">
//                       Seguimiento en embudo de ventas y cierre de oportunidades
//                     </CardDescription>
//                   </div>
//                   <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium whitespace-nowrap">
//                     <Download className="w-4 h-4 mr-2" />
//                     Exportar Reporte
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-md border border-white/10 overflow-hidden">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-white/10 hover:bg-transparent">
//                         <TableHead className="font-semibold text-[#C7E196]">Cliente Final</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Etapa Actual</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Monto Oportunidad</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Probabilidad</TableHead>
//                         <TableHead className="font-semibold text-[#C7E196]">Fecha Estimada Cierre</TableHead>
//                         <TableHead className="text-right font-semibold text-[#C7E196]">Detalles</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       <TableRow className="border-white/10 hover:bg-white/5">
//                         <TableCell className="text-white">Scotiabank</TableCell>
//                         <TableCell className="text-white/80">María Fernández Rojas</TableCell>
//                         <TableCell>
//                           <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Propuesta</Badge>
//                         </TableCell>
//                         <TableCell className="text-white">$250,000</TableCell>
//                         <TableCell>
//                           <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">60%</Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80">2025-11-15</TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                       <TableRow className="border-white/10 hover:bg-white/5">
//                         <TableCell className="text-white">BBVA</TableCell>
//                         <TableCell className="text-white/80">Carmen López Torres</TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30">Negociación</Badge>
//                         </TableCell>
//                         <TableCell className="text-white">$180,000</TableCell>
//                         <TableCell>
//                           <Badge className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30">80%</Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80">2025-10-30</TableCell>
//                         <TableCell className="text-right">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Detail Dialog */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-[#C7E196] text-xl">Detalle de Actividad</DialogTitle>
//             <DialogDescription className="text-white/60">Información completa de la actividad</DialogDescription>
//           </DialogHeader>
//           {selectedActivity && (
//             <div className="space-y-4 mt-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div>
//                   <label className="text-sm font-medium text-[#C7E196]">Ejecutiva</label>
//                   <p className="text-white/90">{selectedActivity.ejecutiva_nombre}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium text-[#C7E196]">Empresa</label>
//                   <p className="text-white/90">{selectedActivity.nombre_empresa}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </DashboardLayout>
//   )
// }

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