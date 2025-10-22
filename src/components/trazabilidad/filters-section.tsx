// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Filter, X } from "lucide-react"

// interface TrazabilidadFiltersProps {
//   filters: any
//   onFilterChange: (filters: any) => void
//   onClearFilters: () => void
// }

// export function TrazabilidadFilters({ filters, onFilterChange, onClearFilters }: TrazabilidadFiltersProps) {
//   const hasActiveFilters = Object.values(filters).some((v) => v !== "all" && v !== "")

//   const handleFilterChange = (key: string, value: string) => {
//     onFilterChange({ ...filters, [key]: value })
//   }

//   return (
//     <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Filter className="w-5 h-5 text-[#C7E196]" />
//             <CardTitle className="text-white">Filtros Avanzados</CardTitle>
//           </div>
//           {hasActiveFilters && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClearFilters}
//               className="text-white/80 hover:text-white hover:bg-white/10"
//             >
//               <X className="w-4 h-4 mr-2" />
//               Limpiar Filtros
//             </Button>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Ejecutiva</label>
//             <Select value={filters.ejecutiva} onValueChange={(value) => handleFilterChange("ejecutiva", value)}>
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todas" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todas las ejecutivas</SelectItem>
//                 <SelectItem value="1">María Fernández Rojas</SelectItem>
//                 <SelectItem value="2">Carmen López Torres</SelectItem>
//                 <SelectItem value="3">Sandra Pérez Gómez</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Empresa Proveedora</label>
//             <Select value={filters.empresa} onValueChange={(value) => handleFilterChange("empresa", value)}>
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todas" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todas las empresas</SelectItem>
//                 <SelectItem value="1">Ron Cartavio S.A.</SelectItem>
//                 <SelectItem value="2">Alicorp S.A.A.</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Cliente Final</label>
//             <Select value={filters.cliente} onValueChange={(value) => handleFilterChange("cliente", value)}>
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todos" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los clientes</SelectItem>
//                 <SelectItem value="1">Banco de Crédito BCP</SelectItem>
//                 <SelectItem value="2">Interbank</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Resultado Contacto</label>
//             <Select
//               value={filters.resultadoContacto}
//               onValueChange={(value) => handleFilterChange("resultadoContacto", value)}
//             >
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todos" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los resultados</SelectItem>
//                 <SelectItem value="positivo">Positivo</SelectItem>
//                 <SelectItem value="negativo">Negativo</SelectItem>
//                 <SelectItem value="pendiente">Pendiente</SelectItem>
//                 <SelectItem value="neutro">Neutro</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Etapa Oportunidad</label>
//             <Select
//               value={filters.etapaOportunidad}
//               onValueChange={(value) => handleFilterChange("etapaOportunidad", value)}
//             >
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todas" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todas las etapas</SelectItem>
//                 <SelectItem value="prospección">Prospección</SelectItem>
//                 <SelectItem value="calificación">Calificación</SelectItem>
//                 <SelectItem value="presentación">Presentación de propuesta</SelectItem>
//                 <SelectItem value="negociación">Negociación</SelectItem>
//                 <SelectItem value="cierre">Firma de contrato</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Tipo Contacto</label>
//             <Select value={filters.tipoContacto} onValueChange={(value) => handleFilterChange("tipoContacto", value)}>
//               <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
//                 <SelectValue placeholder="Todos" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los tipos</SelectItem>
//                 <SelectItem value="llamada">Llamada</SelectItem>
//                 <SelectItem value="email">Email</SelectItem>
//                 <SelectItem value="whatsapp">WhatsApp</SelectItem>
//                 <SelectItem value="linkedin">LinkedIn</SelectItem>
//                 <SelectItem value="reunión">Reunión presencial</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Fecha Desde</label>
//             <Input
//               type="date"
//               value={filters.fechaDesde}
//               onChange={(e) => handleFilterChange("fechaDesde", e.target.value)}
//               className="bg-white/10 border-white/20 text-white hover:bg-white/15"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-white/80 font-medium">Fecha Hasta</label>
//             <Input
//               type="date"
//               value={filters.fechaHasta}
//               onChange={(e) => handleFilterChange("fechaHasta", e.target.value)}
//               className="bg-white/10 border-white/20 text-white hover:bg-white/15"
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
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

  const hasActiveFilters = Object.values(filters).some((v) => v !== "all" && v !== "")

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      setLoading(true)
      console.log('🔄 Cargando opciones de filtro...')
      
      // En una implementación real, esto vendría de tu API
      const options = await jefeService.getFilterOptions()
      setFilterOptions(options)
      
      console.log('✅ Opciones cargadas:', options)
    } catch (error) {
      console.error('❌ Error cargando opciones:', error)
      // Opción de respaldo mientras implementas la API
      setFilterOptions({
        ejecutivas: [
          { id: 1, nombre_completo: 'Jherson Medrano' },
          { id: 2, nombre_completo: 'Pedro Suarez' }
        ],
        empresas: [
          { id: 1, razon_social: 'Rimac Seguros' }
        ],
        clientes: [
          { id: 4, razon_social: 'SuperMarket Perú S.A.' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardContent className="p-6">
          <div className="text-center text-white/60">Cargando filtros...</div>
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
          
          {/* ✅ EJECUTIVAS - DINÁMICO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Ejecutiva</label>
            <Select value={filters.ejecutiva} onValueChange={(value) => handleFilterChange("ejecutiva", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las ejecutivas</SelectItem>
                {filterOptions.ejecutivas.map((ejecutiva) => (
                  <SelectItem key={ejecutiva.id} value={ejecutiva.id.toString()}>
                    {ejecutiva.nombre_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ EMPRESAS PROVEEDORAS - DINÁMICO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Empresa Proveedora</label>
            <Select value={filters.empresa} onValueChange={(value) => handleFilterChange("empresa", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las empresas</SelectItem>
                {filterOptions.empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id.toString()}>
                    {empresa.razon_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ CLIENTES FINALES - DINÁMICO */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Cliente Final</label>
            <Select value={filters.cliente} onValueChange={(value) => handleFilterChange("cliente", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los clientes</SelectItem>
                {filterOptions.clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
                    {cliente.razon_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ RESULTADO CONTACTO - FIJO (valores predefinidos) */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Resultado Contacto</label>
            <Select
              value={filters.resultadoContacto}
              onValueChange={(value) => handleFilterChange("resultadoContacto", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los resultados</SelectItem>
                <SelectItem value="Positivo">Positivo</SelectItem>
                <SelectItem value="Negativo">Negativo</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ ETAPA OPORTUNIDAD - FIJO (valores predefinidos) */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Etapa Oportunidad</label>
            <Select
              value={filters.etapaOportunidad}
              onValueChange={(value) => handleFilterChange("etapaOportunidad", value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todas las etapas</SelectItem>
                <SelectItem value="Prospección">Prospección</SelectItem>
                <SelectItem value="Calificación">Calificación</SelectItem>
                <SelectItem value="Presentación de propuesta">Presentación</SelectItem>
                <SelectItem value="Negociación">Negociación</SelectItem>
                <SelectItem value="Venta ganada">Venta Ganada</SelectItem>
                <SelectItem value="Venta perdida">Venta Perdida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ✅ TIPO CONTACTO - FIJO (valores predefinidos) */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Tipo Contacto</label>
            <Select value={filters.tipoContacto} onValueChange={(value) => handleFilterChange("tipoContacto", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-[#012826]/90 text-white">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Llamada telefónica">Llamada</SelectItem>
                <SelectItem value="Correo electrónico">Email</SelectItem>
                <SelectItem value="Chat de Whatsapp">WhatsApp</SelectItem>
                <SelectItem value="Contacto por linkedin">LinkedIn</SelectItem>
                <SelectItem value="Reunión presencial">Reunión presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FECHAS - Se mantienen igual */}
          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Fecha Desde</label>
            <Input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => handleFilterChange("fechaDesde", e.target.value)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/15"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/80 font-medium">Fecha Hasta</label>
            <Input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => handleFilterChange("fechaHasta", e.target.value)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/15"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
