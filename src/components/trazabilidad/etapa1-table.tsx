import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Phone, Mail, MessageSquare, Linkedin, Users, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { jefeService } from "@/services/jefeService"

interface Etapa1TableProps {
  filters: any
}

export function TrazabilidadEtapa1({ filters }: Etapa1TableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchEtapa1Data()
  }, [filters, pagination.page])

  const fetchEtapa1Data = async () => {
    try {
      setLoading(true)
      const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
      const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined
      const clienteId = filters.cliente !== "all" ? parseInt(filters.cliente) : undefined

      const response = await jefeService.getTrazabilidadEtapa1({
        ejecutivaId,
        empresaId,
        clienteId,
        resultadoContacto: filters.resultadoContacto !== "all" ? filters.resultadoContacto : undefined,
        tipoContacto: filters.tipoContacto !== "all" ? filters.tipoContacto : undefined,
        fechaDesde: filters.fechaDesde || undefined,
        fechaHasta: filters.fechaHasta || undefined,
        page: pagination.page,
        limit: pagination.limit
      })

      console.log('📊 Datos recibidos del servicio:', response.data)
      console.log('📊 Paginación recibida:', response.pagination)
      
      setData(response.data || [])
      
      // ✅ ACTUALIZAR PAGINACIÓN CON DATOS DEL BACKEND
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }))
      }
      
    } catch (error) {
      console.error('Error al cargar datos de Etapa 1:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setGeneratingReport(true)
      const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
      const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined
      const clienteId = filters.cliente !== "all" ? parseInt(filters.cliente) : undefined

      const reportFilters = {
        ejecutivaId,
        empresaId,
        clienteId,
        resultadoContacto: filters.resultadoContacto !== "all" ? filters.resultadoContacto : undefined,
        tipoContacto: filters.tipoContacto !== "all" ? filters.tipoContacto : undefined,
        fechaDesde: filters.fechaDesde || undefined,
        fechaHasta: filters.fechaHasta || undefined
      }

      const report = await jefeService.generateReport(reportFilters, 'etapa1')
      
      // Descargar el reporte
      const blob = new Blob([report], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte_etapa1_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error al generar reporte:', error)
      alert('Error al generar el reporte')
    } finally {
      setGeneratingReport(false)
    }
  }

  const getTipoContactoIcon = (tipo: string) => {
    switch (tipo) {
      case "Llamada telefónica":
        return <Phone className="w-4 h-4" />
      case "Correo electrónico":
        return <Mail className="w-4 h-4" />
      case "Chat de Whatsapp":
        return <MessageSquare className="w-4 h-4" />
      case "Contacto por linkedin":
        return <Linkedin className="w-4 h-4" />
      case "Reunión presencial":
        return <Users className="w-4 h-4" />
      case "Otro":
        return <Phone className="w-4 h-4" />
      default:
        return <Phone className="w-4 h-4" />
    }
  }

  const getTipoContactoBadge = (tipo: string) => {
    if (!tipo) return "bg-white/10 text-white/60";
    
    const colores: Record<string, string> = {
      "Llamada telefónica": "bg-blue-500/20 !text-blue-700 border-blue-500/30",
      "Correo electrónico": "bg-purple-500/20 !text-purple-600 border-purple-500/30",
      "Chat de Whatsapp": "bg-green-500/20 !text-green-600 border-green-500/30",
      "Contacto por linkedin": "bg-blue-600/20 text-blue-600 border-blue-600/30",
      "Reunión presencial": "bg-orange-500/20 text-orange-500 border-orange-500/30",
      "Otro": "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
    
    return colores[tipo] || "bg-white/10 text-white/60";
  }

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case "Positivo":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "Negativo":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      case "Pendiente":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "Neutro":
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
      default:
        return "bg-white/10 text-white/60"
    }
  }

  // ✅ BUSQUEDA SOLO EN LOS DATOS DE LA PÁGINA ACTUAL
  const filteredData = data.filter(
    (item) =>
      searchTerm === "" ||
      item.clienteFinal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ejecutiva?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.personaContacto?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-white">Generación de Oportunidades</CardTitle>
              <CardDescription className="text-white/60">
                Registro de primeros contactos y detección de necesidades
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Buscar cliente, ejecutiva o contacto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                onClick={generateReport}
                disabled={generatingReport}
                className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
              >
                <Download className="w-4 h-4 mr-2" />
                {generatingReport ? "Generando..." : "Reporte CSV"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
                  <TableHead className="font-semibold text-white">Cliente Final</TableHead>
                  <TableHead className="font-semibold text-white">Persona Contacto</TableHead>
                  <TableHead className="font-semibold text-white">Ejecutiva</TableHead>
                  <TableHead className="font-semibold text-white">Tipo Contacto</TableHead>
                  <TableHead className="font-semibold text-white">Fecha Contacto</TableHead>
                  <TableHead className="font-semibold text-white">Resultado</TableHead>
                  <TableHead className="font-semibold text-white">Pasa Embudo</TableHead>
                  <TableHead className="text-center font-semibold text-white">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-white/60">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-white/60">
                      {searchTerm ? "No se encontraron resultados para la búsqueda" : "No se encontraron registros"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium">{item.clienteFinal}</TableCell>
                      <TableCell className="text-white/80">{item.personaContacto}</TableCell>
                      <TableCell className="text-white/80">{item.ejecutiva}</TableCell>
                      <TableCell>
                        <Badge className={`${getTipoContactoBadge(item.tipoContacto)} flex items-center gap-1 w-fit`}>
                          {getTipoContactoIcon(item.tipoContacto)}
                          {item.tipoContacto}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/80 text-sm">{item.fechaContacto}</TableCell>
                      <TableCell>
                        <Badge className={getResultadoBadge(item.resultadoContacto)}>
                          {item.resultadoContacto}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={item.pasaEmbudo ? "bg-[#C7E196] text-[#013936]" : "bg-red-500/20 text-red-700"}
                        >
                          {item.pasaEmbudo ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación - SOLO SE MUESTRA SI HAY MÁS DE 1 PÁGINA */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-white/60">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} registros
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="flex items-center px-3 text-white/80">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog - Se mantiene igual */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#C7E196] text-xl">Detalle de Contacto - Etapa 1</DialogTitle>
            <DialogDescription className="text-white/60">Información completa del primer contacto</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Cliente Final</label>
                  <p className="text-white/90">{selectedRecord.clienteFinal}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Persona de Contacto</label>
                  <p className="text-white/90">{selectedRecord.personaContacto}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Ejecutiva</label>
                  <p className="text-white/90">{selectedRecord.ejecutiva}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196] pr-2">Tipo de Contacto</label>
                  <Badge className={getTipoContactoBadge(selectedRecord.tipoContacto)}>
                    {selectedRecord.tipoContacto}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196] pr-2">Resultado</label>
                  <Badge className={getResultadoBadge(selectedRecord.resultadoContacto)}>
                    {selectedRecord.resultadoContacto}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Fecha Contacto</label>
                  <p className="text-white/90">{selectedRecord.fechaContacto}</p>
                </div>
              </div>

              {selectedRecord.informacionImportante && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Información Importante</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedRecord.informacionImportante}</p>
                  </div>
                </div>
              )}

              {selectedRecord.fechaReunion && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Fecha de Reunión</label>
                    <p className="text-white/90">{selectedRecord.fechaReunion}</p>
                  </div>

                  {selectedRecord.participantes && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#C7E196]">Participantes</label>
                      <p className="text-white/90">{selectedRecord.participantes}</p>
                    </div>
                  )}

                  {selectedRecord.resultadosReunion && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#C7E196]">Resultados de Reunión</label>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white/90">{selectedRecord.resultadosReunion}</p>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}