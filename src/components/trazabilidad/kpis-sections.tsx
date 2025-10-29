// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { jefeService } from "@/services/jefeService"

// interface TrazabilidadKPIsProps {
//   filters: any
// }

// export function TrazabilidadKPIs({ filters }: TrazabilidadKPIsProps) {
//   const [nuevosClientes, setNuevosClientes] = useState<any[]>([])
//   const [contactosPorTipo, setContactosPorTipo] = useState<any[]>([])
//   const [montosPorEtapa, setMontosPorEtapa] = useState<any[]>([])
//   const [tasaConversion, setTasaConversion] = useState<any[]>([])
//   const [embudoVentas, setEmbudoVentas] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchKPIs()
//   }, [filters])

//   const fetchKPIs = async () => {
//     try {
//       setLoading(true)
//       console.log('📊 [TrazabilidadKPIs] Cargando gráficos con filtros:', filters)

//       const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined
//       const empresaId = filters.empresa !== "all" ? parseInt(filters.empresa) : undefined

//       // Fetch todos los KPIs en paralelo
//       const [
//         nuevosClientesData,
//         contactosData,
//         montosData,
//         conversionData
//       ] = await Promise.all([
//         jefeService.getTrazabilidadNuevosClientes(6, ejecutivaId),
//         jefeService.getTrazabilidadContactosPorTipo({
//           ejecutivaId,
//           fechaDesde: filters.fechaDesde,
//           fechaHasta: filters.fechaHasta
//         }),
//         jefeService.getTrazabilidadMontosPorEtapa({
//           ejecutivaId,
//           fechaDesde: filters.fechaDesde,
//           fechaHasta: filters.fechaHasta
//         }),
//         jefeService.getTrazabilidadTasaConversion({
//           fechaDesde: filters.fechaDesde,
//           fechaHasta: filters.fechaHasta
//         })
//       ])

//       console.log('📊 [TrazabilidadKPIs] Datos recibidos:', {
//         nuevosClientes: nuevosClientesData,
//         contactos: contactosData,
//         montos: montosData,
//         conversion: conversionData
//       })

//       setNuevosClientes(nuevosClientesData || [])
//       setContactosPorTipo(contactosData || [])
//       setMontosPorEtapa(montosData || [])
//       setTasaConversion(conversionData || [])
//     } catch (error) {
//       console.error('❌ [TrazabilidadKPIs] Error al cargar KPIs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2">
//         {[1, 2, 3, 4].map((i) => (
//           <Card key={i} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardContent className="pt-6">
//               <div className="h-[250px] flex items-center justify-center">
//                 <p className="text-white/60">Cargando gráficos...</p>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       {/* Nuevos Contactos (CORREGIDO) */}
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <CardTitle className="text-white">Nuevos Contactos</CardTitle>
//           <CardDescription className="text-white/60">Últimos 6 meses</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {nuevosClientes.length > 0 ? (
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={nuevosClientes}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                 <XAxis dataKey="mes" stroke="rgba(255,255,255,0.6)" />
//                 <YAxis stroke="rgba(255,255,255,0.6)" />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
//                   labelStyle={{ color: "#C7E196" }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="contactos"
//                   stroke="#C7E196"
//                   strokeWidth={2}
//                   dot={{ fill: "#C7E196" }}
//                   name="Contactos"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[250px] flex items-center justify-center">
//               <p className="text-white/60">No hay datos de contactos</p>
//               <p className="text-white/40 text-sm mt-2">Últimos 6 meses</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Contactos por Tipo */}
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <CardTitle className="text-white">Distribución de Contactos</CardTitle>
//           <CardDescription className="text-white/60">Por canal de comunicación</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {contactosPorTipo.length > 0 ? (
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie
//                   data={contactosPorTipo}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, value }) => `${name}: ${value}`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {contactosPorTipo.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{ backgroundColor: "#C7E196", border: "1px solid #C7E196", color: "white" }}
//                   labelStyle={{ color: "white", }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[250px] flex items-center justify-center">
//               <p className="text-white/60">No hay datos de tipos de contacto</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Montos por Etapa */}
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <CardTitle className="text-white">Montos por Etapa</CardTitle>
//           <CardDescription className="text-white/60">Distribución de oportunidades</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {montosPorEtapa.length > 0 ? (
//             <ResponsiveContainer width="100%" height={310}>
//               <BarChart data={montosPorEtapa} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                 <XAxis
//                   type="number"
//                   stroke="rgba(255,255,255,0.6)"
//                   tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
//                 />
//                 <YAxis
//                   dataKey="etapa"
//                   type="category"
//                   stroke="rgba(255,255,255,0.6)"
//                   width={120}
//                   tickFormatter={(value) => {
//                     const etapasCortas: { [key: string]: string } = {
//                       'Prospección': 'Prosp.',
//                       'Calificación': 'Calif.',
//                       'Presentación de propuesta': 'Present.',
//                       'Negociación': 'Negoc.',
//                       'Venta ganada': 'Ganada',
//                       'Venta perdida': 'Perdida'
//                     }
//                     return etapasCortas[value] || value
//                   }}
//                 />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
//                   labelStyle={{ color: "#C7E196" }}
//                   formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monto']}
//                 />
//                 <Bar dataKey="monto" fill="#C7E196" name="Monto" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="h-[250px] flex items-center justify-center">
//               <p className="text-white/60">No hay datos de montos</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Ventas Cerradas por Ejecutiva */}
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <CardTitle className="text-white">Ventas Cerradas</CardTitle>
//           <CardDescription className="text-white/60">Por ejecutiva comercial</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {tasaConversion.length > 0 ? (
//             <div className="space-y-4">
//               {/* Gráfico de barras para ventas ganadas */}
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={tasaConversion}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                   <XAxis dataKey="ejecutiva" stroke="rgba(255,255,255,0.6)" />
//                   <YAxis stroke="rgba(255,255,255,0.6)" />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
//                     labelStyle={{ color: "#C7E196" }}
//                     formatter={(value, name, props) => {
//                       if (name === 'Ventas Ganadas') {
//                         return [
//                           value,
//                           `Ventas Ganadas (${props.payload.tasa}% de conversión)`
//                         ];
//                       }
//                       return [value, name];
//                     }}
//                   />
//                   <Legend />
//                   <Bar
//                     dataKey="ventas_ganadas"
//                     fill="#10B981"
//                     name="Ventas Ganadas"
//                     radius={[4, 4, 0, 0]}
//                   />
//                   <Bar
//                     dataKey="ventas_perdidas"
//                     fill="#EF4444"
//                     name="Ventas Perdidas"
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>

