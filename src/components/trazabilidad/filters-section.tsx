import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Filter, X } from "lucide-react"
import { useEffect, useState } from "react"
import { jefeService } from "@/services/jefeService"

interface TrazabilidadFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
  onClearFilters: () => void
}

interface FilterOptions {
  ejecutivas: Array<{ id: number; nombre_completo: string }>
  empresas: Array<{ id: number; razon_social: string }>
  clientes: Array<{ id: number; razon_social: string }>
}

export function TrazabilidadFilters({ filters, onFilterChange, onClearFilters }: TrazabilidadFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    ejecutivas: [],
    empresas: [],
    clientes: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all" && v !== "" && v !== null)

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Cargando opciones de filtro desde BD...')
      
      const options = await jefeService.getFilterOptions()
      
      // 🔥 VALIDAR QUE HAY DATOS
      if (options.ejecutivas.length === 0 && options.empresas.length === 0 && options.clientes.length === 0) {
        setError('No se encontraron datos en la base de datos')
      } else {
        setFilterOptions(options)
        console.log('✅ Opciones cargadas desde BD:', options)
      }
      
    } catch (error) {
      console.error('❌ Error cargando opciones:', error)
      setError('Error al cargar los filtros. Contacte al administrador.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  // 🔥 ESTADOS DE CARGA Y ERROR
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardContent className="p-6">
          <div className="text-center text-white/60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C7E196] mx-auto mb-2"></div>
            Cargando filtros desde base de datos...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardContent className="p-6">
          <div className="text-center text-red-300">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
            <Button 
              onClick={loadFilterOptions} 
              className="mt-2 bg-[#C7E196] text-[#024a46] hover:bg-[#b5d184]"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#C7E196]" />
            <CardTitle className="text-white">Filtros Avanzados</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* ✅ EJECUTIVAS - DESDE BD */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Ejecutiva</label>
            <Select value={filters.ejecutiva} onValueChange={(value) => handleFilterChange("ejecutiva", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder={
                  filterOptions.ejecutivas.length === 0 ? "Sin ejecutivas" : "Todas las ejecutivas"
                } />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las ejecutivas</SelectItem>
                {filterOptions.ejecutivas.map((ejecutiva) => (
                  <SelectItem key={ejecutiva.id} value={ejecutiva.id.toString()}>
                    {ejecutiva.nombre_completo}
                  </SelectItem>
                ))}
                {filterOptions.ejecutivas.length === 0 && (
                  <SelectItem value="no-data" disabled>
                    No hay ejecutivas disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ EMPRESAS PROVEEDORAS - DESDE BD */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Empresa Proveedora</label>
            <Select value={filters.empresa} onValueChange={(value) => handleFilterChange("empresa", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder={
                  filterOptions.empresas.length === 0 ? "Sin empresas" : "Todas las empresas"
                } />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las empresas</SelectItem>
                {filterOptions.empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id.toString()}>
                    {empresa.razon_social}
                  </SelectItem>
                ))}
                {filterOptions.empresas.length === 0 && (
                  <SelectItem value="no-data" disabled>
                    No hay empresas disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ CLIENTES FINALES - DESDE BD */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Cliente Final</label>
            <Select value={filters.cliente} onValueChange={(value) => handleFilterChange("cliente", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder={
                  filterOptions.clientes.length === 0 ? "Sin clientes" : "Todos los clientes"
                } />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los clientes</SelectItem>
                {filterOptions.clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.razon_social}
                  </SelectItem>
                ))}
                {filterOptions.clientes.length === 0 && (
                  <SelectItem value="no-data" disabled>
                    No hay clientes disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ RESULTADO CONTACTO - FIJO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Resultado Contacto</label>
            <Select
              value={filters.resultadoContacto}
              onValueChange={(value) => handleFilterChange("resultadoContacto", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos los resultados" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los resultados</SelectItem>
                <SelectItem value="Positivo">✅ Positivo</SelectItem>
                <SelectItem value="Negativo">❌ Negativo</SelectItem>
                <SelectItem value="Pendiente">⏳ Pendiente</SelectItem>
                <SelectItem value="Neutro">⚪ Neutro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ ETAPA OPORTUNIDAD - FIJO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Etapa Oportunidad</label>
            <Select
              value={filters.etapaOportunidad}
              onValueChange={(value) => handleFilterChange("etapaOportunidad", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todas las etapas" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las etapas</SelectItem>
                <SelectItem value="Prospección">🔍 Prospección</SelectItem>
                <SelectItem value="Calificación">📋 Calificación</SelectItem>
                <SelectItem value="Detección de necesidades">🎯 Detección de necesidades</SelectItem>
                <SelectItem value="Presentación de solución">📊 Presentación de solución</SelectItem>
                <SelectItem value="Manejo de objeciones">🛡️ Manejo de objeciones</SelectItem>
                <SelectItem value="Presentación de propuesta">📑 Presentación de propuesta</SelectItem>
                <SelectItem value="Negociación">🤝 Negociación</SelectItem>
                <SelectItem value="Firma de contrato">📝 Firma de contrato</SelectItem>
                <SelectItem value="Venta ganada">🎉 Venta ganada</SelectItem>
                <SelectItem value="Venta perdida">💔 Venta perdida</SelectItem>
                <SelectItem value="Venta suspendida">⏸️ Venta suspendida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ TIPO CONTACTO - FIJO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Tipo Contacto</label>
            <Select value={filters.tipoContacto} onValueChange={(value) => handleFilterChange("tipoContacto", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Llamada telefónica">📞 Llamada telefónica</SelectItem>
                <SelectItem value="Chat de Whatsapp">💬 Chat de Whatsapp</SelectItem>
                <SelectItem value="Correo electrónico">📧 Correo electrónico</SelectItem>
                <SelectItem value="Contacto por linkedin">💼 Contacto por LinkedIn</SelectItem>
                <SelectItem value="Reunión presencial">👥 Reunión presencial</SelectItem>
                <SelectItem value="Otro">❓ Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ TIPO OPORTUNIDAD - FIJO
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Tipo Oportunidad</label>
            <Select
              value={filters.tipoOportunidad}
              onValueChange={(value) => handleFilterChange("tipoOportunidad", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="One-shot">🎯 One-shot</SelectItem>
                <SelectItem value="Mensual">📅 Mensual</SelectItem>
                <SelectItem value="Proyecto">🚀 Proyecto</SelectItem>
                <SelectItem value="Otro">❓ Otro</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* ✅ EMBUDO DE VENTAS - FIJO
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Embudo de Ventas</label>
            <Select
              value={filters.embudoVentas}
              onValueChange={(value) => handleFilterChange("embudoVentas", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="etapa1">📞 Etapa 1 - Contacto</SelectItem>
                <SelectItem value="etapa2">🎯 Etapa 2 - Oportunidad</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* ✅ REUNIÓN AGENDADA - FIJO
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Reunión Agendada</label>
            <Select
              value={filters.reunionAgendada}
              onValueChange={(value) => handleFilterChange("reunionAgendada", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">✅ Con reunión</SelectItem>
                <SelectItem value="false">❌ Sin reunión</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* ✅ REUNIÓN REALIZADA - FIJO
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Reunión Realizada</label>
            <Select
              value={filters.reunionRealizada}
              onValueChange={(value) => handleFilterChange("reunionRealizada", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">✅ Realizada</SelectItem>
                <SelectItem value="false">❌ No realizada</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* ✅ FECHA DESDE */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Fecha Desde</label>
            <Input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange("fechaDesde", e.target.value)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/15 placeholder:text-white/50"
              placeholder="Seleccione fecha"
            />
          </div>

          {/* ✅ FECHA HASTA */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Fecha Hasta</label>
            <Input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange("fechaHasta", e.target.value)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/15 placeholder:text-white/50"
              placeholder="Seleccione fecha"
            />
          </div>

          
        </div>        
        {/* 🔥 INDICADOR DE DATOS REALES
        <div className="mt-4 text-xs text-[#C7E196]/70 text-center">
          {filterOptions.ejecutivas.length > 0 || filterOptions.empresas.length > 0 || filterOptions.clientes.length > 0 
            ? `✅ Datos en tiempo real desde BD - Ejecutivas: ${filterOptions.ejecutivas.length}, Empresas: ${filterOptions.empresas.length}, Clientes: ${filterOptions.clientes.length}`
            : '⚠️ No hay datos disponibles en la base de datos'
          }
        </div> */}

        {/* 🔥 BOTÓN DE REINTENTO SI HAY POCOS DATOS */}
        {(filterOptions.ejecutivas.length === 0 || filterOptions.empresas.length === 0 || filterOptions.clientes.length === 0) && (
          <div className="mt-3 text-center">
            <Button 
              onClick={loadFilterOptions} 
              variant="outline"
              size="sm"
              className="text-[#C7E196] border-[#C7E196]/30 hover:bg-[#C7E196]/10"
            >
              🔄 Recargar datos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}