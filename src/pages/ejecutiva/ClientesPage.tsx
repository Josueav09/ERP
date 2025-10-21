// frontend/src/pages/ejecutiva/ClientesPage.tsx
// import { useState, useEffect } from "react"
// import { useAuth } from "@/context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import { DashboardLayout } from "@/components/layout/DashboardLayout"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Users, Search, Plus, Mail, Phone, MapPin, Building2 } from "lucide-react"
// import { AddClienteDialog } from "../../components/ejecutivaComponents/AddClienteDialog"

// interface Cliente {
//   id_cliente: number
//   nombre_cliente: string
//   rut_cliente: string
//   direccion?: string
//   telefono?: string
//   email?: string
//   nombre_empresa: string
//   estado: string
//   total_actividades: number
// }

// // Datos mock para clientes
// const mockClientes: Cliente[] = [
//   {
//     id_cliente: 1,
//     nombre_cliente: "María González",
//     rut_cliente: "12.345.678-9",
//     direccion: "Av. Los Leones 123, Providencia",
//     telefono: "+56987654321",
//     email: "maria.gonzalez@email.com",
//     nombre_empresa: "Tech Solutions SA",
//     estado: "activo",
//     total_actividades: 12
//   },
//   {
//     id_cliente: 2,
//     nombre_cliente: "Carlos Rodríguez",
//     rut_cliente: "13.456.789-0",
//     direccion: "Av. Providencia 456, Providencia",
//     telefono: "+56976543210",
//     email: "carlos.rodriguez@email.com",
//     nombre_empresa: "Importadora Global",
//     estado: "activo",
//     total_actividades: 8
//   },
//   {
//     id_cliente: 3,
//     nombre_cliente: "Ana Silva",
//     rut_cliente: "14.567.890-1",
//     direccion: "Av. Vitacura 789, Las Condes",
//     telefono: "+56965432109",
//     email: "ana.silva@email.com",
//     nombre_empresa: "Constructora Norte",
//     estado: "activo",
//     total_actividades: 5
//   },
//   {
//     id_cliente: 4,
//     nombre_cliente: "Pedro Martínez",
//     rut_cliente: "15.678.901-2",
//     direccion: "Av. Apoquindo 321, Las Condes",
//     telefono: "+56954321098",
//     email: "pedro.martinez@email.com",
//     nombre_empresa: "Distribuidora Sur",
//     estado: "activo",
//     total_actividades: 15
//   },
//   {
//     id_cliente: 5,
//     nombre_cliente: "Laura Fernández",
//     rut_cliente: "16.789.012-3",
//     direccion: "Av. Kennedy 654, Las Condes",
//     telefono: "+56943210987",
//     email: "laura.fernandez@email.com",
//     nombre_empresa: "Servicios Integrales",
//     estado: "inactivo",
//     total_actividades: 3
//   },
//   {
//     id_cliente: 6,
//     nombre_cliente: "Roberto Navarro",
//     rut_cliente: "17.890.123-4",
//     direccion: "Av. Bilbao 987, Providencia",
//     telefono: "+56932109876",
//     email: "roberto.navarro@email.com",
//     nombre_empresa: "Tech Solutions SA",
//     estado: "activo",
//     total_actividades: 7
//   }
// ]

// const navItems = [
//   { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
//   { label: "Mis Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
//   { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
//   { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
// ]

// export default function ClientesPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [clientes, setClientes] = useState<Cliente[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showAddCliente, setShowAddCliente] = useState(false)

//   useEffect(() => {
//     if (!user || user.role !== "ejecutiva") {
//       navigate("/login")
//       return
//     }
//     // Simular carga de datos
//     setTimeout(() => {
//       setClientes(mockClientes)
//       setLoading(false)
//     }, 1000)
//   }, [user, navigate])

//   const filteredClientes = clientes.filter(cliente =>
//     cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cliente.rut_cliente.includes(searchTerm) ||
//     cliente.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleClienteCreated = () => {
//     // En una implementación real, aquí harías fetch de los datos actualizados
//     setClientes([...mockClientes])
//   }