//               {/* Tarjetas de resumen */}
//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 {tasaConversion.map((ejecutiva, index) => (
//                   <div key={index} className="bg-white/5 rounded p-2">
//                     <div className="font-semibold text-[#C7E196]">{ejecutiva.ejecutiva}</div>
//                     <div className="text-white/80">
//                       <div>✅ {ejecutiva.ventas_ganadas} ganadas</div>
//                       <div>❌ {ejecutiva.ventas_perdidas} perdidas</div>
//                       <div>📊 {ejecutiva.tasa}% conversión</div>
//                       {ejecutiva.monto_total_ganado > 0 && (
//                         <div>💰 ${(ejecutiva.monto_total_ganado / 1000).toFixed(0)}K</div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="h-[250px] flex items-center justify-center">
//               <p className="text-white/60">No hay datos de ventas</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-white">Embudo de Ventas</CardTitle>
//           <CardDescription className="text-white/60">
//             Progresión de oportunidades - De mayor a menor cantidad
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="pt-0">
//           {embudoVentas.length > 0 ? (
//             <div className="flex flex-col justify-center h-full min-h-[280px] space-y-4">
//               {embudoVentas.map((etapa, index) => {
//                 // USA el porcentaje que YA VIENE CALCULADO del backend
//                 const porcentaje = etapa.tasa_conversion;
//                 const width = 100 - (index * 20);

//                 return (
//                   <div key={index} className="flex items-center justify-between">
//                     <div className="w-32 text-sm text-white/80 font-medium flex-shrink-0">
//                       {etapa.etapa}
//                     </div>

//                     <div className="flex-1 flex justify-center">
//                       <div
//                         className="h-8 flex items-center justify-center text-white font-bold transition-all duration-300"
//                         style={{
//                           width: `${width}%`,
//                           backgroundColor: [
//                             '#6F9E2B', '#8CBD35', '#A9D45E', '#B2C48A', '#C7E196'
//                           ][index] || '#6B7280',
//                           borderRadius: '6px',
//                           minWidth: '80px'
//                         }}
//                       >
//                         {etapa.cantidad}
//                       </div>
//                     </div>

//                     <div className="w-12 text-white/60 text-sm font-medium text-right flex-shrink-0">
//                       {porcentaje}%  {/* ← Ahora usa tasa_conversion del backend */}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="h-[280px] flex flex-col items-center justify-center text-white/60">
//               <p className="text-lg mb-2">🔄</p>
//               <p>No hay datos del embudo de ventas</p>
//               <p className="text-sm mt-2 text-center">Los datos aparecerán cuando las oportunidades<br />avancen en el embudo</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from "recharts"
import { jefeService } from "@/services/jefeService"

interface TrazabilidadKPIsProps {
  filters: any
}

export function TrazabilidadKPIs({ filters }: TrazabilidadKPIsProps) {
  const [nuevasReuniones, setNuevasReuniones] = useState<any[]>([])
  const [nuevasVentas, setNuevasVentas] = useState<any[]>([])
  const [efectividadCanales, setEfectividadCanales] = useState<any[]>([])
  const [resumenSemanal, setResumenSemanal] = useState<any[]>([])
  const [embudoVentas, setEmbudoVentas] = useState<any[]>([])
  const [rankingEjecutivas, setRankingEjecutivas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIs()
  }, [filters])

  const fetchKPIs = async () => {
    try {
      setLoading(true)
      console.log('📊 [TrazabilidadKPIs] Cargando 6 gráficos con filtros:', filters)
      
      const ejecutivaId = filters.ejecutiva !== "all" ? parseInt(filters.ejecutiva) : undefined

      const [
        reunionesData,
        ventasData,
        efectividadData,
        resumenData,
        embudoData,
        rankingData
      ] = await Promise.all([
        jefeService.getTrazabilidadNuevasReuniones(6, ejecutivaId),
        jefeService.getTrazabilidadNuevasVentas(6, ejecutivaId),
        jefeService.getTrazabilidadEfectividadCanales({
          ejecutivaId,
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        }),
        jefeService.getTrazabilidadResumenSemanal(),
        jefeService.getTrazabilidadEmbudoVentas({
          ejecutivaId,
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        }),
        jefeService.getTrazabilidadRankingEjecutivas({
          fechaDesde: filters.fechaDesde,
          fechaHasta: filters.fechaHasta
        })
      ])

      setNuevasReuniones(reunionesData || [])
      setNuevasVentas(ventasData || [])
      setEfectividadCanales(efectividadData || [])
      setResumenSemanal(resumenData || [])
      setEmbudoVentas(embudoData || [])
      setRankingEjecutivas(rankingData || [])
    } catch (error) {
      console.error('❌ [TrazabilidadKPIs] Error al cargar KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardContent className="pt-6">
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-white/60">Cargando gráfico...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Custom Tooltip para Efectividad de Canales
  const CustomTooltipEfectividad = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#024a46] border border-[#C7E196] p-3 rounded-lg shadow-lg">
          <p className="font-bold text-[#C7E196]">{label}</p>
          <p className="text-white">Total: <span className="text-white">{data.total_contactos}</span></p>
          <p className="text-green-400">✅ Positivos: {data.positivos}</p>
          <p className="text-red-400">❌ Negativos: {data.negativos}</p>
          <p className="text-yellow-400">⏳ Pendientes: {data.pendientes}</p>
          <p className="text-blue-400">⚪ Neutros: {data.neutros}</p>
          <p className="text-[#C7E196] font-bold">📊 Efectividad: {data.efectividad}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip para Embudo de Ventas


  return (
    <div className="space-y-6">
      {/* Fila 1: Reuniones y Ventas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nuevas Reuniones Agendadas */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Nuevas Reuniones Agendadas</CardTitle>
            <CardDescription className="text-white/60">
              Total de reuniones programadas en los últimos 6 meses
              {nuevasReuniones.length === 0 && " - No hay datos de reuniones"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nuevasReuniones.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nuevasReuniones}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                    labelStyle={{ color: "#C7E196" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reuniones"  
                    stroke="#C7E196" 
                    strokeWidth={3} 
                    dot={{ fill: "#C7E196", strokeWidth: 2, r: 6 }}
                    name="Reuniones"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-white/60">
                <p className="text-lg mb-2">📅</p>
                <p>No hay reuniones agendadas</p>
                <p className="text-sm mt-2">Los datos aparecerán cuando se programen reuniones</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nuevas Ventas */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Nuevas Ventas</CardTitle>
            <CardDescription className="text-white/60">
              Ventas ganadas en los últimos 6 meses
              {nuevasVentas.length === 0 && " - No hay ventas registradas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nuevasVentas.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={nuevasVentas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                    labelStyle={{ color: "#C7E196" }}
                  />
                  <Bar 
                    dataKey="ventas" 
                    fill="#10B981" 
                    name="Ventas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-white/60">
                <p className="text-lg mb-2">💰</p>
                <p>No hay ventas registradas</p>
                <p className="text-sm mt-2">Los datos aparecerán cuando se cierren ventas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fila 2: Efectividad Canales y Resumen Semanal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Efectividad de Canales */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Efectividad de Canales de Contacto</CardTitle>
            <CardDescription className="text-white/60">
              Resultados por canal - Ordenado por efectividad
            </CardDescription>
          </CardHeader>
          <CardContent>
            {efectividadCanales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={efectividadCanales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="canal" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip content={<CustomTooltipEfectividad />} />
                  <Legend />
                  <Bar dataKey="positivos" fill="#10B981" name=" Positivos" radius={[2, 2, 0, 0]} className="!mr-20" />
                  <Bar dataKey="negativos" fill="#EF4444" name=" Negativos" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pendientes" fill="#F59E0B" name=" Pendientes" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="neutros" fill="#3B82F6" name=" Neutros" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-white/60">
                <p>No hay datos de contactos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen Semanal */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Resumen de Ejecutivas</CardTitle>
            <CardDescription className="text-white/60">
              Actividades y resultados de todas las ejecutivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumenSemanal.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={resumenSemanal.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="ejecutiva" stroke="rgba(255,255,255,0.6)" fontSize={13} />
                    <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196", fontSize: '13px' }}
                      labelStyle={{ color: "#C7E196", fontSize: '13px' }}
                    />
                    <Bar dataKey="ventas_ganadas" fill="#10B981" name="Ventas" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                
                {/* LISTA CON SCROLL */}
                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-2">
                  {resumenSemanal.map((ej, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 rounded p-2 text-sm">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white/10 rounded text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-white font-medium truncate">{ej.ejecutiva}</span>
                      </div>
                      <div className="flex space-x-3 text-xs flex-shrink-0">
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">{ej.reuniones_agendadas}</div>
                          <div className="text-white/60">Reuniones</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold">{ej.ventas_ganadas}</div>
                          <div className="text-white/60">Ventas</div>
                        </div>
                        {ej.monto_total > 0 && (
                          <div className="text-center">
                            <div className="text-[#C7E196] font-bold">${(ej.monto_total/1000).toFixed(0)}K</div>
                            <div className="text-white/60">Monto</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-white/60">
                <p className="text-lg mb-2">👥</p>
                <p>No hay actividades de ejecutivas</p>
                <p className="text-sm mt-2">Los datos aparecerán cuando las ejecutivas registren actividades</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

      {/* Fila 3: Embudo de Ventas y Ranking */}
      <div className="grid gap-6 md:grid-cols-2">
       
        {/* Embudo de Ventas - Funnel Chart */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Embudo de Ventas</CardTitle>
            <CardDescription className="text-white/60">
              Progresión de oportunidades - De mayor a menor cantidad
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {embudoVentas.length > 0 ? (
              <div className="flex flex-col justify-center h-full min-h-[280px] space-y-4">
                {embudoVentas.map((etapa, index) => {
                  // USA el porcentaje que YA VIENE CALCULADO del backend
                  const porcentaje = etapa.tasa_conversion;
                  const width = 100 - (index * 20);
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-32 text-sm text-white/80 font-medium flex-shrink-0">
                        {etapa.etapa}
                      </div>
                      
                      <div className="flex-1 flex justify-center">
                        <div 
                          className="h-8 flex items-center justify-center text-white font-bold transition-all duration-300"
                          style={{ 
                            width: `${width}%`,
                            backgroundColor: [
                              '#6F9E2B',  '#8CBD35',  '#A9D45E',  '#B2C48A',  '#C7E196'
                            ][index] || '#6B7280',
                            borderRadius: '6px',
                            minWidth: '80px'
                          }}
                        >
                          {etapa.cantidad}
                        </div>
                      </div>
                      
                      <div className="w-12 text-white/60 text-sm font-medium text-right flex-shrink-0">
                        {porcentaje}%  {/* ← Ahora usa tasa_conversion del backend */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-white/60">
                <p className="text-lg mb-2">🔄</p>
                <p>No hay datos del embudo de ventas</p>
                <p className="text-sm mt-2 text-center">Los datos aparecerán cuando las oportunidades<br />avancen en el embudo</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking de Ejecutivas */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Ranking de Ejecutivas</CardTitle>
            <CardDescription className="text-white/60">
              Top performers por ventas cerradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rankingEjecutivas.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={rankingEjecutivas.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="ejecutiva" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                      labelStyle={{ color: "#C7E196" }}
                    />
                    <Bar 
                      dataKey="ventas_ganadas" 
                      fill="#10B981" 
                      name="Ventas Ganadas" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {rankingEjecutivas.map((ej, index) => (
                    <div key={ej.id_ejecutiva} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-white/20 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-white font-medium">{ej.ejecutiva}</div>
                          <div className="text-white/60 text-xs">
                            {ej.clientes_potenciales} clientes potenciales
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#C7E196] font-bold text-lg">{ej.ventas_ganadas} ventas</div>
                        <div className="text-white/60 text-xs">
                          ${(ej.monto_total).toLocaleString()} • {ej.efectividad}% efect.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-white/60">
                <p className="text-lg mb-2">🏆</p>
                <p>No hay datos para el ranking</p>
                <p className="text-sm mt-2">Los datos aparecerán cuando las ejecutivas cierren ventas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}