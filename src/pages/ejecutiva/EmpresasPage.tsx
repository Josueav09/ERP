// frontend/src/pages/ejecutiva/EmpresasPage.tsx
// import { useState, useEffect } from "react"
// import { useAuth } from "@/context/AuthContext"
// import { useNavigate } from "react-router-dom"
// import { DashboardLayout } from "@/components/layout/DashboardLayout"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Building2, Users, MapPin, Phone, Mail, Globe, AlertCircle, Plus } from "lucide-react"
// import { AddEmpresaDialog } from "../../components/ejecutivaComponents/AddEmpresaDialog"

// interface EmpresaAsignada {
//   id_empresa_prov: number
//   ruc: string
//   razon_social: string
//   pagina_web?: string
//   correo: string
//   telefono?: string
//   pais: string
//   departamento?: string
//   provincia?: string
//   direccion?: string
//   linkedin?: string
//   rubro?: string
//   sub_rubro?: string
//   tamanio_empresa?: string
//   estado: string
//   total_clientes: number
//   total_ejecutivas: number
//   fecha_asignacion: string
// }

// const navItems = [
//   { label: "Resumen", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva" },
//   { label: "Mi Empresa", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/empresas" },
//   { label: "Mis Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/ejecutiva/clientes" },
//   { label: "Mi Trazabilidad", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/ejecutiva/trazabilidad" },
// ]

// export default function EmpresasPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [empresaAsignada, setEmpresaAsignada] = useState<EmpresaAsignada | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [showRegistrarEmpresa, setShowRegistrarEmpresa] = useState(false)

//   useEffect(() => {
//     if (!user || user.role !== "ejecutiva") {
//       navigate("/login")
//       return
//     }
//     fetchEmpresaAsignada()
//   }, [user, navigate])

//   const fetchEmpresaAsignada = async () => {
//     setLoading(true)
//     try {
//       // TODO: Reemplazar con llamada real al backend
//       // const response = await fetch(`/api/ejecutiva/${user.id}/empresa-asignada`)
//       // const data = await response.json()
      
//       // Mock: Simular empresa asignada (cambiar a null para ver estado sin empresa)
//       const mockEmpresa: EmpresaAsignada = {
//         id_empresa_prov: 1,
//         ruc: "20612945528",
//         razon_social: "Ron Cartavio S.A.",
//         pagina_web: "https://roncartavio.com",
//         correo: "contacto@roncartavio.com",
//         telefono: "+51987123456",
//         pais: "Perú",
//         departamento: "La Libertad",
//         provincia: "Ascope",
//         direccion: "Av. Industrial 123, Cartavio",
//         linkedin: "https://linkedin.com/company/roncartavio",
//         rubro: "Bebidas",
//         sub_rubro: "Destilados",
//         tamanio_empresa: "Grande",
//         estado: "Activo",
//         total_clientes: 8,
//         total_ejecutivas: 3,
//         fecha_asignacion: "2024-12-15"
//       }
      
//       // Simular: null = sin empresa asignada
//       setEmpresaAsignada(mockEmpresa)
//     } catch (error) {
//       console.error("Error fetching empresa asignada:", error)
//       setEmpresaAsignada(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEmpresaRegistrada = () => {
//     // Recargar datos después de registrar empresa
//     fetchEmpresaAsignada()
//   }

//   if (loading) {
//     return (
//       <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-white text-lg">Cargando información...</div>
//         </div>
//       </DashboardLayout>
//     )
//   }

//   // Estado: Sin empresa asignada
//   if (!empresaAsignada) {
//     return (
//       <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
//         <div className="space-y-6">
//           {/* Card de alerta */}
//           <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 p-6">
//             <div className="flex items-start gap-4">
//               <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
//               <div>
//                 <h3 className="text-lg font-semibold text-white mb-2">No tienes una empresa asignada</h3>
//                 <p className="text-white/80 mb-4">
//                   Actualmente no estás asignada a ninguna empresa proveedora. Puedes registrar una nueva empresa
//                   para que el Jefe o Administrador la apruebe y te la asigne.
//                 </p>
//                 <Button
//                   onClick={() => setShowRegistrarEmpresa(true)}
//                   className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Registrar Nueva Empresa
//                 </Button>
//               </div>
//             </div>
//           </Card>

//           {/* Información adicional */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <h3 className="text-lg font-semibold text-white mb-3">¿Qué puedes hacer?</h3>
//             <ul className="space-y-2 text-white/80">
//               <li className="flex items-start gap-2">
//                 <span className="text-[#C7E196] mt-1">•</span>
//                 <span>Registrar empresas proveedoras que quedarán pendientes de aprobación</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-[#C7E196] mt-1">•</span>
//                 <span>El Jefe/Administrador revisará y aprobará las empresas registradas</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span className="text-[#C7E196] mt-1">•</span>
//                 <span>Una vez aprobada, el Jefe/Admin te asignará a la empresa para comenzar a trabajar</span>
//               </li>
//             </ul>
//           </Card>
//         </div>