//   const getEstadoBadge = (estado: string) => {
//     const badges = {
//       activo: "bg-[#C7E196] text-[#013936]",
//       inactivo: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
//     }
//     return badges[estado as keyof typeof badges] || "bg-gray-500/20 text-gray-400"
//   }

//   const getEstadoLabel = (estado: string) => {
//     const labels = {
//       activo: "Activo",
//       inactivo: "Inactivo",
//     }
//     return labels[estado as keyof typeof labels] || estado
//   }

//   if (loading) {
//     return (
//       <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Gestiona tus clientes asignados">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-white text-lg">Cargando clientes...</div>
//         </div>
//       </DashboardLayout>
//     )
//   }

//   return (
//     <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Gestiona tus clientes asignados">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
//             <p className="text-white/60">Gestiona y visualiza todos tus clientes</p>
//           </div>
//           <div className="flex gap-3">
//             <Button
//               onClick={() => setShowAddCliente(true)}
//               className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Nuevo Cliente
//             </Button>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
//           <Input
//             placeholder="Buscar clientes por nombre, RUT o empresa..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
//           />
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-4 gap-4">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Total Clientes</p>
//             <p className="text-2xl font-bold text-white">{clientes.length}</p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Clientes Activos</p>
//             <p className="text-2xl font-bold text-white">
//               {clientes.filter(cli => cli.estado === 'activo').length}
//             </p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Actividades Totales</p>
//             <p className="text-2xl font-bold text-white">
//               {clientes.reduce((sum, cli) => sum + cli.total_actividades, 0)}
//             </p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Empresas Diferentes</p>
//             <p className="text-2xl font-bold text-white">
//               {new Set(clientes.map(cli => cli.nombre_empresa)).size}
//             </p>
//           </Card>
//         </div>

