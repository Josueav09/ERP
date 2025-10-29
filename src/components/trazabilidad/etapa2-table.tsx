import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, DollarSign, Calendar, TrendingUp, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { jefeService } from "@/services/jefeService"

interface Etapa2TableProps {
  filters: any
}

export function TrazabilidadEtapa2({ filters }: Etapa2TableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchEtapa2Data()
  }, [filters, pagination.page])

  const fetchEtapa2Data = async () => {
    try {
      setLoading(true)
      const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
      const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined
      const clienteId = filters.cliente !== "all" ? parseInt(filters.cliente) : undefined

      const response = await jefeService.getTrazabilidadEtapa2({
        ejecutivaId,
        empresaId,
        clienteId,
        etapaOportunidad: filters.etapaOportunidad !== "all" ? filters.etapaOportunidad : undefined,
        fechaDesde: filters.fechaDesde || undefined,
        fechaHasta: filters.fechaHasta || undefined,
        page: pagination.page,
        limit: pagination.limit
      })

        console.log('🔍 [Etapa2] Datos recibidos:', response.data)
      console.log('🔍 [Etapa2] Probabilidades:', response.data.map((item: any) => ({
        nombre: item.nombreOportunidad,
        probabilidadCierre: item.probabilidadCierre,
        probabilidad: item.probabilidad,
        etapa: item.etapaOportunidad
      })))

      setData(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }))
      }
    } catch (error) {
      console.error('Error al cargar datos de Etapa 2:', error)
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
        etapaOportunidad: filters.etapaOportunidad !== "all" ? filters.etapaOportunidad : undefined,
        fechaDesde: filters.fechaDesde || undefined,
        fechaHasta: filters.fechaHasta || undefined
      }

      const report = await jefeService.generateReport(reportFilters, 'etapa2')
      
      // Descargar el reporte
      const blob = new Blob([report], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte_etapa2_${new Date().toISOString().split('T')[0]}.csv`
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

  const getEtapaBadge = (etapa: string) => {
    const colores: Record<string, string> = {
      Prospección: "bg-blue-500/20 text-blue-700 border-blue-500/30",
      Calificación: "bg-purple-500/20 text-purple-700 border-purple-500/30",
      "Detección de necesidades": "bg-indigo-500/20 text-indigo-700 border-indigo-500/30",
      "Presentación de solución": "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
      "Manejo de objeciones": "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      "Presentación de propuesta": "bg-orange-500/20 text-orange-700 border-orange-500/30",
      Negociación: "bg-amber-500/20 text-amber-700 border-amber-500/30",
      "Firma de contrato": "bg-green-500/20 text-green-700 border-green-500/30",
      "Venta ganada": "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
      "Venta perdida": "bg-red-500/20 text-red-700 border-red-500/30",
      "Venta suspendida": "bg-gray-500/20 text-gray-700 border-gray-500/30",
    }
    return colores[etapa] || "bg-white/10 text-white/60"
  }

  const getProbabilidadColor = (probabilidad: number) => {
    if (probabilidad >= 75) return "text-green-400"
    if (probabilidad >= 50) return "text-yellow-400"
    if (probabilidad >= 25) return "text-orange-400"
    return "text-red-400"
  }

  const filteredData = data.filter(
    (item) =>
      searchTerm === "" ||
      item.nombreOportunidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clienteFinal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ejecutiva?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <CardTitle className="text-white">Gestión de Oportunidades</CardTitle>
              <CardDescription className="text-white/60">
                Seguimiento de oportunidades en embudo de ventas
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Buscar oportunidad..."
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
                  <TableHead className="font-semibold text-white">Oportunidad</TableHead>
                  <TableHead className="font-semibold text-white">Cliente</TableHead>
                  <TableHead className="font-semibold text-white">Ejecutiva</TableHead>
                  <TableHead className="font-semibold text-white">Etapa</TableHead>
                  <TableHead className="font-semibold text-white">Monto</TableHead>
                  <TableHead className="font-semibold text-white">Probabilidad</TableHead>
                  <TableHead className="font-semibold text-white">Cierre Esperado</TableHead>
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
                      No se encontraron oportunidades
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => {
                    // En el frontend - usar snake_case
                    const probabilidad = item.probabilidad_cierre || item.probabilidad || 0
                    return (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-white font-medium">{item.nombreOportunidad}</TableCell>
                        <TableCell className="text-white/80">{item.clienteFinal}</TableCell>
                        <TableCell className="text-white/80">{item.ejecutiva}</TableCell>
                        <TableCell>
                          <Badge className={getEtapaBadge(item.etapaOportunidad)}>
                            {item.etapaOportunidad}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          ${item.montoTotal?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/10 rounded-full h-2">
                              <div
                                className="bg-[#C7E196] h-2 rounded-full transition-all"
                                style={{ width: `${probabilidad}%` }}
                              />
                            </div>
                            <span className={`text-sm font-semibold ${getProbabilidadColor(probabilidad)}`}>
                              {probabilidad}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">{item.fechaCierreEsperado}</TableCell>
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
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

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#C7E196] text-xl">Detalle de Oportunidad - Etapa 2</DialogTitle>
            <DialogDescription className="text-white/60">
              Información completa de la gestión de oportunidad
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (() => {
            const probabilidad = selectedRecord.probabilidadCierre || selectedRecord.probabilidad || 0
            return (
              <div className="space-y-6 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Nombre Oportunidad</label>
                    <p className="text-white/90 font-semibold">{selectedRecord.nombreOportunidad}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Cliente Final</label>
                    <p className="text-white/90">{selectedRecord.clienteFinal}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Ejecutiva</label>
                    <p className="text-white/90">{selectedRecord.ejecutiva}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Etapa Actual</label>
                    <Badge className={getEtapaBadge(selectedRecord.etapaOportunidad)}>
                      {selectedRecord.etapaOportunidad}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Monto Total
                    </label>
                    <p className="text-2xl font-bold text-[#C7E196]">
                      ${selectedRecord.montoTotal?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Probabilidad Cierre
                    </label>
                    <p className={`text-2xl font-bold ${getProbabilidadColor(probabilidad)}`}>
                      {probabilidad}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Cierre Esperado
                    </label>
                    <p className="text-white/90">{selectedRecord.fechaCierreEsperado}</p>
                  </div>
                </div>

                {selectedRecord.productoOfrecido && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Producto Ofrecido</label>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/90">{selectedRecord.productoOfrecido}</p>
                    </div>
                  </div>
                )}

                {selectedRecord.observaciones && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Observaciones</label>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/90">{selectedRecord.observaciones}</p>
                    </div>
                  </div>
                )}

                {selectedRecord.montoCierreFinal && (
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <label className="text-sm font-medium text-[#C7E196]">Monto de Cierre Final</label>
                    <p className="text-2xl font-bold text-green-400">
                      ${selectedRecord.montoCierreFinal.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}