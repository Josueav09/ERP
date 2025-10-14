// frontend/src/pages/ejecutiva/ClientesPage.tsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, Plus, Mail, Phone, MapPin, Building2 } from "lucide-react"
import { AddClienteDialog } from "../../components/ejecutivaComponents/AddClienteDialog"

interface Cliente {
  id_cliente: number
  nombre_cliente: string
  rut_cliente: string
  direccion?: string
  telefono?: string
  email?: string
  nombre_empresa: string
  estado: string
  total_actividades: number
}

// Datos mock para clientes
const mockClientes: Cliente[] = [
  {
    id_cliente: 1,
    nombre_cliente: "María González",
    rut_cliente: "12.345.678-9",
    direccion: "Av. Los Leones 123, Providencia",
    telefono: "+56987654321",
    email: "maria.gonzalez@email.com",
    nombre_empresa: "Tech Solutions SA",
    estado: "activo",
    total_actividades: 12
  },
  {
    id_cliente: 2,
    nombre_cliente: "Carlos Rodríguez",
    rut_cliente: "13.456.789-0",
    direccion: "Av. Providencia 456, Providencia",
    telefono: "+56976543210",
    email: "carlos.rodriguez@email.com",
    nombre_empresa: "Importadora Global",
    estado: "activo",
    total_actividades: 8
  },
  {
    id_cliente: 3,
    nombre_cliente: "Ana Silva",
    rut_cliente: "14.567.890-1",
    direccion: "Av. Vitacura 789, Las Condes",
    telefono: "+56965432109",
    email: "ana.silva@email.com",
    nombre_empresa: "Constructora Norte",
    estado: "activo",
    total_actividades: 5
  },
  {
    id_cliente: 4,
    nombre_cliente: "Pedro Martínez",
    rut_cliente: "15.678.901-2",
    direccion: "Av. Apoquindo 321, Las Condes",
    telefono: "+56954321098",
    email: "pedro.martinez@email.com",
    nombre_empresa: "Distribuidora Sur",
    estado: "activo",
    total_actividades: 15
  },
  {
    id_cliente: 5,
    nombre_cliente: "Laura Fernández",
    rut_cliente: "16.789.012-3",
    direccion: "Av. Kennedy 654, Las Condes",
    telefono: "+56943210987",
    email: "laura.fernandez@email.com",
    nombre_empresa: "Servicios Integrales",
    estado: "inactivo",
    total_actividades: 3
  },
  {
    id_cliente: 6,
    nombre_cliente: "Roberto Navarro",
    rut_cliente: "17.890.123-4",
    direccion: "Av. Bilbao 987, Providencia",
    telefono: "+56932109876",
    email: "roberto.navarro@email.com",
    nombre_empresa: "Tech Solutions SA",
    estado: "activo",
    total_actividades: 7
  }
]

const navItems = [
  { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mis Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

export default function ClientesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCliente, setShowAddCliente] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    // Simular carga de datos
    setTimeout(() => {
      setClientes(mockClientes)
      setLoading(false)
    }, 1000)
  }, [user, navigate])

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.rut_cliente.includes(searchTerm) ||
    cliente.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClienteCreated = () => {
    // En una implementación real, aquí harías fetch de los datos actualizados
    setClientes([...mockClientes])
  }

  const getEstadoBadge = (estado: string) => {
    const badges = {
      activo: "bg-[#C7E196] text-[#013936]",
      inactivo: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    }
    return badges[estado as keyof typeof badges] || "bg-gray-500/20 text-gray-400"
  }

  const getEstadoLabel = (estado: string) => {
    const labels = {
      activo: "Activo",
      inactivo: "Inactivo",
    }
    return labels[estado as keyof typeof labels] || estado
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Gestiona tus clientes asignados">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando clientes...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Gestiona tus clientes asignados">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
            <p className="text-white/60">Gestiona y visualiza todos tus clientes</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddCliente(true)}
              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Buscar clientes por nombre, RUT o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Total Clientes</p>
            <p className="text-2xl font-bold text-white">{clientes.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Clientes Activos</p>
            <p className="text-2xl font-bold text-white">
              {clientes.filter(cli => cli.estado === 'activo').length}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Actividades Totales</p>
            <p className="text-2xl font-bold text-white">
              {clientes.reduce((sum, cli) => sum + cli.total_actividades, 0)}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Empresas Diferentes</p>
            <p className="text-2xl font-bold text-white">
              {new Set(clientes.map(cli => cli.nombre_empresa)).size}
            </p>
          </Card>
        </div>

        {/* Clientes Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <Table>
            <TableHeader>
              <TableRow className="border-[#C7E196]/20">
                <TableHead className="text-white">Cliente</TableHead>
                <TableHead className="text-white">RUT</TableHead>
                <TableHead className="text-white">Empresa</TableHead>
                <TableHead className="text-white">Contacto</TableHead>
                <TableHead className="text-white">Actividades</TableHead>
                <TableHead className="text-white">Estado</TableHead>
                <TableHead className="text-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id_cliente} className="border-[#C7E196]/10">
                  <TableCell className="font-medium text-white">
                    {cliente.nombre_cliente}
                  </TableCell>
                  <TableCell className="text-white/60">{cliente.rut_cliente}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#C7E196]" />
                      <span className="text-white">{cliente.nombre_empresa}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {cliente.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-white/60" />
                          <span className="text-white/60">{cliente.email}</span>
                        </div>
                      )}
                      {cliente.telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-white/60" />
                          <span className="text-white/60">{cliente.telefono}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60">{cliente.total_actividades}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoBadge(cliente.estado)}>
                      {getEstadoLabel(cliente.estado)}
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

          {filteredClientes.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No se encontraron clientes</h3>
              <p className="text-white/60">No hay clientes que coincidan con tu búsqueda</p>
            </div>
          )}
        </Card>
      </div>

      {/* Dialog */}
      {showAddCliente && (
        <AddClienteDialog
          ejecutivaId={user?.id || ""}
          onSuccess={handleClienteCreated}
          onClose={() => setShowAddCliente(false)}
        />
      )}
    </DashboardLayout>
  )
}