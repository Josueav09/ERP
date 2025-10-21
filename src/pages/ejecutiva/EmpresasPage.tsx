// frontend/src/pages/ejecutiva/EmpresasPage.tsx
// import { useState, useEffect } from "react"
// import { useAuth } from "@/context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import { DashboardLayout } from "@/components/layout/DashboardLayout"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Building2, Users, Search, Plus, MapPin, Phone, Mail } from "lucide-react"
// import { AddEmpresaDialog } from "../../components/ejecutivaComponents/AddEmpresaDialog"

// interface Empresa {
//   id_empresa: number
//   nombre_empresa: string
//   rut: string
//   direccion?: string
//   telefono?: string
//   email_contacto?: string
//   total_clientes: number
//   activo: boolean
// }

// // Datos mock para empresas
// const mockEmpresas: Empresa[] = [
//   {
//     id_empresa: 1,
//     nombre_empresa: "Tech Solutions SA",
//     rut: "76.123.456-7",
//     direccion: "Av. Principal 123, Santiago",
//     telefono: "+56912345678",
//     email_contacto: "contacto@techsolutions.cl",
//     total_clientes: 8,
//     activo: true
//   },
//   {
//     id_empresa: 2,
//     nombre_empresa: "Importadora Global",
//     rut: "76.234.567-8",
//     direccion: "Los Conquistadores 456, Providencia",
//     telefono: "+56923456789",
//     email_contacto: "info@importadoraglobal.cl",
//     total_clientes: 5,
//     activo: true
//   },
//   {
//     id_empresa: 3,
//     nombre_empresa: "Constructora Norte",
//     rut: "76.345.678-9",
//     direccion: "Av. Andrés Bello 789, Las Condes",
//     telefono: "+56934567890",
//     email_contacto: "ventas@constructoranorte.cl",
//     total_clientes: 3,
//     activo: true
//   },
//   {
//     id_empresa: 4,
//     nombre_empresa: "Distribuidora Sur",
//     rut: "76.456.789-0",
//     direccion: "Portugal 321, Santiago",
//     telefono: "+56945678901",
//     email_contacto: "admin@distribuidorasur.cl",
//     total_clientes: 6,
//     activo: true
//   },
//   {
//     id_empresa: 5,
//     nombre_empresa: "Servicios Integrales",
//     rut: "76.567.890-1",
//     direccion: "Av. Vitacura 654, Vitacura",
//     telefono: "+56956789012",
//     email_contacto: "servicios@integrales.cl",
//     total_clientes: 2,
//     activo: true
//   }
// ]

// const navItems = [
//   { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
//   { label: "Mis Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
//   { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
//   { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
// ]

// export default function EmpresasPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [empresas, setEmpresas] = useState<Empresa[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [showAddEmpresa, setShowAddEmpresa] = useState(false)

//   useEffect(() => {
//     if (!user || user.role !== "ejecutiva") {
//       navigate("/login")
//       return
//     }
//     // Simular carga de datos
//     setTimeout(() => {
//       setEmpresas(mockEmpresas)
//       setLoading(false)
//     }, 1000)
//   }, [user, navigate])

//   const filteredEmpresas = empresas.filter(empresa =>
//     empresa.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     empresa.rut.includes(searchTerm)
//   )

//   const handleEmpresaCreated = () => {
//     // En una implementación real, aquí harías fetch de los datos actualizados
//     setEmpresas([...mockEmpresas])
//   }

//   if (loading) {
//     return (
//       <DashboardLayout navItems={navItems} title="Mis Empresas" subtitle="Gestiona las empresas asignadas">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-white text-lg">Cargando empresas...</div>
//         </div>
//       </DashboardLayout>
//     )
//   }

//   return (
//     <DashboardLayout navItems={navItems} title="Mis Empresas" subtitle="Gestiona las empresas asignadas">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white">Mis Empresas</h2>
//             <p className="text-white/60">Gestiona y visualiza todas las empresas asignadas</p>
//           </div>
//           <div className="flex gap-3">
//             <Button
//               onClick={() => setShowAddEmpresa(true)}
//               className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Nueva Empresa
//             </Button>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
//           <Input
//             placeholder="Buscar empresas por nombre o RUT..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
//           />
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Total Empresas</p>
//             <p className="text-2xl font-bold text-white">{empresas.length}</p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Clientes Totales</p>
//             <p className="text-2xl font-bold text-white">
//               {empresas.reduce((sum, emp) => sum + emp.total_clientes, 0)}
//             </p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-4">
//             <p className="text-white/60 text-sm">Empresas Activas</p>
//             <p className="text-2xl font-bold text-white">
//               {empresas.filter(emp => emp.activo).length}
//             </p>
//           </Card>
//         </div>

