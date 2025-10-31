import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  User,
  Users,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  Video,
  MessageCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { clienteService, Trazabilidad } from '@/services/clienteService';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/input';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const ClienteActividadesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [actividades, setActividades] = useState<Trazabilidad[]>([]);
  const [filteredActividades, setFilteredActividades] = useState<Trazabilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const navItems = [
    { label: "Dashboard", icon: <Activity className="w-5 h-5" />, href: "/dashboard/empresa" },
    { label: "Mi Equipo", icon: <Users className="w-5 h-5" />, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <Calendar className="w-5 h-5" />, href: "/dashboard/empresa/actividades" },
  ];

  useEffect(() => {
    fetchActividades();
  }, [user]);

  useEffect(() => {
    filterActividades();
  }, [searchTerm, filterEstado, actividades]);

  const fetchActividades = async () => {
    try {
      setLoading(true);

      const clienteUsuarioId = user?.id || '1';
      const data = await clienteService.getActividades(clienteUsuarioId);

      
      setActividades(data);
      setFilteredActividades(data); // ✅ Inicializar con todos los datos
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de actividades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterActividades = () => {
    let filtered = [...actividades]; // ✅ Crear copia del array

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(actividad =>
        actividad.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.tipo_actividad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.ejecutiva_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(actividad => actividad.resultado_contacto === filterEstado);
    }

    setFilteredActividades(filtered);
  };

  // ✅ GRÁFICO 1: Distribución de actividades por tipo
  const getDistribucionPorTipo = () => {
    const tipos = actividades.reduce((acc, actividad) => {
      const tipo = actividad.tipo_actividad || 'Otro';
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tipos).map(([tipo, cantidad]) => ({
      name: tipo,
      value: cantidad
    }));
  };

  // ✅ GRÁFICO 2: Evolución mensual de actividades
  const getEvolucionMensual = () => {
    const actividadesPorMes = actividades.reduce((acc, actividad) => {
      const fecha = new Date(actividad.fecha_actividad);
      const mes = fecha.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      
      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(actividadesPorMes)
      .map(([mes, cantidad]) => ({ mes, cantidad }))
      .slice(-6) // Últimos 6 meses
      .reverse(); // Orden cronológico
  };

  // ✅ GRÁFICO 3: Eficiencia por ejecutiva (nuevo)
  const getEficienciaPorEjecutiva = () => {
    const eficiencia = actividades.reduce((acc, actividad) => {
      const ejecutiva = actividad.ejecutiva_nombre || 'Sin asignar';
      if (!acc[ejecutiva]) {
        acc[ejecutiva] = { total: 0, completadas: 0 };
      }
      acc[ejecutiva].total++;
      if (actividad.resultado_contacto === 'completada') {
        acc[ejecutiva].completadas++;
      }
      return acc;
    }, {} as Record<string, { total: number; completadas: number }>);

    return Object.entries(eficiencia).map(([ejecutiva, datos]) => ({
      ejecutiva,
      eficiencia: datos.total > 0 ? Math.round((datos.completadas / datos.total) * 100) : 0,
      total: datos.total
    })).sort((a, b) => b.eficiencia - a.eficiencia);
  };

  const getEstadoBadge = (estado: string) => {
    const estadoLimpio = estado || 'pendiente';
    
    switch (estadoLimpio) {
      case 'completada':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Completada</Badge>;
      case 'en_proceso':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">En Proceso</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Pendiente</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-700 border-gray-500/30">{estadoLimpio}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    const tipoLimpio = tipo?.toLowerCase() || 'otro';
    
    switch (tipoLimpio) {
      case 'llamada telefónica':
      case 'llamada':
        return <Phone className="w-4 h-4 text-blue-400" />;
      case 'correo electrónico':
      case 'email':
        return <Mail className="w-4 h-4 text-green-400" />;
      case 'reunión virtual':
      case 'reunión presencial':
      case 'reunión':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'chat de whatsapp':
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDetallesCompletos = (actividad: Trazabilidad) => {
    return {
      title: `Detalles de ${actividad.tipo_actividad || 'Actividad'}`,
      content: `
        📅 Fecha: ${new Date(actividad.fecha_actividad).toLocaleString('es-ES')}
        👩‍💼 Ejecutiva: ${actividad.ejecutiva_nombre || 'No asignada'}
        🏢 Cliente: ${actividad.cliente_nombre || 'No especificado'}
        📝 Descripción: ${actividad.descripcion || 'Sin descripción'}
        🎯 Estado: ${actividad.resultado_contacto || 'pendiente'}
        ${actividad.informacion_importante ? `\n💡 Información importante: ${actividad.informacion_importante}` : ''}
        ${actividad.resultados_reunion ? `\n📊 Resultados: ${actividad.resultados_reunion}` : ''}
      `.trim()
    };
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Hora', 'Tipo', 'Descripción', 'Estado', 'Ejecutiva', 'Cliente'];
    const csvData = actividades.map(actividad => {
      const fecha = new Date(actividad.fecha_actividad);
      return [
        fecha.toLocaleDateString('es-ES'),
        fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        actividad.tipo_actividad,
        `"${actividad.descripcion?.replace(/"/g, '""') || ''}"`,
        actividad.resultado_contacto,
        actividad.ejecutiva_nombre,
        actividad.cliente_nombre
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `actividades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportado exitosamente",
      description: "El archivo CSV ha sido descargado",
    });
  };

  // Colores para los gráficos
  const COLORS = ['#C7E196', '#8CBD35', '#6F9E2B', '#A9D45E', '#B2C48A'];
  const COLORS_PIE = ['#C7E196', '#8CBD35', '#6F9E2B', '#A9D45E', '#B2C48A', '#024a46'];

  if (loading) {
    return (
      <DashboardLayout
        navItems={navItems}
        title="Mis Actividades"
        subtitle="Cargando historial..."
      >
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={navItems}
      title="Mis Actividades"
      subtitle="Historial completo de interacciones y seguimientos"
    >
      <div className="space-y-6">
        {/* Estadísticas Rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Actividades</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{actividades.length}</div>
              <p className="text-xs text-white/60 mt-1">Registros totales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Completadas</CardTitle>
              <Badge className="!bg-green-500/20 !text-green-300 border-green-500/30">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {actividades.filter(a => a.resultado_contacto === 'completada').length}
              </div>
              <p className="text-xs text-white/60 mt-1">Finalizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">En Proceso</CardTitle>
              <Badge className="!bg-blue-500/20 text-blue-300 border-blue-500/30">🔄</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {actividades.filter(a => a.resultado_contacto === 'en_proceso').length}
              </div>
              <p className="text-xs text-white/60 mt-1">Activas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Última Actividad</CardTitle>
              <Calendar className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                {actividades.length > 0
                  ? new Date(actividades[0].fecha_actividad).toLocaleDateString('es-ES')
                  : 'N/A'
                }
              </div>
              <p className="text-xs text-white/60 mt-1">Más reciente</p>
            </CardContent>
          </Card>
        </div>

        {/* ✅ NUEVOS GRÁFICOS VISUALES */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico 1: Distribución por tipo de actividad */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Distribución por Tipo
              </CardTitle>
              <CardDescription className="text-white/60">
                Tipos de actividades realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getDistribucionPorTipo()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getDistribucionPorTipo().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#024a46', 
                      border: '1px solid #C7E19640', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico 2: Evolución mensual */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Evolución Mensual
              </CardTitle>
              <CardDescription className="text-white/60">
                Tendencia de actividades en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getEvolucionMensual()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis 
                    dataKey="mes" 
                    stroke="#ffffff60" 
                    tick={{ fill: "#ffffff60", fontSize: 12 }} 
                  />
                  <YAxis 
                    stroke="#ffffff60" 
                    tick={{ fill: "#ffffff60" }} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#024a46", 
                      border: "1px solid #C7E19640", 
                      borderRadius: "8px",
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="cantidad" 
                    fill="#C7E196" 
                    name="Actividades"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Filtros y Búsqueda</CardTitle>
                <CardDescription className="text-white/60">
                  Encuentra actividades específicas en tu historial
                </CardDescription>
              </div>
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="!bg-[#C7E196] border-[#C7E196] text-[#013936] hover:bg-[#C7E196] hover:text-[#013936]"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Buscar en actividades, ejecutivas, clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                />
              </div>
             <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="
                bg-[#013936]                /* Fondo verde oscuro */
                text-[#C7E196]              /* Texto verde claro */
                border border-[#C7E196]/30  /* Borde sutil */
                rounded-lg
                px-3 py-2
                font-medium
                transition-all duration-200
                focus:outline-none
                focus:border-[#C7E196]
                focus:ring-2 focus:ring-[#C7E196]/40
                hover:border-[#C7E196]
                cursor-pointer
              "
            >
              <option value="todos" className="bg-[#013936] text-[#C7E196]">
                Todos los estados
              </option>
              <option value="completada" className="bg-[#013936] text-[#C7E196]">
                Completada
              </option>
              <option value="en_proceso" className="bg-[#013936] text-[#C7E196]">
                En Proceso
              </option>
              <option value="pendiente" className="bg-[#013936] text-[#C7E196]">
                Pendiente
              </option>
              <option value="cancelada" className="bg-[#013936] text-[#C7E196]">
                Cancelada
              </option>
            </select>

            </div>
          </CardContent>
        </Card>

        {/* Tabla de Actividades */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <CardTitle className="text-white">Historial de Actividades</CardTitle>
            <CardDescription className="text-white/60">
              {filteredActividades.length} de {actividades.length} actividades mostradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="font-semibold text-white">Fecha y Hora</TableHead>
                    <TableHead className="font-semibold text-white">Tipo</TableHead>
                    <TableHead className="font-semibold text-white">Descripción</TableHead>
                    <TableHead className="font-semibold text-white">Cliente</TableHead>
                    <TableHead className="font-semibold text-white">Estado</TableHead>
                    <TableHead className="font-semibold text-white">Ejecutiva</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredActividades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-white/60">
                        {searchTerm || filterEstado !== 'todos'
                          ? "No se encontraron actividades con los filtros aplicados"
                          : "No hay actividades registradas"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActividades.map((actividad) => (
                      <TableRow
                        key={actividad.id_trazabilidad}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="text-white/80 text-sm">
                          <div className="flex flex-col">
                            <span>{new Date(actividad.fecha_actividad).toLocaleDateString('es-ES')}</span>
                            <span className="text-white/60 text-xs">
                              {new Date(actividad.fecha_actividad).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-white/80">
                            {getTipoIcon(actividad.tipo_actividad)}
                            <span className="text-sm capitalize">
                              {actividad.tipo_actividad?.toLowerCase() || 'Actividad'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80 text-sm max-w-xs">
                          <span className="line-clamp-2">
                            {actividad.descripcion || 'Sin descripción'}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {actividad.cliente_nombre || 'No especificado'}
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(actividad.resultado_contacto)}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {actividad.ejecutiva_nombre || 'No asignada'}
                        </TableCell>
                        <TableCell>

                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClienteActividadesPage;