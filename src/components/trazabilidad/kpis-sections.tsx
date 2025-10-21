"use client"

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

      setNuevosClientes(nuevosClientesData || [])
      setContactosPorTipo(contactosData || [])
      setMontosPorEtapa(montosData || [])
      setTasaConversion(conversionData || [])
    } catch (error) {
      console.error('Error al cargar KPIs:', error)
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
                <p className="text-white/60">Cargando...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Nuevos Clientes */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Nuevos Clientes</CardTitle>
          <CardDescription className="text-white/60">Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
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
                dataKey="clientes" 
                stroke="#C7E196" 
                strokeWidth={2} 
                dot={{ fill: "#C7E196" }}
                name="Clientes"
              />
            </LineChart>
          </ResponsiveContainer>
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
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                  labelStyle={{ color: "#C7E196" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos disponibles</p>
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
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={montosPorEtapa} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.6)" />
                <YAxis dataKey="etapa" type="category" stroke="rgba(255,255,255,0.6)" width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                  labelStyle={{ color: "#C7E196" }}
                  formatter={(value) => `${((value as number) / 1000).toFixed(0)}K`}
                />
                <Bar dataKey="monto" fill="#C7E196" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasa Conversión por Ejecutiva */}
      <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
        <CardHeader>
          <CardTitle className="text-white">Tasa de Conversión</CardTitle>
          <CardDescription className="text-white/60">Por ejecutiva comercial</CardDescription>
        </CardHeader>
        <CardContent>
          {tasaConversion.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tasaConversion}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="ejecutiva" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#024a46", border: "1px solid #C7E196" }}
                  labelStyle={{ color: "#C7E196" }}
                  formatter={(value) => `${value as number}%`}
                />
                <Bar dataKey="tasa" fill="#C7E196" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-white/60">No hay datos disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}