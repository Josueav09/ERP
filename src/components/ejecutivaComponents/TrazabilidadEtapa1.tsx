// frontend/src/components/ejecutivaComponents/TrazabilidadEtapa1.tsx
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
// import { Badge } from "../../components/ui/badge"
// import { Button } from "../../components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
// import { Input } from "../../components/ui/input"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
// import { Search, Eye, Phone, Mail, MessageSquare, Video, Users, Edit, ChevronLeft, ChevronRight } from "lucide-react"

// interface TrazabilidadEtapa1Props {
//   ejecutivaId: string
//   refreshKey?: number
// }

// interface Etapa1Record {
//   id_trazabilidad: number
//   cliente_final: string
//   persona_contacto: string
//   cargo_contacto?: string
//   fecha_agregado_base?: string
//   tipo_contacto: string
//   fecha_contacto: string
//   fecha_respuesta?: string
//   resultado_contacto: string
//   informacion_importante?: string
//   reunion_agendada: boolean
//   fecha_reunion?: string
//   participantes?: string
//   se_dio_reunion?: boolean
//   resultados_reunion?: string
//   pasa_embudo_ventas: boolean
//   observaciones?: string
// }

// export function TrazabilidadEtapa1({ ejecutivaId, refreshKey = 0 }: TrazabilidadEtapa1Props) {
//   const [data, setData] = useState<Etapa1Record[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedRecord, setSelectedRecord] = useState<Etapa1Record | null>(null)
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false)
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   })

//   useEffect(() => {
//     fetchEtapa1Data()
//   }, [ejecutivaId, refreshKey, pagination.page])

//   const fetchEtapa1Data = async () => {
//     setLoading(true)
//     try {
//       // TODO: Reemplazar con llamada real al backend
//       // const response = await fetch(`/api/ejecutiva/${ejecutivaId}/trazabilidad/etapa1?page=${pagination.page}&limit=${pagination.limit}`)
//       // const result = await response.json()
      
//       // Mock temporal con estructura de BD
//       const mockData: Etapa1Record[] = [
//         {
//           id_trazabilidad: 1,
//           cliente_final: "Banco de Crédito del Perú",
//           persona_contacto: "Ana Torres",
//           cargo_contacto: "Jefa de Compras",
//           fecha_agregado_base: "2025-01-10",
//           tipo_contacto: "Llamada telefónica",
//           fecha_contacto: "2025-01-10",
//           fecha_respuesta: "2025-01-10",
//           resultado_contacto: "Positivo",
//           informacion_importante: "Interesado en productos premium para eventos corporativos",
//           reunion_agendada: true,
//           fecha_reunion: "2025-01-15",
//           participantes: "Ana Torres, Carlos Vega, Ejecutiva",
//           se_dio_reunion: true,
//           resultados_reunion: "Cliente confirmó interés. Solicita propuesta formal",
//           pasa_embudo_ventas: true,
//           observaciones: "Excelente primera impresión"
//         },
//         {
//           id_trazabilidad: 2,
//           cliente_final: "Supermercados Peruanos S.A.",
//           persona_contacto: "María Gonzales",
//           cargo_contacto: "Gerente de Compras",
//           fecha_agregado_base: "2025-01-12",
//           tipo_contacto: "Correo electrónico",
//           fecha_contacto: "2025-01-12",
//           resultado_contacto: "Pendiente",
//           informacion_importante: "Envió información inicial. Esperando respuesta",
//           reunion_agendada: false,
//           pasa_embudo_ventas: false,
//           observaciones: "Hacer seguimiento en 3 días"
//         }
//       ]
      
//       setData(mockData)
//       setPagination(prev => ({
//         ...prev,
//         total: mockData.length,
//         totalPages: Math.ceil(mockData.length / prev.limit)
//       }))
//     } catch (error) {
//       console.error("Error fetching Etapa 1 data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getTipoContactoIcon = (tipo: string) => {
//     const icons: Record<string, JSX.Element> = {
//       "Llamada telefónica": <Phone className="w-4 h-4" />,
//       "Correo electrónico": <Mail className="w-4 h-4" />,
//       "Chat de Whatsapp": <MessageSquare className="w-4 h-4" />,
//       "Contacto por linkedin": <Users className="w-4 h-4" />,
//       "Reunión presencial": <Video className="w-4 h-4" />
//     }
//     return icons[tipo] || <Phone className="w-4 h-4" />
//   }