//         {/* Dialog registrar empresa */}
//         {showRegistrarEmpresa && (
//           <AddEmpresaDialog
//            open={showRegistrarEmpresa}
//             ejecutivaId={user?.id || ""}
//             onSuccess={handleEmpresaRegistrada}
//             onClose={() => setShowRegistrarEmpresa(false)}
//           />
//         )}
//       </DashboardLayout>
//     )
//   }

//   // Estado: Con empresa asignada
//   return (
//     <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
//       <div className="space-y-6">
//         {/* Header con empresa */}
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-4">
//             <div className="p-4 bg-[#C7E196]/20 rounded-xl">
//               <Building2 className="w-8 h-8 text-[#C7E196]" />
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold text-white">{empresaAsignada.razon_social}</h2>
//               <p className="text-white/60 mt-1">RUC: {empresaAsignada.ruc}</p>
//             </div>
//           </div>
//           <Badge className={empresaAsignada.estado === 'Activo' ? "bg-[#C7E196] text-[#013936]" : "bg-gray-500/20 text-gray-400"}>
//             {empresaAsignada.estado}
//           </Badge>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <div className="flex items-center gap-3 mb-2">
//               <Users className="w-5 h-5 text-[#C7E196]" />
//               <p className="text-white/60 text-sm">Total Clientes</p>
//             </div>
//             <p className="text-3xl font-bold text-white">{empresaAsignada.total_clientes}</p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <div className="flex items-center gap-3 mb-2">
//               <Users className="w-5 h-5 text-[#C7E196]" />
//               <p className="text-white/60 text-sm">Ejecutivas Asignadas</p>
//             </div>
//             <p className="text-3xl font-bold text-white">{empresaAsignada.total_ejecutivas}</p>
//           </Card>
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <div className="flex items-center gap-3 mb-2">
//               <Building2 className="w-5 h-5 text-[#C7E196]" />
//               <p className="text-white/60 text-sm">Tamaño</p>
//             </div>
//             <p className="text-2xl font-bold text-white">{empresaAsignada.tamanio_empresa || "N/A"}</p>
//           </Card>
//         </div>

//         {/* Información de la empresa */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Información de contacto */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
//             <div className="space-y-3">
//               {empresaAsignada.correo && (
//                 <div className="flex items-center gap-3">
//                   <Mail className="w-4 h-4 text-[#C7E196]" />
//                   <span className="text-white/80">{empresaAsignada.correo}</span>
//                 </div>
//               )}
//               {empresaAsignada.telefono && (
//                 <div className="flex items-center gap-3">
//                   <Phone className="w-4 h-4 text-[#C7E196]" />
//                   <span className="text-white/80">{empresaAsignada.telefono}</span>
//                 </div>
//               )}
//               {empresaAsignada.pagina_web && (
//                 <div className="flex items-center gap-3">
//                   <Globe className="w-4 h-4 text-[#C7E196]" />
//                   <a href={empresaAsignada.pagina_web} target="_blank" rel="noopener noreferrer" 
//                      className="text-[#C7E196] hover:underline">
//                     {empresaAsignada.pagina_web}
//                   </a>
//                 </div>
//               )}
//               {empresaAsignada.linkedin && (
//                 <div className="flex items-center gap-3">
//                   <Globe className="w-4 h-4 text-[#C7E196]" />
//                   <a href={empresaAsignada.linkedin} target="_blank" rel="noopener noreferrer" 
//                      className="text-[#C7E196] hover:underline">
//                     LinkedIn
//                   </a>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* Ubicación */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <h3 className="text-lg font-semibold text-white mb-4">Ubicación</h3>
//             <div className="space-y-3">
//               {empresaAsignada.direccion && (
//                 <div className="flex items-start gap-3">
//                   <MapPin className="w-4 h-4 text-[#C7E196] mt-1 flex-shrink-0" />
//                   <span className="text-white/80">{empresaAsignada.direccion}</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 text-white/60">
//                 <span>{empresaAsignada.provincia}, {empresaAsignada.departamento}</span>
//               </div>
//               <div className="flex items-center gap-2 text-white/60">
//                 <span>{empresaAsignada.pais}</span>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Información adicional */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//           <h3 className="text-lg font-semibold text-white mb-4">Información Adicional</h3>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-white/60 text-sm mb-1">Rubro</p>
//               <p className="text-white font-medium">{empresaAsignada.rubro || "No especificado"}</p>
//             </div>
//             <div>
//               <p className="text-white/60 text-sm mb-1">Sub-rubro</p>
//               <p className="text-white font-medium">{empresaAsignada.sub_rubro || "No especificado"}</p>
//             </div>
//             <div>
//               <p className="text-white/60 text-sm mb-1">Fecha de Asignación</p>
//               <p className="text-white font-medium">
//                 {new Date(empresaAsignada.fecha_asignacion).toLocaleDateString('es-ES', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </p>
//             </div>
//           </div>
//         </Card>

