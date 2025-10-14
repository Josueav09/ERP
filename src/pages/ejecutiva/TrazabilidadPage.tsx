// frontend/src/pages/ejecutiva/TrazabilidadPage.tsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Search, Filter, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react"

interface Trazabilidad {
  id_trazabilidad: number
  tipo_actividad: string
  descripcion: string
  fecha_actividad: string
  estado: string
  nombre_empresa: string
  nombre_cliente: string | null
}

// Datos mock para trazabilidad
const mockTrazabilidad: Trazabilidad[] = [
  {
    id_trazabilidad: 1,
    tipo_actividad: "Llamada de seguimiento",
    descripcion: "Seguimiento mensual con el cliente para revisar servicios",
    fecha_actividad: "2024-10-14T10:30:00Z",
    estado: "completado",
    nombre_empresa: "Tech Solutions SA",
    nombre_cliente: "María González"
  },
  {
    id_trazabilidad: 2,
    tipo_actividad: "Visita técnica",
    descripcion: "Instalación de nuevo equipo en oficinas del cliente",
    fecha_actividad: "2024-10-13T14:00:00Z",
    estado: "completado",
    nombre_empresa: "Importadora Global",
    nombre_cliente: "Carlos Rodríguez"
  },
  {
    id_trazabilidad: 3,
    tipo_actividad: "Reunión de negocios",
    descripcion: "Presentación de nuevos servicios y propuesta comercial",
    fecha_actividad: "2024-10-12T11:00:00Z",
    estado: "en_proceso",
    nombre_empresa: "Constructora Norte",
    nombre_cliente: "Ana Silva"
  },
  {
    id_trazabilidad: 4,
    tipo_actividad: "Soporte técnico",
    descripcion: "Resolución de incidencia reportada por el cliente",
    fecha_actividad: "2024-10-11T16:45:00Z",
    estado: "completado",
    nombre_empresa: "Distribuidora Sur",
    nombre_cliente: "Pedro Martínez"
  },
  {
    id_trazabilidad: 5,
    tipo_actividad: "Capacitación",
    descripcion: "Entrenamiento en uso de nueva plataforma",
    fecha_actividad: "2024-10-10T09:00:00Z",
    estado: "pendiente",
    nombre_empresa: "Servicios Integrales",
    nombre_cliente: "Laura Fernández"
  },
  {
    id_trazabilidad: 6,
    tipo_actividad: "Evaluación de servicio",
    descripcion: "Revisión de métricas y satisfacción del cliente",
    fecha_actividad: "2024-10-09T15:20:00Z",
    estado: "completado",
    nombre_empresa: "Tech Solutions SA",
    nombre_cliente: "Roberto Navarro"
  },
  {
    id_trazabilidad: 7,
    tipo_actividad: "Llamada comercial",
    descripcion: "Contacto inicial con prospecto interesado",
    fecha_actividad: "2024-10-08T13:15:00Z",
    estado: "cancelado",
    nombre_empresa: "Importadora Global",
    nombre_cliente: null
  }
]

const navItems = [
  { label: "Resumen", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mis Empresas", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

export default function TrazabilidadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterEmpresa, setFilterEmpresa] = useState("todas")

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    // Simular carga de datos
    setTimeout(() => {
      setTrazabilidad(mockTrazabilidad)
      setLoading(false)
    }, 1000)
  }, [user, navigate])

  const empresasUnicas = Array.from(new Set(trazabilidad.map(item => item.nombre_empresa)))

  const filteredTrazabilidad = trazabilidad.filter(item => {
    const matchesSearch = 
      item.tipo_actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filterEstado === "todos" || item.estado === filterEstado
    const matchesEmpresa = filterEmpresa === "todas" || item.nombre_empresa === filterEmpresa

    return matchesSearch && matchesEstado && matchesEmpresa
  })

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

  const getEstadoIcon = (estado: string) => {
    const icons = {
      completado: <CheckCircle2 className="w-4 h-4" />,
      en_proceso: <Clock className="w-4 h-4" />,
      pendiente: <AlertCircle className="w-4 h-4" />,
      cancelado: <AlertCircle className="w-4 h-4" />,
    }
    return icons[estado as keyof typeof icons] || <Activity className="w-4 h-4" />
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Trazabilidad" subtitle="Historial de actividades y seguimientos">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando trazabilidad...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems} title="Mi Trazabilidad" subtitle="Historial de actividades y seguimientos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Mi Trazabilidad</h2>
            <p className="text-white/60">Historial completo de todas tus actividades</p>
          </div>
          <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold">
            <Activity className="w-4 h-4 mr-2" />
            Nueva Actividad
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="en_proceso">En proceso</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEmpresa} onValueChange={setFilterEmpresa}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las empresas</SelectItem>
              {empresasUnicas.map(empresa => (
                <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Total Actividades</p>
            <p className="text-2xl font-bold text-white">{trazabilidad.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Completadas</p>
            <p className="text-2xl font-bold text-white">
              {trazabilidad.filter(item => item.estado === 'completado').length}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">En Proceso</p>
            <p className="text-2xl font-bold text-white">
              {trazabilidad.filter(item => item.estado === 'en_proceso').length}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Este Mes</p>
            <p className="text-2xl font-bold text-white">
              {trazabilidad.filter(item => {
                const activityDate = new Date(item.fecha_actividad)
                const now = new Date()
                return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear()
              }).length}
            </p>
          </Card>
        </div>

        {/* Trazabilidad Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <Table>
            <TableHeader>
              <TableRow className="border-[#C7E196]/20">
                <TableHead className="text-white">Actividad</TableHead>
                <TableHead className="text-white">Descripción</TableHead>
                <TableHead className="text-white">Empresa</TableHead>
                <TableHead className="text-white">Cliente</TableHead>
                <TableHead className="text-white">Fecha</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrazabilidad.map((item) => (
                <TableRow key={item.id_trazabilidad} className="border-[#C7E196]/10">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      {getEstadoIcon(item.estado)}
                      {item.tipo_actividad}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60 max-w-md">
                    <div className="line-clamp-2">{item.descripcion}</div>
                  </TableCell>
                  <TableCell className="text-white">{item.nombre_empresa}</TableCell>
                  <TableCell className="text-white/60">
                    {item.nombre_cliente || "No asignado"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div className="text-sm">{new Date(item.fecha_actividad).toLocaleDateString()}</div>
                        <div className="text-xs">{getTimeAgo(item.fecha_actividad)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(item.estado)}>
                      {getEstadoLabel(item.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTrazabilidad.length === 0 && (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No se encontraron actividades</h3>
              <p className="text-white/60">No hay actividades que coincidan con tus filtros</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}