//   const getTipoContactoBadge = (tipo: string) => {
//     const colores: Record<string, string> = {
//       "Llamada telefónica": "bg-blue-500/20 text-blue-300 border-blue-500/30",
//       "Correo electrónico": "bg-purple-500/20 text-purple-300 border-purple-500/30",
//       "Chat de Whatsapp": "bg-green-500/20 text-green-300 border-green-500/30",
//       "Contacto por linkedin": "bg-blue-600/20 text-blue-400 border-blue-600/30",
//       "Reunión presencial": "bg-orange-500/20 text-orange-300 border-orange-500/30"
//     }
//     return colores[tipo] || "bg-white/10 text-white/60"
//   }

//   const getResultadoBadge = (resultado: string) => {
//     const colores: Record<string, string> = {
//       "Positivo": "bg-green-500/20 text-green-300 border-green-500/30",
//       "Negativo": "bg-red-500/20 text-red-300 border-red-500/30",
//       "Pendiente": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
//       "Neutro": "bg-gray-500/20 text-gray-300 border-gray-500/30"
//     }
//     return colores[resultado] || "bg-white/10 text-white/60"
//   }

//   const filteredData = data.filter(item =>
//     searchTerm === "" ||
//     item.cliente_final.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.persona_contacto.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination(prev => ({ ...prev, page: newPage }))
//     }
//   }