//         {/* Clientes Table */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <Table>
//             <TableHeader>
//               <TableRow className="border-[#C7E196]/20">
//                 <TableHead className="text-white">Cliente</TableHead>
//                 <TableHead className="text-white">RUT</TableHead>
//                 <TableHead className="text-white">Empresa</TableHead>
//                 <TableHead className="text-white">Contacto</TableHead>
//                 <TableHead className="text-white">Actividades</TableHead>
//                 <TableHead className="text-white">Estado</TableHead>
//                 <TableHead className="text-white">Acciones</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredClientes.map((cliente) => (
//                 <TableRow key={cliente.id_cliente} className="border-[#C7E196]/10">
//                   <TableCell className="font-medium text-white">
//                     {cliente.nombre_cliente}
//                   </TableCell>
//                   <TableCell className="text-white/60">{cliente.rut_cliente}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Building2 className="w-4 h-4 text-[#C7E196]" />
//                       <span className="text-white">{cliente.nombre_empresa}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       {cliente.email && (
//                         <div className="flex items-center gap-2 text-sm">
//                           <Mail className="w-3 h-3 text-white/60" />
//                           <span className="text-white/60">{cliente.email}</span>
//                         </div>
//                       )}
//                       {cliente.telefono && (
//                         <div className="flex items-center gap-2 text-sm">
//                           <Phone className="w-3 h-3 text-white/60" />
//                           <span className="text-white/60">{cliente.telefono}</span>
//                         </div>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-white/60">{cliente.total_actividades}</TableCell>
//                   <TableCell>
//                     <Badge className={getEstadoBadge(cliente.estado)}>
//                       {getEstadoLabel(cliente.estado)}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
//                     >
//                       Ver Detalles
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {filteredClientes.length === 0 && (
//             <div className="p-12 text-center">
//               <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-white mb-2">No se encontraron clientes</h3>
//               <p className="text-white/60">No hay clientes que coincidan con tu búsqueda</p>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Dialog */}
//       {showAddCliente && (
//         <AddClienteDialog
//           ejecutivaId={user?.id || ""}
//           onSuccess={handleClienteCreated}
//           onClose={() => setShowAddCliente(false)}
//         />
//       )}
//     </DashboardLayout>
//   )
// }

// frontend/src/pages/ejecutiva/ClientesPage.tsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Mail, Phone, MapPin, Building2, UserPlus, ChevronDown, ChevronUp } from "lucide-react"
import { AddClienteDialog } from "../../components/ejecutivaComponents/AddClienteDialog"
import { AddContactoDialog } from "../../components/ejecutivaComponents/AddContactoDialog"

interface PersonaContacto {
  id_contacto: number
  dni?: string
  nombre_completo: string
  cargo?: string
  correo?: string
  telefono?: string
  linkedin?: string
}

interface ClienteFinal {
  id_cliente_final: number
  ruc?: string
  razon_social: string
  pagina_web?: string
  correo?: string
  telefono?: string
  pais: string
  departamento?: string
  provincia?: string
  direccion?: string
  linkedin?: string
  rubro?: string
  sub_rubro?: string
  tamanio_empresa?: string
  personas_contacto: PersonaContacto[]
  total_trazabilidad: number
}

// Datos mock
const mockClientes: ClienteFinal[] = [
  {
    id_cliente_final: 1,
    ruc: "20100130204",
    razon_social: "Banco de Crédito del Perú",
    correo: "contacto@bcp.com.pe",
    telefono: "+51987654321",
    pais: "Perú",
    departamento: "Lima",
    provincia: "Lima",
    direccion: "Av. Centenario 156, La Molina",
    rubro: "Finanzas",
    sub_rubro: "Banca",
    tamanio_empresa: "Grande",
    total_trazabilidad: 12,
    personas_contacto: [
      {
        id_contacto: 1,
        nombre_completo: "Ana Torres",
        cargo: "Jefa de Compras",
        correo: "ana.torres@bcp.com.pe",
        telefono: "+51987654321"
      },
      {
        id_contacto: 2,
        nombre_completo: "Carlos Vega",
        cargo: "Coordinador de TI",
        correo: "carlos.vega@bcp.com.pe",
        telefono: "+51999888777"
      }
    ]
  },
  {
    id_cliente_final: 2,
    ruc: "20100070970",
    razon_social: "Supermercados Peruanos S.A.",
    correo: "ventas@spsa.pe",
    telefono: "+51976543210",
    pais: "Perú",
    departamento: "Lima",
    provincia: "Lima",
    direccion: "Av. Morales Duárez 1372, Mirones",
    rubro: "Retail",
    sub_rubro: "Supermercados",
    tamanio_empresa: "Grande",
    total_trazabilidad: 8,
    personas_contacto: [
      {
        id_contacto: 3,
        nombre_completo: "María Gonzales",
        cargo: "Gerente de Compras",
        correo: "maria.gonzales@spsa.pe",
        telefono: "+51965432109"
      }
    ]
  }
]

const navItems = [
  { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

export default function ClientesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<ClienteFinal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCliente, setShowAddCliente] = useState(false)
  const [showAddContacto, setShowAddContacto] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)
  const [expandedCliente, setExpandedCliente] = useState<number | null>(null)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchClientes()
  }, [user, navigate])

  const fetchClientes = async () => {
    setLoading(true)
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/ejecutiva/${user.id}/clientes`)
      // const data = await response.json()
      setClientes(mockClientes)
    } catch (error) {
      console.error("Error fetching clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.ruc?.includes(searchTerm) ||
    cliente.rubro?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClienteCreated = () => {
    fetchClientes()
  }

  const handleContactoCreated = () => {
    fetchClientes()
    setShowAddContacto(false)
    setSelectedClienteId(null)
  }

  const handleAddContacto = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setShowAddContacto(true)
  }

  const toggleExpand = (clienteId: number) => {
    setExpandedCliente(expandedCliente === clienteId ? null : clienteId)
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Clientes finales de tu empresa">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando clientes...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems} title="Mis Clientes" subtitle="Clientes finales de tu empresa">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Mis Clientes</h2>
            <p className="text-white/60">Gestiona los clientes finales de tu empresa proveedora</p>
          </div>
          <Button
            onClick={() => setShowAddCliente(true)}
            className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Buscar clientes por nombre, RUT o rubro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Total Clientes</p>
            <p className="text-2xl font-bold text-white">{clientes.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Personas de Contacto</p>
            <p className="text-2xl font-bold text-white">
              {clientes.reduce((sum, cli) => sum + cli.personas_contacto.length, 0)}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
            <p className="text-white/60 text-sm">Actividades Totales</p>
            <p className="text-2xl font-bold text-white">
              {clientes.reduce((sum, cli) => sum + cli.total_trazabilidad, 0)}
            </p>
          </Card>
        </div>

        {/* Clientes Cards */}
        <div className="space-y-4">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id_cliente_final} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
              {/* Cliente header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                      <Building2 className="w-6 h-6 text-[#C7E196]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">{cliente.razon_social}</h3>
                      <p className="text-white/60 text-sm mt-1">RUC: {cliente.ruc || "No especificado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#C7E196]/20 text-[#C7E196] border border-[#C7E196]/30">
                      {cliente.tamanio_empresa || "N/A"}
                    </Badge>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    {cliente.correo && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Mail className="w-4 h-4" />
                        <span>{cliente.correo}</span>
                      </div>
                    )}
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Phone className="w-4 h-4" />
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.direccion && (
                      <div className="flex items-start gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{cliente.direccion}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-white/60">Rubro: </span>
                      <span className="text-white">{cliente.rubro || "No especificado"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Sub-rubro: </span>
                      <span className="text-white">{cliente.sub_rubro || "No especificado"}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/60">Ubicación: </span>
                      <span className="text-white">{cliente.provincia}, {cliente.departamento}</span>
                    </div>
                  </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C7E196]" />
                      <span className="text-sm text-white/60">
                        {cliente.personas_contacto.length} {cliente.personas_contacto.length === 1 ? 'contacto' : 'contactos'}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">
                      {cliente.total_trazabilidad} actividades
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddContacto(cliente.id_cliente_final)}
                      className="border-[#C7E196]/30 text-[#C7E196] hover:bg-[#C7E196]/10"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Contacto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(cliente.id_cliente_final)}
                      className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
                    >
                      {expandedCliente === cliente.id_cliente_final ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Ocultar Contactos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Ver Contactos
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personas de contacto expandible */}
              {expandedCliente === cliente.id_cliente_final && cliente.personas_contacto.length > 0 && (
                <div className="border-t border-white/10 bg-white/5 p-6">
                  <h4 className="text-sm font-semibold text-white mb-4">Personas de Contacto</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {cliente.personas_contacto.map((contacto) => (
                      <Card key={contacto.id_contacto} className="bg-[#013936]/50 border-[#C7E196]/10 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-white">{contacto.nombre_completo}</h5>
                            {contacto.cargo && (
                              <p className="text-sm text-white/60 mt-1">{contacto.cargo}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {contacto.correo && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-[#C7E196]" />
                              <span className="text-white/80">{contacto.correo}</span>
                            </div>
                          )}
                          {contacto.telefono && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-[#C7E196]" />
                              <span className="text-white/80">{contacto.telefono}</span>
                            </div>
                          )}
                          {contacto.linkedin && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3 text-[#C7E196]" />
                              <a 
                                href={contacto.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#C7E196] hover:underline"
                              >
                                LinkedIn
                              </a>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado sin contactos */}
              {expandedCliente === cliente.id_cliente_final && cliente.personas_contacto.length === 0 && (
                <div className="border-t border-white/10 bg-white/5 p-6">
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 mb-4">No hay personas de contacto registradas</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddContacto(cliente.id_cliente_final)}
                      className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Primera Persona
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Estado vacío */}
        {filteredClientes.length === 0 && (
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-12 text-center">
            <Building2 className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No se encontraron clientes</h3>
            <p className="text-white/60 mb-6">
              {searchTerm 
                ? "No hay clientes que coincidan con tu búsqueda" 
                : "Aún no tienes clientes registrados"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowAddCliente(true)}
                className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primer Cliente
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {showAddCliente && (
        <AddClienteDialog
           open={showAddCliente} 
          ejecutivaId={user?.id || ""}
          onSuccess={handleClienteCreated}
          onClose={() => setShowAddCliente(false)}
        />
      )}

      {showAddContacto && selectedClienteId && (
        <AddContactoDialog
          open={showAddContacto}
          clienteId={selectedClienteId}
          onSuccess={handleContactoCreated}
          onClose={() => {
            setShowAddContacto(false)
            setSelectedClienteId(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}