//         {/* Acción rápida */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-white mb-1">Gestionar Clientes</h3>
//               <p className="text-white/60">Administra los clientes finales de esta empresa</p>
//             </div>
//             <Button
//               onClick={() => navigate("/dashboard/ejecutiva/clientes")}
//               className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
//             >
//               Ver Clientes
//             </Button>
//           </div>
//         </Card>
//       </div>
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-white mb-1">Registrar Otra Empresa</h3>
//                 <p className="text-white/60">Puedes registrar más empresas para aprobación</p>
//               </div>
//               <Button
//                 onClick={() => setShowRegistrarEmpresa(true)}
//                 variant="outline"
//                 className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Registrar
//               </Button>
//             </div>
//           </Card>
//         {/* Dialog registrar empresa */}
//         <AddEmpresaDialog
//           open={showRegistrarEmpresa}
//           ejecutivaId={user?.id || ""}
//           onSuccess={handleEmpresaRegistrada}
//           onClose={() => setShowRegistrarEmpresa(false)}
//         />

//     </DashboardLayout>
//   )
// }

// frontend/src/pages/ejecutiva/EmpresasPage.tsx - ACTUALIZADO
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MapPin, Phone, Mail, Globe, AlertCircle, Plus, Loader2 } from "lucide-react"
import { AddEmpresaDialog } from "../../components/ejecutivaComponents/AddEmpresaDialog"
import { ejecutivaService, type Empresa, type EmpresaRegistrada } from "@/services/ejecutivaService"

interface EmpresaAsignada extends Empresa {
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
  const [empresasRegistradas, setEmpresasRegistradas] = useState<EmpresaRegistrada[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegistrarEmpresa, setShowRegistrarEmpresa] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "ejecutiva") {
      navigate("/login")
      return
    }
    fetchEmpresaData()
  }, [user, navigate])

  const fetchEmpresaData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [empresaAsignadaData, empresasRegistradasData] = await Promise.all([
        ejecutivaService.getEmpresaAsignada(user?.id || ""),
        ejecutivaService.getEmpresasRegistradas(user?.id || "")
      ])

      setEmpresaAsignada(empresaAsignadaData ? {
        ...empresaAsignadaData,
        total_clientes: empresaAsignadaData.total_clientes || 0,
        total_ejecutivas: 1, // Por defecto, la ejecutiva actual
        fecha_asignacion: empresaAsignadaData.fecha_creacion || new Date().toISOString()
      } : null)
      
      setEmpresasRegistradas(empresasRegistradasData)
    } catch (error) {
      console.error("Error fetching empresa data:", error)
      setError("Error al cargar la información de empresas")
      setEmpresaAsignada(null)
      setEmpresasRegistradas([])
    } finally {
      setLoading(false)
    }
  }

  const handleEmpresaRegistrada = () => {
    setShowRegistrarEmpresa(false)
    fetchEmpresaData() // Recargar datos
  }

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-[#C7E196] animate-spin" />
            <div className="text-white text-lg">Cargando información...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Empresa" subtitle="Empresa proveedora asignada">
        <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Error al cargar datos</h3>
              <p className="text-white/80 mb-4">{error}</p>
              <Button
                onClick={fetchEmpresaData}
                className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </Card>
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

          {/* Empresas registradas pendientes */}
          {empresasRegistradas.length > 0 && (
            <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Empresas Registradas</h3>
              <div className="space-y-4">
                {empresasRegistradas.map((empresa) => (
                  <div key={empresa.id_empresa_prov} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{empresa.razon_social}</h4>
                      <p className="text-white/60 text-sm">RUC: {empresa.ruc}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={
                          empresa.estado === 'Activo' 
                            ? "bg-[#C7E196] text-[#013936]" 
                            : empresa.estado === 'Pendiente'
                            ? "bg-amber-500 text-white"
                            : "bg-gray-500 text-white"
                        }>
                          {empresa.estado}
                        </Badge>
                        {empresa.esta_asignada && (
                          <Badge className="bg-blue-500 text-white">
                            Asignada a ti
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Registrada el</p>
                      <p className="text-white text-sm">
                        {new Date(empresa.fecha_creacion!).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

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
        <AddEmpresaDialog
          open={showRegistrarEmpresa}
          ejecutivaId={user?.id || ""}
          onSuccess={handleEmpresaRegistrada}
          onClose={() => setShowRegistrarEmpresa(false)}
        />
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
          <Badge className={
            empresaAsignada.estado === 'Activo' 
              ? "bg-[#C7E196] text-[#013936]" 
              : "bg-gray-500/20 text-gray-400"
          }>
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
              {(empresaAsignada.provincia || empresaAsignada.departamento) && (
                <div className="flex items-center gap-2 text-white/60">
                  <span>{empresaAsignada.provincia}, {empresaAsignada.departamento}</span>
                </div>
              )}
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

        {/* Acciones rápidas */}
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>
      </div>

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