//         {/* Empresas Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {filteredEmpresas.map((empresa) => (
//             <Card key={empresa.id_empresa} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-[#C7E196]/20 rounded-lg">
//                     <Building2 className="w-5 h-5 text-[#C7E196]" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-white">{empresa.nombre_empresa}</h3>
//                     <p className="text-sm text-white/60">{empresa.rut}</p>
//                   </div>
//                 </div>
//                 <Badge variant={empresa.activo ? "default" : "secondary"} className={empresa.activo ? "bg-[#C7E196] text-[#013936]" : ""}>
//                   {empresa.activo ? "Activa" : "Inactiva"}
//                 </Badge>
//               </div>

//               <div className="space-y-2 mb-4">
//                 {empresa.direccion && (
//                   <div className="flex items-center gap-2 text-sm text-white/60">
//                     <MapPin className="w-4 h-4" />
//                     <span className="truncate">{empresa.direccion}</span>
//                   </div>
//                 )}
//                 {empresa.telefono && (
//                   <div className="flex items-center gap-2 text-sm text-white/60">
//                     <Phone className="w-4 h-4" />
//                     <span>{empresa.telefono}</span>
//                   </div>
//                 )}
//                 {empresa.email_contacto && (
//                   <div className="flex items-center gap-2 text-sm text-white/60">
//                     <Mail className="w-4 h-4" />
//                     <span className="truncate">{empresa.email_contacto}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t border-white/10">
//                 <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4 text-[#C7E196]" />
//                   <span className="text-sm text-white/60">{empresa.total_clientes} clientes</span>
//                 </div>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
//                 >
//                   Ver Detalles
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {filteredEmpresas.length === 0 && (
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-12 text-center">
//             <Building2 className="w-12 h-12 text-white/40 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-white mb-2">No se encontraron empresas</h3>
//             <p className="text-white/60">No hay empresas que coincidan con tu búsqueda</p>
//           </Card>
//         )}
//       </div>

//       {/* Dialog */}
//       {showAddEmpresa && (
//         <AddEmpresaDialog
//           ejecutivaId={user?.id || ""}
//           onSuccess={handleEmpresaCreated}
//           onClose={() => setShowAddEmpresa(false)}
//         />
//       )}
//     </DashboardLayout>
//   )
// }
// frontend/src/pages/ejecutiva/EmpresasPage.tsx
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MapPin, Phone, Mail, Globe, AlertCircle, Plus } from "lucide-react"
import { AddEmpresaDialog } from "../../components/ejecutivaComponents/AddEmpresaDialog"

interface EmpresaAsignada {
  id_empresa_prov: number
  ruc: string
  razon_social: string
  pagina_web?: string
  correo: string
  telefono?: string
  pais: string
  departamento?: string
  provincia?: string
  direccion?: string
  linkedin?: string
  rubro?: string
  sub_rubro?: string
  tamanio_empresa?: string
  estado: string
  total_clientes: number
  total_ejecutivas: number
  fecha_asignacion: string
}

const navItems = [
  { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
  { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
  { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
  { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
]

export default function EmpresasPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [empresaAsignada, setEmpresaAsignada] = useState<EmpresaAsignada | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRegistrarEmpresa, setShowRegistrarEmpresa] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchEmpresaAsignada()
  }, [user, navigate])

  const fetchEmpresaAsignada = async () => {
    setLoading(true)
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/ejecutiva/${user.id}/empresa-asignada`)
      // const data = await response.json()
      
      // Mock: Simular empresa asignada (cambiar a null para ver estado sin empresa)
      const mockEmpresa: EmpresaAsignada = {
        id_empresa_prov: 1,
        ruc: "20612945528",
        razon_social: "Ron Cartavio S.A.",
        pagina_web: "https://roncartavio.com",
        correo: "contacto@roncartavio.com",
        telefono: "+51987123456",
        pais: "Perú",
        departamento: "La Libertad",
        provincia: "Ascope",
        direccion: "Av. Industrial 123, Cartavio",
        linkedin: "https://linkedin.com/company/roncartavio",
        rubro: "Bebidas",
        sub_rubro: "Destilados",
        tamanio_empresa: "Grande",
        estado: "Activo",
        total_clientes: 8,
        total_ejecutivas: 3,
        fecha_asignacion: "2024-12-15"
      }
      
      // Simular: null = sin empresa asignada
      setEmpresaAsignada(mockEmpresa)
    } catch (error) {
      console.error("Error fetching empresa asignada:", error)
      setEmpresaAsignada(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEmpresaRegistrada = () => {
    // Recargar datos después de registrar empresa
    fetchEmpresaAsignada()
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Cargando información...</div>
        </div>
      </DashboardLayout>
    )
  }

  // Estado: Sin empresa asignada
  if (!empresaAsignada) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
        <div className="space-y-6">
          {/* Card de alerta */}
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">No tienes una empresa asignada</h3>
                <p className="text-white/80 mb-4">
                  Actualmente no estás asignada a ninguna empresa proveedora. Puedes registrar una nueva empresa
                  para que el Jefe o Administrador la apruebe y te la asigne.
                </p>
                <Button
                  onClick={() => setShowRegistrarEmpresa(true)}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Nueva Empresa
                </Button>
              </div>
            </div>
          </Card>

          {/* Información adicional */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">¿Qué puedes hacer?</h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-[#C7E196] mt-1">•</span>
                <span>Registrar empresas proveedoras que quedarán pendientes de aprobación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C7E196] mt-1">•</span>
                <span>El Jefe/Administrador revisará y aprobará las empresas registradas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C7E196] mt-1">•</span>
                <span>Una vez aprobada, el Jefe/Admin te asignará a la empresa para comenzar a trabajar</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Dialog registrar empresa */}
        {showRegistrarEmpresa && (
          <AddEmpresaDialog
           open={showRegistrarEmpresa}
            ejecutivaId={user?.id || ""}
            onSuccess={handleEmpresaRegistrada}
            onClose={() => setShowRegistrarEmpresa(false)}
          />
        )}
      </DashboardLayout>
    )
  }

  // Estado: Con empresa asignada
  return (
    <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
      <div className="space-y-6">
        {/* Header con empresa */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#C7E196]/20 rounded-xl">
              <Building2 className="w-8 h-8 text-[#C7E196]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{empresaAsignada.razon_social}</h2>
              <p className="text-white/60 mt-1">RUC: {empresaAsignada.ruc}</p>
            </div>
          </div>
          <Badge className={empresaAsignada.estado === 'Activo' ? "bg-[#C7E196] text-[#013936]" : "bg-gray-500/20 text-gray-400"}>
            {empresaAsignada.estado}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#C7E196]" />
              <p className="text-white/60 text-sm">Total Clientes</p>
            </div>
            <p className="text-3xl font-bold text-white">{empresaAsignada.total_clientes}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#C7E196]" />
              <p className="text-white/60 text-sm">Ejecutivas Asignadas</p>
            </div>
            <p className="text-3xl font-bold text-white">{empresaAsignada.total_ejecutivas}</p>
          </Card>
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-[#C7E196]" />
              <p className="text-white/60 text-sm">Tamaño</p>
            </div>
            <p className="text-2xl font-bold text-white">{empresaAsignada.tamanio_empresa || "N/A"}</p>
          </Card>
        </div>

        {/* Información de la empresa */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Información de contacto */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              {empresaAsignada.correo && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C7E196]" />
                  <span className="text-white/80">{empresaAsignada.correo}</span>
                </div>
              )}
              {empresaAsignada.telefono && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C7E196]" />
                  <span className="text-white/80">{empresaAsignada.telefono}</span>
                </div>
              )}
              {empresaAsignada.pagina_web && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#C7E196]" />
                  <a href={empresaAsignada.pagina_web} target="_blank" rel="noopener noreferrer" 
                     className="text-[#C7E196] hover:underline">
                    {empresaAsignada.pagina_web}
                  </a>
                </div>
              )}
              {empresaAsignada.linkedin && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#C7E196]" />
                  <a href={empresaAsignada.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="text-[#C7E196] hover:underline">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Ubicación */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Ubicación</h3>
            <div className="space-y-3">
              {empresaAsignada.direccion && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C7E196] mt-1 flex-shrink-0" />
                  <span className="text-white/80">{empresaAsignada.direccion}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/60">
                <span>{empresaAsignada.provincia}, {empresaAsignada.departamento}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span>{empresaAsignada.pais}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Información Adicional</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-sm mb-1">Rubro</p>
              <p className="text-white font-medium">{empresaAsignada.rubro || "No especificado"}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Sub-rubro</p>
              <p className="text-white font-medium">{empresaAsignada.sub_rubro || "No especificado"}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Fecha de Asignación</p>
              <p className="text-white font-medium">
                {new Date(empresaAsignada.fecha_asignacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Acción rápida */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Gestionar Clientes</h3>
              <p className="text-white/60">Administra los clientes finales de esta empresa</p>
            </div>
            <Button
              onClick={() => navigate("/dashboard/ejecutiva/clientes")}
              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
            >
              Ver Clientes
            </Button>
          </div>
        </Card>
      </div>
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Registrar Otra Empresa</h3>
                <p className="text-white/60">Puedes registrar más empresas para aprobación</p>
              </div>
              <Button
                onClick={() => setShowRegistrarEmpresa(true)}
                variant="outline"
                className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar
              </Button>
            </div>
          </Card>
        {/* Dialog registrar empresa */}
        <AddEmpresaDialog
          open={showRegistrarEmpresa}
          ejecutivaId={user?.id || ""}
          onSuccess={handleEmpresaRegistrada}
          onClose={() => setShowRegistrarEmpresa(false)}
        />

    </DashboardLayout>
  )
}