// import React from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card } from '@/components/ui/card';

// const ClienteActividadesPage: React.FC = () => {
//   const navItems = [
//     { label: "Mi Progreso", icon: <div>📊</div>, href: "/dashboard/empresa" },
//     { label: "Mi Ejecutiva", icon: <div>👤</div>, href: "/dashboard/empresa/ejecutiva" },
//     { label: "Actividades", icon: <div>📋</div>, href: "/dashboard/empresa/actividades" },
//   ];

//   return (
//     <DashboardLayout 
//       navItems={navItems} 
//       title="Mis Actividades" 
//       subtitle="Gestión y seguimiento de actividades"
//     >
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-8">
//         <div className="text-center">
//           <h3 className="text-xl font-semibold text-white mb-2">Página en Desarrollo</h3>
//           <p className="text-white/60">
//             Esta sección estará disponible próximamente para gestionar tus actividades.
//           </p>
//         </div>
//       </Card>
//     </DashboardLayout>
//   );
// };

// export default ClienteActividadesPage;

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
  Video
} from 'lucide-react';
import { clienteService, Trazabilidad } from '@/services/clienteService';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/input';

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
    { label: "Mi Ejecutiva", icon: <User className="w-5 h-5" />, href: "/dashboard/empresa/ejecutiva" },
    { label: "Actividades", icon: <Calendar className="w-5 h-5" />, href: "/dashboard/empresa/actividades" },
    { label: "Perfil", icon: <Users className="w-5 h-5" />, href: "/dashboard/empresa/perfil" },
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
      console.log('🔄 [ClienteActividadesPage] Cargando actividades...');

      const clienteUsuarioId = user?.id || '1';
      const data = await clienteService.getActividades(clienteUsuarioId);

      setActividades(data);
      console.log('✅ [ClienteActividadesPage] Actividades cargadas:', data.length);
    } catch (error) {
      console.error('❌ [ClienteActividadesPage] Error cargando actividades:', error);
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
    let filtered = actividades;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(actividad =>
        actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.tipo_actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actividad.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(actividad => actividad.estado === filterEstado);
    }

    setFilteredActividades(filtered);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completado</Badge>;
      case 'en_proceso':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">En Proceso</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendiente</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{estado}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'llamada telefónica':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'reunión virtual':
      case 'reunión presencial':
        return <Video className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Descripción', 'Estado', 'Ejecutiva'];
    const csvData = actividades.map(actividad => [
      new Date(actividad.fecha_actividad).toLocaleDateString('es-ES'),
      actividad.tipo_actividad,
      actividad.descripcion,
      actividad.estado,
      actividad.ejecutiva_nombre
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `actividades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportado",
      description: "El archivo CSV ha sido descargado",
    });
  };

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
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">✓</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {actividades.filter(a => a.estado === 'completado').length}
              </div>
              <p className="text-xs text-white/60 mt-1">Finalizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">En Proceso</CardTitle>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">🔄</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {actividades.filter(a => a.estado === 'en_proceso').length}
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
                className="border-[#C7E196] text-[#C7E196] hover:bg-[#C7E196] hover:text-[#013936]"
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
                  placeholder="Buscar en actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                />
              </div>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-[#C7E196] focus:outline-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completado</option>
                <option value="en_proceso">En Proceso</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
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
                    <TableHead className="font-semibold text-[#C7E196]">Fecha y Hora</TableHead>
                    <TableHead className="font-semibold text-[#C7E196]">Tipo</TableHead>
                    <TableHead className="font-semibold text-[#C7E196]">Descripción</TableHead>
                    <TableHead className="font-semibold text-[#C7E196]">Estado</TableHead>
                    <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
                    {/* ❌ ELIMINAR: <TableHead className="font-semibold text-[#C7E196]">Notas</TableHead> */}
                    <TableHead className="font-semibold text-[#C7E196]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredActividades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-white/60">
                        {searchTerm || filterEstado !== 'todos'
                          ? "No se encontraron actividades con los filtros aplicados"
                          : "No hay actividades registradas"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActividades.map((actividad) => (
                      // ✅ AGREGAR key única usando id_trazabilidad
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
                            <span className="text-sm">{actividad.tipo_actividad}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80 text-sm max-w-xs">
                          <span className="line-clamp-2">{actividad.descripcion}</span>
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(actividad.estado)}
                        </TableCell>
                        <TableCell className="text-white/80 text-sm">
                          {actividad.ejecutiva_nombre}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#C7E196] hover:text-white hover:bg-white/10"
                            onClick={() => {
                              toast({
                                title: "Detalles de actividad",
                                description: actividad.descripcion,
                              });
                            }}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClienteActividadesPage;