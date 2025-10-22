import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { jefeService } from "@/services/jefeService"

interface TrazabilidadKPIsProps {
  filters: any
}

export function TrazabilidadKPIs({ filters }: TrazabilidadKPIsProps) {
  const [nuevosClientes, setNuevosClientes] = useState<any[]>([])
  const [contactosPorTipo, setContactosPorTipo] = useState<any[]>([])
  const [montosPorEtapa, setMontosPorEtapa] = useState<any[]>([])
  const [tasaConversion, setTasaConversion] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [filters])

  const fetchKPIs = async () => {
    try {
      setLoading(true)
      console.log('📊 [TrazabilidadKPIs] Cargando gráficos con filtros:', filters)
      
      const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
      const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined

      // Fetch todos los KPIs en paralelo
      const [
        nuevosClientesData,
        contactosData,
        montosData,
        conversionData
      ] = await Promise.all([
        jefeService.getTrazabilidadNuevosClientes(6, ejecutivaId),
        jefeService.getTrazabilidadContactosPorTipo({
          ejecutivaId,
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        }),
        jefeService.getTrazabilidadMontosPorEtapa({
          ejecutivaId,
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        }),
        jefeService.getTrazabilidadTasaConversion({
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        })
      ])

      console.log('📊 [TrazabilidadKPIs] Datos recibidos:', {
        nuevosClientes: nuevosClientesData,
        contactos: contactosData,
        montos: montosData,
        conversion: conversionData
      })

      setNuevosClientes(nuevosClientesData || [])
      setContactosPorTipo(contactosData || [])
      setMontosPorEtapa(montosData || [])
      setTasaConversion(conversionData || [])
    } catch (error) {
      console.error('❌ [TrazabilidadKPIs] Error al cargar KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardContent className="pt-6">
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-white/60">Cargando gráficos...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Nuevos Contactos (CORREGIDO) */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Nuevos Contactos</CardTitle>
          <CardDescription className="text-white/60">Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          {nuevosClientes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={nuevosClientes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mes" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                  labelStyle={{ color: "#C7E196" }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="contactos"  
                  stroke="#C7E196" 
                  strokeWidth={2} 
                  dot={{ fill: "#C7E196" }}
                  name="Contactos"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos de contactos</p>
              <p className="text-white/40 text-sm mt-2">Últimos 6 meses</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contactos por Tipo */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Distribución de Contactos</CardTitle>
          <CardDescription className="text-white/60">Por canal de comunicación</CardDescription>
        </CardHeader>
        <CardContent>
          {contactosPorTipo.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contactosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contactosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#C7E196", border: "1px solid #C7E196" , color: "white" }}
                  labelStyle={{ color: "white", }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos de tipos de contacto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Montos por Etapa */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Montos por Etapa</CardTitle>
          <CardDescription className="text-white/60">Distribución de oportunidades</CardDescription>
        </CardHeader>
        <CardContent>
          {montosPorEtapa.length > 0 ? (
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={montosPorEtapa} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  stroke="rgba(255,255,255,0.6)" 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  dataKey="etapa" 
                  type="category" 
                  stroke="rgba(255,255,255,0.6)" 
                  width={120}
                  tickFormatter={(value) => {
                    const etapasCortas: {[key: string]: string} = {
                      'Prospección': 'Prosp.',
                      'Calificación': 'Calif.',
                      'Presentación de propuesta': 'Present.',
                      'Negociación': 'Negoc.',
                      'Venta ganada': 'Ganada',
                      'Venta perdida': 'Perdida'
                    }
                    return etapasCortas[value] || value
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                  labelStyle={{ color: "#C7E196" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monto']}
                />
                <Bar dataKey="monto" fill="#C7E196" name="Monto" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos de montos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ventas Cerradas por Ejecutiva */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Ventas Cerradas</CardTitle>
          <CardDescription className="text-white/60">Por ejecutiva comercial</CardDescription>
        </CardHeader>
        <CardContent>
          {tasaConversion.length > 0 ? (
            <div className="space-y-4">
              {/* Gráfico de barras para ventas ganadas */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tasaConversion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="ejecutiva" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                    labelStyle={{ color: "#C7E196" }}
                    formatter={(value, name, props) => {
                      if (name === 'Ventas Ganadas') {
                        return [
                          value, 
                          `Ventas Ganadas (${props.payload.tasa}% de conversión)`
                        ];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="ventas_ganadas" 
                    fill="#10B981" 
                    name="Ventas Ganadas" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="ventas_perdidas" 
                    fill="#EF4444" 
                    name="Ventas Perdidas" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {tasaConversion.map((ejecutiva, index) => (
                  <div key={index} className="bg-white/5 rounded p-2">
                    <div className="font-semibold text-[#C7E196]">{ejecutiva.ejecutiva}</div>
                    <div className="text-white/80">
                      <div>✅ {ejecutiva.ventas_ganadas} ganadas</div>
                      <div>❌ {ejecutiva.ventas_perdidas} perdidas</div>
                      <div>📊 {ejecutiva.tasa}% conversión</div>
                      {ejecutiva.monto_total_ganado > 0 && (
                        <div>💰 ${(ejecutiva.monto_total_ganado / 1000).toFixed(0)}K</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos de ventas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}