
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Eye, DollarSign, Calendar, TrendingUp, ArrowRight } from "lucide-react"
import { ejecutivaService } from "@/services/ejecutivaService"
import { toast } from "sonner"

interface TrazabilidadEtapa2Props {
    ejecutivaId: string
    refreshKey?: number
}

interface Etapa2Record {
    id_trazabilidad: number
    cliente_final: string
    persona_contacto: string
    nombre_oportunidad?: string
    etapa_oportunidad?: string
    producto_ofrecido?: string
    fecha_contacto: string
    monto_total_sin_imp?: number
    probabilidad_cierre?: number
    observaciones?: string
    empresa_proveedora?: string
}

export function TrazabilidadEtapa2({ ejecutivaId, refreshKey = 0 }: TrazabilidadEtapa2Props) {
    const [data, setData] = useState<Etapa2Record[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRecord, setSelectedRecord] = useState<Etapa2Record | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [editEtapaDialogOpen, setEditEtapaDialogOpen] = useState(false)
    const [nuevaEtapa, setNuevaEtapa] = useState("")
    const [updatingEtapa, setUpdatingEtapa] = useState(false)

    useEffect(() => {
        fetchEtapa2Data()
    }, [ejecutivaId, refreshKey])

    const fetchEtapa2Data = async () => {
        setLoading(true)
        try {
            console.log('🔍 Fetching Etapa 2 data (pipeline) for ejecutiva:', ejecutivaId)

            // Intentar con trazabilidad primero, si no funciona usar actividades
            let trazabilidadData;
            try {
                trazabilidadData = await ejecutivaService.getTrazabilidad(ejecutivaId)
                console.log('✅ Usando endpoint de trazabilidad')
            } catch (error) {
                console.log('⚠️ Endpoint trazabilidad no disponible, usando actividades')
                trazabilidadData = await ejecutivaService.getActividadesRecientes(ejecutivaId, 50)
            }

            // Debug completo de la estructura
            console.log('🔍 DEBUG - Estructura completa del primer item:', JSON.stringify(trazabilidadData[0], null, 2))

            // Buscar campos que indiquen etapa 2
            const pipelineData = trazabilidadData
                .filter((item: any) => {
                    // Una oportunidad de Etapa 2 debe tener nombre Y etapa
                    const hasOportunidad = item.nombre_oportunidad && item.etapa_oportunidad
                    const isActive = !['Venta ganada', 'Venta perdida', 'Venta suspendida'].includes(item.etapa_oportunidad)

                    console.log(`🔍 Item ${item.id_trazabilidad}:`, {
                        nombre: item.nombre_oportunidad,
                        etapa: item.etapa_oportunidad,
                        tieneOportunidad: hasOportunidad,
                        estaActivo: isActive
                    })

                    return hasOportunidad && isActive
                })
                .map((item: any) => {
                    // Convertir monto de string a número si es necesario
                    const monto = item.monto_total_sin_imp ?
                        (typeof item.monto_total_sin_imp === 'string' ?
                            parseFloat(item.monto_total_sin_imp) :
                            item.monto_total_sin_imp)
                        : 0

                    return {
                        id_trazabilidad: item.id_trazabilidad,
                        cliente_final: item.cliente_final,
                        persona_contacto: item.persona_contacto,
                        nombre_oportunidad: item.nombre_oportunidad,
                        etapa_oportunidad: item.etapa_oportunidad,
                        producto_ofrecido: item.producto_ofrecido || 'No especificado',
                        fecha_contacto: item.fecha_contacto,
                        monto_total_sin_imp: monto,
                        probabilidad_cierre: item.probabilidad_cierre || 0, // Valor por defecto
                        observaciones: item.observaciones,
                        empresa_proveedora: item.empresa_proveedora
                    }
                })

            console.log(`✅ Etapa 2 records loaded: ${pipelineData.length}`)
            console.log('🔍 Pipeline data:', pipelineData)
            setData(pipelineData)
        } catch (error) {
            console.error("❌ Error fetching Etapa 2 data:", error)
            toast.error("Error al cargar oportunidades")
        } finally {
            setLoading(false)
        }
    }
    const handleUpdateEtapa = async () => {
        if (!selectedRecord || !nuevaEtapa) {
            toast.error("Debes seleccionar una nueva etapa")
            return
        }

        setUpdatingEtapa(true)
        try {
            console.log('🔄 Updating etapa for trazabilidad:', selectedRecord.id_trazabilidad)

            await ejecutivaService.updateEtapaOportunidad({
                trazabilidadId: selectedRecord.id_trazabilidad.toString(),
                nuevaEtapa: nuevaEtapa,
                ejecutivaId: ejecutivaId
            })

            toast.success("Etapa actualizada exitosamente")
            setEditEtapaDialogOpen(false)
            setDetailDialogOpen(false)
            fetchEtapa2Data() // Recargar datos
        } catch (error) {
            console.error("❌ Error updating etapa:", error)
            toast.error("Error al actualizar etapa")
        } finally {
            setUpdatingEtapa(false)
        }
    }

    const getEtapaBadge = (etapa?: string) => {
        if (!etapa) return "bg-white/10 text-white/60"

        const colores: Record<string, string> = {
            "Prospección": "bg-gray-500/20 text-gray-700 border-gray-700/30",
            "Calificación": "bg-blue-500/20 text-blue-700 border-blue-700/30",
            "Detección de necesidades": "bg-purple-500/20 text-purple-700 border-purple-700/30",
            "Presentación de solución": "bg-cyan-500/20 text-cyan-700 border-cyan-700/30",
            "Manejo de objeciones": "bg-orange-500/20 text-orange-700 border-orange-700/30",
            "Presentación de propuesta": "bg-yellow-500/20 text-yellow-700 border-yellow-700/30",
            "Negociación": "bg-amber-500/20 text-amber-700 border-amber-700/30",
            "Firma de contrato": "bg-green-500/20 text-green-700 border-green-700/30",
            "Venta ganada": "bg-[#C7E196] text-[#013936]/700",
            "Venta perdida": "bg-red-500/20 text-red-700 border-red-700/30",
            "Venta suspendida": "bg-gray-600/20 text-gray-700 border-gray-700/30"
        }
        return colores[etapa] || "bg-white/10 text-white/60"
    }

    const filteredData = data.filter(item =>
        searchTerm === "" ||
        item.cliente_final.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nombre_oportunidad && item.nombre_oportunidad.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const formatCurrency = (value?: number) => {
        if (!value) return "N/A"
        return `$${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                            <Input
                                placeholder="Buscar oportunidad..."
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
                                    <TableHead className="font-semibold text-white">Oportunidad</TableHead>
                                    <TableHead className="font-semibold text-white">Cliente</TableHead>
                                    <TableHead className="font-semibold text-white">Etapa</TableHead>
                                    <TableHead className="font-semibold text-white">Monto</TableHead>
                                    <TableHead className="font-semibold text-white">Probabilidad</TableHead>
                                    <TableHead className="text-center font-semibold text-white">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-white/60">
                                            Cargando...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-white/60">
                                            {searchTerm ? "No se encontraron oportunidades" : "No hay oportunidades en gestión. Crea contactos que pasen al embudo."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="text-white font-medium max-w-[200px]">
                                                <div className="truncate">{item.nombre_oportunidad || "Sin nombre"}</div>
                                            </TableCell>
                                            <TableCell className="text-white/80">{item.cliente_final}</TableCell>
                                            <TableCell>
                                                <Badge className={getEtapaBadge(item.etapa_oportunidad)}>
                                                    {item.etapa_oportunidad || "No definida"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-white font-semibold">
                                                {formatCurrency(item.monto_total_sin_imp)}
                                            </TableCell>
                                            <TableCell>
                                                {item.probabilidad_cierre !== undefined ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-white/10 rounded-full h-2">
                                                            <div
                                                                className="bg-[#C7E196] h-2 rounded-full transition-all"
                                                                style={{ width: `${item.probabilidad_cierre}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">{item.probabilidad_cierre}%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-white/60 text-sm">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedRecord(item)
                                                            setNuevaEtapa(item.etapa_oportunidad || "")
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
                                Mostrando {filteredData.length} {filteredData.length === 1 ? 'oportunidad' : 'oportunidades'}
                            </p>
                            <p className="text-sm text-[#C7E196] font-semibold">
                                Pipeline Total: {formatCurrency(filteredData.reduce((sum, item) => sum + (item.monto_total_sin_imp || 0), 0))}
                            </p>
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

                    {selectedRecord && (
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#C7E196]">Nombre Oportunidad</label>
                                <p className="text-white/90 font-semibold text-lg">{selectedRecord.nombre_oportunidad || "Sin nombre"}</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C7E196]">Cliente Final</label>
                                    <p className="text-white/90">{selectedRecord.cliente_final}</p>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#C7E196]">Etapa Actual</label>
                                <div className="flex items-center gap-3 ">
                                    <Badge className={getEtapaBadge(selectedRecord.etapa_oportunidad) } >
                                        {selectedRecord.etapa_oportunidad || "No definida"}
                                        
                                    </Badge>
                                    <Button
                                        size="sm"
                                        onClick={() => setEditEtapaDialogOpen(true)}
                                        className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-1" />
                                        Cambiar Etapa
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        Monto Esperado
                                    </label>
                                    <p className="text-2xl font-bold text-[#C7E196]">
                                        {formatCurrency(selectedRecord.monto_total_sin_imp)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Probabilidad Cierre
                                    </label>
                                    {selectedRecord.probabilidad_cierre !== undefined ? (
                                        <>
                                            <p className="text-2xl font-bold text-white">{selectedRecord.probabilidad_cierre}%</p>
                                            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-[#C7E196] h-2 rounded-full transition-all"
                                                    style={{ width: `${selectedRecord.probabilidad_cierre}%` }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-white/60">No definida</p>
                                    )}
                                </div>
                            </div>

                            {selectedRecord.producto_ofrecido && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#C7E196]">Producto Ofrecido</label>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <p className="text-white/90">{selectedRecord.producto_ofrecido}</p>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#C7E196] flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Fecha de Registro
                                </label>
                                <p className="text-white/90">
                                    {new Date(selectedRecord.fecha_contacto).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Etapa Dialog */}
            <Dialog open={editEtapaDialogOpen} onOpenChange={setEditEtapaDialogOpen}>
                <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-[#C7E196]">Cambiar Etapa de Oportunidad</DialogTitle>
                        <DialogDescription className="text-white/60 pb-0 mb-0">
                            Selecciona la nueva etapa del embudo de ventas
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {selectedRecord && (
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-sm text-white/60 pb-2">Oportunidad:</p>
                                <p className="text-white font-semibold pb-1">{selectedRecord.nombre_oportunidad}</p>
                                <p className="text-sm text-white/60 mt-2 pb-2">Etapa actual:</p>
                                <Badge className={getEtapaBadge(selectedRecord.etapa_oportunidad)}>
                                    {selectedRecord.etapa_oportunidad || "No definida"}
                                </Badge>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nueva_etapa" className="text-[#C7E196]">Nueva Etapa *</Label>
                            <Select
                                value={nuevaEtapa}
                                onValueChange={setNuevaEtapa}
                            >
                                <SelectTrigger className="!bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Seleccionar etapa" />
                                </SelectTrigger>
                                <SelectContent className="!bg-[#C7E196]/90">
                                    <SelectItem value="Prospección">Prospección</SelectItem>
                                    <SelectItem value="Calificación">Calificación</SelectItem>
                                    <SelectItem value="Detección de necesidades">Detección de necesidades</SelectItem>
                                    <SelectItem value="Presentación de solución">Presentación de solución</SelectItem>
                                    <SelectItem value="Manejo de objeciones">Manejo de objeciones</SelectItem>
                                    <SelectItem value="Presentación de propuesta">Presentación de propuesta</SelectItem>
                                    <SelectItem value="Negociación">Negociación</SelectItem>
                                    <SelectItem value="Firma de contrato">Firma de contrato</SelectItem>
                                    <SelectItem value="Venta ganada">✅ Venta ganada</SelectItem>
                                    <SelectItem value="Venta perdida">❌ Venta perdida</SelectItem>
                                    <SelectItem value="Venta suspendida">⏸️ Venta suspendida</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditEtapaDialogOpen(false)}
                                disabled={updatingEtapa}
                                className=" !bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleUpdateEtapa}
                                disabled={updatingEtapa || !nuevaEtapa || nuevaEtapa === selectedRecord?.etapa_oportunidad}
                                className="bg-[#C7E196] hover:bg-[#C7E196]/90 text-[#013936] font-bold px-6 border-2 border-[#C7E196]"
                            >
                                {updatingEtapa ? "Actualizando..." : "Actualizar Etapa"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}