//   return (
//     <>
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <CardTitle className="text-white">Registro de Primeros Contactos</CardTitle>
//               <CardDescription className="text-white/60">
//                 Detección de necesidades y generación de oportunidades
//               </CardDescription>
//             </div>
//             <div className="relative w-full md:w-72">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//               <Input
//                 placeholder="Buscar cliente o contacto..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border border-white/10 overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
//                   <TableHead className="font-semibold text-[#C7E196]">Cliente Final</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Persona Contacto</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Tipo Contacto</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Fecha Contacto</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Resultado</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Pasa Embudo</TableHead>
//                   <TableHead className="text-center font-semibold text-[#C7E196]">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8 text-white/60">
//                       Cargando...
//                     </TableCell>
//                   </TableRow>
//                 ) : filteredData.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8 text-white/60">
//                       No hay registros de contactos
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredData.map((item) => (
//                     <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5">
//                       <TableCell className="text-white font-medium">{item.cliente_final}</TableCell>
//                       <TableCell>
//                         <div>
//                           <p className="text-white">{item.persona_contacto}</p>
//                           {item.cargo_contacto && (
//                             <p className="text-sm text-white/60">{item.cargo_contacto}</p>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={`${getTipoContactoBadge(item.tipo_contacto)} flex items-center gap-1 w-fit`}>
//                           {getTipoContactoIcon(item.tipo_contacto)}
//                           <span className="text-xs">{item.tipo_contacto}</span>
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-white/80 text-sm">
//                         {new Date(item.fecha_contacto).toLocaleDateString('es-ES')}
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getResultadoBadge(item.resultado_contacto)}>
//                           {item.resultado_contacto}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={item.pasa_embudo_ventas ? "bg-[#C7E196] text-[#013936]" : "bg-red-500/20 text-red-300"}>
//                           {item.pasa_embudo_ventas ? "Sí" : "No"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => {
//                               setSelectedRecord(item)
//                               setDetailDialogOpen(true)
//                             }}
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-white/60 hover:text-white hover:bg-white/10"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Paginación */}
//           {pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between mt-4">
//               <p className="text-sm text-white/60">
//                 Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} registros
//               </p>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>
//                 <span className="flex items-center px-3 text-white/80">
//                   Página {pagination.page} de {pagination.totalPages}
//                 </span>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={pagination.page === pagination.totalPages}
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Detail Dialog */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-[#C7E196] text-xl">Detalle de Contacto - Etapa 1</DialogTitle>
//             <DialogDescription className="text-white/60">
//               Información completa del primer contacto
//             </DialogDescription>
//           </DialogHeader>

//           {selectedRecord && (
//             <div className="space-y-6 mt-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Cliente Final</label>
//                   <p className="text-white/90 font-semibold">{selectedRecord.cliente_final}</p>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Persona de Contacto</label>
//                   <div>
//                     <p className="text-white/90">{selectedRecord.persona_contacto}</p>
//                     {selectedRecord.cargo_contacto && (
//                       <p className="text-sm text-white/60">{selectedRecord.cargo_contacto}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Tipo de Contacto</label>
//                   <Badge className={getTipoContactoBadge(selectedRecord.tipo_contacto)}>
//                     {selectedRecord.tipo_contacto}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Resultado</label>
//                   <Badge className={getResultadoBadge(selectedRecord.resultado_contacto)}>
//                     {selectedRecord.resultado_contacto}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Fecha Contacto</label>
//                   <p className="text-white/90">
//                     {new Date(selectedRecord.fecha_contacto).toLocaleDateString('es-ES', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </p>
//                 </div>
//                 {selectedRecord.fecha_respuesta && (
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Fecha Respuesta</label>
//                     <p className="text-white/90">
//                       {new Date(selectedRecord.fecha_respuesta).toLocaleDateString('es-ES', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {selectedRecord.informacion_importante && (
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Información Importante</label>
//                   <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                     <p className="text-white/90">{selectedRecord.informacion_importante}</p>
//                   </div>
//                 </div>
//               )}

//               {selectedRecord.reunion_agendada && (
//                 <>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Reunión Agendada</label>
//                     <Badge className="bg-[#C7E196] text-[#013936]">Sí</Badge>
//                     {selectedRecord.fecha_reunion && (
//                       <p className="text-white/80 text-sm mt-1">
//                         Fecha: {new Date(selectedRecord.fecha_reunion).toLocaleDateString('es-ES', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     )}
//                   </div>

//                   {selectedRecord.participantes && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-[#C7E196]">Participantes</label>
//                       <p className="text-white/90">{selectedRecord.participantes}</p>
//                     </div>
//                   )}

//                   {selectedRecord.se_dio_reunion && selectedRecord.resultados_reunion && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-[#C7E196]">Resultados de Reunión</label>
//                       <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                         <p className="text-white/90">{selectedRecord.resultados_reunion}</p>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {selectedRecord.observaciones && (
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196]">Observaciones</label>
//                   <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                     <p className="text-white/90">{selectedRecord.observaciones}</p>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-[#C7E196]">¿Pasa al Embudo de Ventas?</label>
//                 <Badge className={selectedRecord.pasa_embudo_ventas ? "bg-[#C7E196] text-[#013936]" : "bg-red-500/20 text-red-300"}>
//                   {selectedRecord.pasa_embudo_ventas ? "Sí - Convertido a Oportunidad" : "No - Aún en prospección"}
//                 </Badge>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// frontend/src/components/ejecutivaComponents/TrazabilidadEtapa1.tsx
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Phone, Mail, MessageSquare, Video, Users, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { ejecutivaService } from "@/services/ejecutivaService"
import { toast } from "sonner"

interface TrazabilidadEtapa1Props {
  ejecutivaId: string
  refreshKey?: number
}

interface Etapa1Record {
  id_trazabilidad: number
  cliente_final: string
  persona_contacto?: string
  tipo_contacto: string
  fecha_contacto: string
  resultado_contacto: string
  informacion_importante?: string
  reunion_agendada: boolean
  fecha_reunion?: string
  participantes?: string
  se_dio_reunion?: boolean
  resultados_reunion?: string
  pasa_embudo_ventas: boolean
  observaciones?: string
  empresa_proveedora?: string
}

export function TrazabilidadEtapa1({ ejecutivaId, refreshKey = 0 }: TrazabilidadEtapa1Props) {
  const [data, setData] = useState<Etapa1Record[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<Etapa1Record | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  useEffect(() => {
    fetchEtapa1Data()
  }, [ejecutivaId, refreshKey])

  const fetchEtapa1Data = async () => {
    setLoading(true)
    try {
      console.log('🔍 Fetching Etapa 1 data for ejecutiva:', ejecutivaId)
      
      const trazabilidadData = await ejecutivaService.getTrazabilidad(ejecutivaId)
      
      // Filtrar solo registros de Etapa 1 (que NO pasaron al embudo o no tienen oportunidad)
      const etapa1Records = trazabilidadData.filter(record => 
        !record.pasa_embudo_ventas || !record.nombre_oportunidad
      )
      
      console.log(`✅ Etapa 1 records loaded: ${etapa1Records.length}`)
      setData(etapa1Records)
    } catch (error) {
      console.error("❌ Error fetching Etapa 1 data:", error)
      toast.error("Error al cargar registros de contactos")
    } finally {
      setLoading(false)
    }
  }

  const getTipoContactoIcon = (tipo: string) => {
    const icons: Record<string, JSX.Element> = {
      "Llamada telefónica": <Phone className="w-4 h-4" />,
      "Correo electrónico": <Mail className="w-4 h-4" />,
      "Chat de Whatsapp": <MessageSquare className="w-4 h-4" />,
      "Contacto por linkedin": <Users className="w-4 h-4" />,
      "Reunión presencial": <Video className="w-4 h-4" />
    }
    return icons[tipo] || <Phone className="w-4 h-4" />
  }

  const getTipoContactoBadge = (tipo: string) => {
    const colores: Record<string, string> = {
      "Llamada telefónica": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Correo electrónico": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Chat de Whatsapp": "bg-green-500/20 text-green-300 border-green-500/30",
      "Contacto por linkedin": "bg-blue-600/20 text-blue-400 border-blue-600/30",
      "Reunión presencial": "bg-orange-500/20 text-orange-300 border-orange-500/30"
    }
    return colores[tipo] || "bg-white/10 text-white/60"
  }

  const getResultadoBadge = (resultado: string) => {
    const colores: Record<string, string> = {
      "Positivo": "bg-green-500/20 text-green-300 border-green-500/30",
      "Negativo": "bg-red-500/20 text-red-300 border-red-500/30",
      "Pendiente": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      "Neutro": "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
    return colores[resultado] || "bg-white/10 text-white/60"
  }

  const filteredData = data.filter(item =>
    searchTerm === "" ||
    item.cliente_final.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.persona_contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-white">Registro de Primeros Contactos</CardTitle>
              <CardDescription className="text-white/60">
                Detección de necesidades y generación de oportunidades
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Buscar cliente o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
                  <TableHead className="font-semibold text-[#C7E196]">Cliente Final</TableHead>
                  <TableHead className="font-semibold text-[#C7E196]">Persona Contacto</TableHead>
                  <TableHead className="font-semibold text-[#C7E196]">Tipo Contacto</TableHead>
                  <TableHead className="font-semibold text-[#C7E196]">Fecha Contacto</TableHead>
                  <TableHead className="font-semibold text-[#C7E196]">Resultado</TableHead>
                  <TableHead className="font-semibold text-[#C7E196]">Pasa Embudo</TableHead>
                  <TableHead className="text-center font-semibold text-[#C7E196]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-white/60">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-white/60">
                      {searchTerm ? "No se encontraron registros" : "No hay registros de contactos. Crea tu primera actividad."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{item.cliente_final}</TableCell>
                      <TableCell>
                        <p className="text-white">{item.persona_contacto}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTipoContactoBadge(item.tipo_contacto)} flex items-center gap-1 w-fit`}>
                          {getTipoContactoIcon(item.tipo_contacto)}
                          <span className="text-xs">{item.tipo_contacto}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/80 text-sm">
                        {new Date(item.fecha_contacto).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getResultadoBadge(item.resultado_contacto)}>
                          {item.resultado_contacto}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={item.pasa_embudo_ventas ? "bg-[#C7E196] text-[#013936]" : "bg-red-500/20 text-red-300"}>
                          {item.pasa_embudo_ventas ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRecord(item)
                              setDetailDialogOpen(true)
                            }}
                            className="text-[#C7E196] hover:text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info de resultados */}
          {!loading && filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-white/60">
                Mostrando {filteredData.length} {filteredData.length === 1 ? 'registro' : 'registros'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#C7E196] text-xl">Detalle de Contacto - Etapa 1</DialogTitle>
            <DialogDescription className="text-white/60">
              Información completa del primer contacto
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Cliente Final</label>
                  <p className="text-white/90 font-semibold">{selectedRecord.cliente_final}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Persona de Contacto</label>
                  <p className="text-white/90">{selectedRecord.persona_contacto}</p>
                </div>
              </div>

              {selectedRecord.empresa_proveedora && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Empresa Proveedora</label>
                  <p className="text-white/90">{selectedRecord.empresa_proveedora}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Tipo de Contacto</label>
                  <Badge className={getTipoContactoBadge(selectedRecord.tipo_contacto)}>
                    {selectedRecord.tipo_contacto}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Resultado</label>
                  <Badge className={getResultadoBadge(selectedRecord.resultado_contacto)}>
                    {selectedRecord.resultado_contacto}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#C7E196]">Fecha Contacto</label>
                <p className="text-white/90">
                  {new Date(selectedRecord.fecha_contacto).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {selectedRecord.informacion_importante && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Información Importante</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedRecord.informacion_importante}</p>
                  </div>
                </div>
              )}

              {selectedRecord.reunion_agendada && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Reunión Agendada</label>
                    <Badge className="bg-[#C7E196] text-[#013936]">Sí</Badge>
                    {selectedRecord.fecha_reunion && (
                      <p className="text-white/80 text-sm mt-1">
                        Fecha: {new Date(selectedRecord.fecha_reunion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  {selectedRecord.participantes && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#C7E196]">Participantes</label>
                      <p className="text-white/90">{selectedRecord.participantes}</p>
                    </div>
                  )}

                  {selectedRecord.se_dio_reunion && selectedRecord.resultados_reunion && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#C7E196]">Resultados de Reunión</label>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white/90">{selectedRecord.resultados_reunion}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedRecord.observaciones && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Observaciones</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedRecord.observaciones}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#C7E196]">¿Pasa al Embudo de Ventas?</label>
                <Badge className={selectedRecord.pasa_embudo_ventas ? "bg-[#C7E196] text-[#013936]" : "bg-red-500/20 text-red-300"}>
                  {selectedRecord.pasa_embudo_ventas ? "Sí - Convertido a Oportunidad" : "No - Aún en prospección"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}