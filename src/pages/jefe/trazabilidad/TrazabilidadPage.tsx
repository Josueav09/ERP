//VERSION 1 CON BACKEND
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Users, Building2, UserCheck, Activity, LayoutDashboard, Filter, X, ChevronRight, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jefeService, Trazabilidad, Empresa, Ejecutiva, Cliente } from "@/services/jefeService";

const navItems = [
  { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
  { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
  { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
  { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
  { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
  { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
];

export default function TrazabilidadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [trazabilidad, setTrazabilidad] = useState<Trazabilidad[]>([]);
  const [filteredTrazabilidad, setFilteredTrazabilidad] = useState<Trazabilidad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter states
  const [empresaFilter, setEmpresaFilter] = useState<string>(searchParams.get("empresa") || "all");
  const [ejecutivaFilter, setEjecutivaFilter] = useState<string>(searchParams.get("ejecutiva") || "all");
  const [clienteFilter, setClienteFilter] = useState<string>(searchParams.get("cliente") || "all");

  // Options for filters
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // State for expanded activity detail
  const [selectedActivity, setSelectedActivity] = useState<Trazabilidad | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

useEffect(() => {
  console.log('📍 JefeDashboard - User context:', user);
  
  // ✅ SOLUCIÓN: Verificar tanto contexto como localStorage
  const storedUser = localStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  
  console.log('📍 JefeDashboard - Stored user:', storedUser);
  console.log('📍 JefeDashboard - Token:', token);
  
  // ✅ PERMITIR acceso si hay token, incluso si el contexto no se actualizó aún
  if (!user && !storedUser) {
    console.log('❌ JefeDashboard: Sin usuario en contexto ni storage, redirigiendo...');
    navigate("/login");
    return;
  }
  
  // ✅ Usar el usuario del contexto O del localStorage
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
  
  if (!currentUser) {
    console.log('❌ JefeDashboard: No se pudo obtener usuario, redirigiendo...');
    navigate("/login");
    return;
  }
  
  const allowedRoles = ["jefe", "Jefe", "Administrador"];
  if (!allowedRoles.includes(currentUser.role)) {
    console.log('❌ JefeDashboard: Rol no permitido:', currentUser.role);
    navigate("/login");
    return;
  }
  
  console.log('✅ JefeDashboard: Acceso permitido para:', currentUser.role);
  console.log('✅ JefeDashboard: Fuente del usuario:', user ? 'contexto' : 'localStorage');
    fetchFilterOptions();
    fetchTrazabilidad();
  }, [user, navigate]);

  useEffect(() => {
    fetchTrazabilidad();
  }, [empresaFilter, ejecutivaFilter, clienteFilter]);

  useEffect(() => {
    const filtered = trazabilidad.filter(
      (item) =>
        item.tipo_actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setFilteredTrazabilidad(filtered);
  }, [searchTerm, trazabilidad]);

  const fetchFilterOptions = async () => {
    try {
      const [empresasData, ejecutivasData, clientesData] = await Promise.all([
        jefeService.getEmpresas(),
        jefeService.getEjecutivas(),
        jefeService.getClientes()
      ]);

      setEmpresas(empresasData);
      setEjecutivas(ejecutivasData);
      setClientes(clientesData);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchTrazabilidad = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (empresaFilter !== "all") filters.empresa = empresaFilter;
      if (ejecutivaFilter !== "all") filters.ejecutiva = ejecutivaFilter;
      if (clienteFilter !== "all") filters.cliente = clienteFilter;

      const data = await jefeService.getTrazabilidad(filters);
      setTrazabilidad(data);
      setFilteredTrazabilidad(data);
    } catch (error) {
      console.error("Error fetching trazabilidad:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la trazabilidad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setEmpresaFilter("all");
    setEjecutivaFilter("all");
    setClienteFilter("all");
    navigate("/dashboard/jefe/trazabilidad");
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completado":
      case "venta ganada":
        return "bg-[#C7E196] text-[#013936]";
      case "en_proceso":
      case "negociación":
      case "presentación de propuesta":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "pendiente":
      case "prospección":
      case "calificación":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "cancelado":
      case "venta perdida":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  const getTipoActividadBadge = (tipo: string) => {
    const colores = {
      'Llamada': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'WhatsApp': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Email': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'LinkedIn': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'Reunión presencial': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Otro': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    return colores[tipo as keyof typeof colores] || 'bg-white/10 text-white/60';
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasActiveFilters = empresaFilter !== "all" || ejecutivaFilter !== "all" || clienteFilter !== "all";

  // Function to open detail dialog
  const openDetailDialog = (activity: Trazabilidad) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);
  };

  return (
    <DashboardLayout
      navItems={navItems}
      title="Trazabilidad de Actividades"
      subtitle="Monitorea todas las actividades del sistema"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Actividades</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{trazabilidad.length}</div>
              <p className="text-xs text-white/60 mt-1">Registradas en el sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Completadas</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {trazabilidad.filter((t) => t.estado === "completado").length}
              </div>
              <p className="text-xs text-white/60 mt-1">Actividades finalizadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">En Proceso</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {trazabilidad.filter((t) => t.estado === "en_proceso").length}
              </div>
              <p className="text-xs text-white/60 mt-1">Actividades activas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Pendientes</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {trazabilidad.filter((t) => t.estado === "pendiente").length}
              </div>
              <p className="text-xs text-white/60 mt-1">Por iniciar</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Filtros</CardTitle>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm text-white/80">Empresa</label>
                <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Todas las empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las empresas</SelectItem>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
                        {empresa.nombre_empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Ejecutiva</label>
                <Select value={ejecutivaFilter} onValueChange={setEjecutivaFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Todas las ejecutivas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ejecutivas</SelectItem>
                    {ejecutivas.map((ejecutiva) => (
                      <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
                        {ejecutiva.nombre} {ejecutiva.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/80">Cliente</label>
                <Select value={clienteFilter} onValueChange={setClienteFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                        {cliente.nombre_cliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Registro de Actividades</CardTitle>
                <CardDescription className="text-white/60">
                  {hasActiveFilters ? "Resultados filtrados" : "Todas las actividades del sistema"}
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Buscar actividad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="font-semibold text-[#C7E196]">Fecha</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Empresa</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Tipo</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Descripción</TableHead>
                      <TableHead className="text-center font-semibold text-[#C7E196]">Estado</TableHead>
                      <TableHead className="text-center font-semibold text-[#C7E196]">Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrazabilidad.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-white/60">
                          {searchTerm || hasActiveFilters
                            ? "No se encontraron actividades con los criterios seleccionados"
                            : "No hay actividades registradas"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTrazabilidad.map((item) => (
                        <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white/80 text-sm">{formatDate(item.fecha_actividad)}</TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
                                {item.ejecutiva_nombre.split(" ")[0]?.charAt(0)}
                                {item.ejecutiva_nombre.split(" ")[1]?.charAt(0)}
                              </div>
                              <span className="text-sm">{item.ejecutiva_nombre}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">{item.nombre_empresa}</TableCell>
                          <TableCell className="text-white/80 text-sm">{item.nombre_cliente || "N/A"}</TableCell>
                          <TableCell className="text-white/80 text-sm">
                            <Badge className={getTipoActividadBadge(item.tipo_actividad)}>
                              {item.tipo_actividad}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80 text-sm max-w-xs truncate">{item.descripcion}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getEstadoBadgeColor(item.estado)}>{item.estado.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailDialog(item)}
                              className="text-[#C7E196] hover:text-white hover:bg-white/10"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#C7E196] text-xl">Detalle de Actividad</DialogTitle>
            <DialogDescription className="text-white/60">
              Información completa de la actividad #{selectedActivity?.id_trazabilidad}
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Fecha de Actividad</label>
                  <p className="text-white/90">{formatDate(selectedActivity.fecha_actividad)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Estado</label>
                  <div>
                    <Badge className={getEstadoBadgeColor(selectedActivity.estado)}>
                      {selectedActivity.estado.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* People & Company Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Ejecutiva Responsable</label>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-sm font-semibold">
                      {selectedActivity.ejecutiva_nombre.split(" ")[0]?.charAt(0)}
                      {selectedActivity.ejecutiva_nombre.split(" ")[1]?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedActivity.ejecutiva_nombre}</p>
                      <p className="text-xs text-white/60">
                        {selectedActivity.ejecutiva_activa ? "Activa" : "Inactiva"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Empresa</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedActivity.nombre_empresa}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Cliente</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedActivity.nombre_cliente || "No asignado"}</p>
                  </div>
                </div>
              </div>

              {/* Activity Details */}
              <div className="space-y-4">
                {/* En el dialog de detalles */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Tipo de Contacto</label>
                  <div>
                    <Badge className={getTipoActividadBadge(selectedActivity.tipo_actividad)}>
                      {selectedActivity.tipo_actividad}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Resultado</label>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90">{selectedActivity.descripcion}</p>
                  </div>
                </div>

                {selectedActivity.notas && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#C7E196]">Notas Adicionales</label>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{selectedActivity.notas}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* IDs for reference */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid gap-2 md:grid-cols-4 text-xs">
                  <div>
                    <span className="text-white/60">ID Actividad:</span>
                    <p className="text-white/90 font-mono">{selectedActivity.id_trazabilidad}</p>
                  </div>
                  <div>
                    <span className="text-white/60">ID Ejecutiva:</span>
                    <p className="text-white/90 font-mono">{selectedActivity.id_ejecutiva}</p>
                  </div>
                  <div>
                    <span className="text-white/60">ID Empresa:</span>
                    <p className="text-white/90 font-mono">{selectedActivity.id_empresa}</p>
                  </div>
                  <div>
                    <span className="text-white/60">ID Cliente:</span>
                    <p className="text-white/90 font-mono">{selectedActivity.id_cliente || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
// VERSION 2 SIN BACKEND
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Search, Users, Building2, UserCheck, Activity, Filter, X, ChevronRight, TrendingUp, Target, Award, Zap, LayoutDashboard, FileText, User } from "lucide-react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";

// // Simulación de servicios - Reemplazar con tus servicios reales
// const mockJefeService = {
//   getTrazabilidad: async (filters: any) => {
//     // Aquí iría tu llamada real al backend
//     return [];
//   },
//   getEmpresas: async () => [],
//   getEjecutivas: async () => [],
//   getClientes: async () => [],
//   getEstadisticasGenerales: async () => ({
//     totalActividades: 0,
//     actividadesCompletadas: 0,
//     actividadesEnProceso: 0,
//     actividadesPendientes: 0,
//   }),
//   getTopEjecutivas: async () => [],
//   getTopEmpresas: async () => [],
//   getTopClientes: async () => [],
//   getActividadesPorTipo: async () => [],
// };

// export default function TrazabilidadDashboardReal() {
//   const [trazabilidad, setTrazabilidad] = useState<any[]>([]);
//   const [filteredTrazabilidad, setFilteredTrazabilidad] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Filter states
//   const [empresaFilter, setEmpresaFilter] = useState<string>("all");
//   const [ejecutivaFilter, setEjecutivaFilter] = useState<string>("all");
//   const [clienteFilter, setClienteFilter] = useState<string>("all");
//   const [fechaDesde, setFechaDesde] = useState<string>("");
//   const [fechaHasta, setFechaHasta] = useState<string>("");
//   const [tipoActividadFilter, setTipoActividadFilter] = useState<string>("all");

//   // Options for filters
//   const [empresas, setEmpresas] = useState<any[]>([]);
//   const [ejecutivas, setEjecutivas] = useState<any[]>([]);
//   const [clientes, setClientes] = useState<any[]>([]);

//   // Dashboard stats
//   const [stats, setStats] = useState<any>({});
//   const [topEjecutivas, setTopEjecutivas] = useState<any[]>([]);
//   const [topEmpresas, setTopEmpresas] = useState<any[]>([]);
//   const [topClientes, setTopClientes] = useState<any[]>([]);
//   const [actividadesPorTipo, setActividadesPorTipo] = useState<any[]>([]);

//   // State for expanded activity detail
//   const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   useEffect(() => {
//     fetchTrazabilidad();
//   }, [empresaFilter, ejecutivaFilter, clienteFilter, fechaDesde, fechaHasta, tipoActividadFilter]);

//   useEffect(() => {
//     const filtered = trazabilidad.filter(
//       (item) =>
//         item.tipo_actividad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.ejecutiva_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.nombre_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())),
//     );
//     setFilteredTrazabilidad(filtered);
//   }, [searchTerm, trazabilidad]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const [empresasData, ejecutivasData, clientesData, statsData, topEjec, topEmp, topCli, actTipo] = await Promise.all([
//         mockJefeService.getEmpresas(),
//         mockJefeService.getEjecutivas(),
//         mockJefeService.getClientes(),
//         mockJefeService.getEstadisticasGenerales(),
//         mockJefeService.getTopEjecutivas(),
//         mockJefeService.getTopEmpresas(),
//         mockJefeService.getTopClientes(),
//         mockJefeService.getActividadesPorTipo(),
//       ]);

//       setEmpresas(empresasData);
//       setEjecutivas(ejecutivasData);
//       setClientes(clientesData);
//       setStats(statsData);
//       setTopEjecutivas(topEjec);
//       setTopEmpresas(topEmp);
//       setTopClientes(topCli);
//       setActividadesPorTipo(actTipo);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const navItems = [
//     { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
//     { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
//     { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
//     { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
//     { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
//     { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
//     { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
//   ];
//   const fetchTrazabilidad = async () => {
//     try {
//       const filters: any = {};
//       if (empresaFilter !== "all") filters.empresa = empresaFilter;
//       if (ejecutivaFilter !== "all") filters.ejecutiva = ejecutivaFilter;
//       if (clienteFilter !== "all") filters.cliente = clienteFilter;
//       if (fechaDesde) filters.fechaDesde = fechaDesde;
//       if (fechaHasta) filters.fechaHasta = fechaHasta;
//       if (tipoActividadFilter !== "all") filters.tipoActividad = tipoActividadFilter;

//       const data = await mockJefeService.getTrazabilidad(filters);
//       setTrazabilidad(data);
//       setFilteredTrazabilidad(data);
//     } catch (error) {
//       console.error("Error fetching trazabilidad:", error);
//     }
//   };

//   const clearFilters = () => {
//     setEmpresaFilter("all");
//     setEjecutivaFilter("all");
//     setClienteFilter("all");
//     setFechaDesde("");
//     setFechaHasta("");
//     setTipoActividadFilter("all");
//   };

//   const getEstadoBadgeColor = (estado: string) => {
//     switch (estado?.toLowerCase()) {
//       case "completado":
//       case "venta ganada":
//         return "bg-[#C7E196] text-[#013936]";
//       case "en_proceso":
//       case "negociación":
//         return "bg-blue-500/20 text-blue-300 border-blue-500/30";
//       case "pendiente":
//       case "prospección":
//         return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
//       case "cancelado":
//       case "venta perdida":
//         return "bg-red-500/20 text-red-300 border-red-500/30";
//       default:
//         return "bg-white/10 text-white/60";
//     }
//   };

//   const getTipoActividadBadge = (tipo: string) => {
//     const colores: Record<string, string> = {
//       'Llamada': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
//       'WhatsApp': 'bg-green-500/20 text-green-300 border-green-500/30',
//       'Email': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
//       'LinkedIn': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
//       'Reunión presencial': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
//       'Otro': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
//     };
//     return colores[tipo] || 'bg-white/10 text-white/60';
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("es-ES", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const hasActiveFilters = empresaFilter !== "all" || ejecutivaFilter !== "all" || clienteFilter !== "all" || fechaDesde || fechaHasta || tipoActividadFilter !== "all";

//   const openDetailDialog = (activity: any) => {
//     setSelectedActivity(activity);
//     setDetailDialogOpen(true);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#013936] to-[#024a46] flex items-center justify-center">
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout
//       navItems={navItems}
//       title="Trazabilidad de Actividades"
//       subtitle="Monitorea todas las actividades del sistema"
//     >

//       <div className="min-h-screen bg-gradient-to-br from-[#013936] to-[#024a46] p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Dashboard de Trazabilidad</h1>
//             <p className="text-white/60 mt-1">Análisis completo de actividades comerciales</p>
//           </div>
//           <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#b8d287]">
//             <TrendingUp className="w-4 h-4 mr-2" />
//             Exportar Reporte
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-4">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Total Actividades</CardTitle>
//               <Activity className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.totalActividades || 0}</div>
//               <p className="text-xs text-white/60 mt-1">Registradas en el sistema</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Completadas</CardTitle>
//               <Target className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.actividadesCompletadas || 0}</div>
//               <p className="text-xs text-white/60 mt-1">Actividades finalizadas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">En Proceso</CardTitle>
//               <Zap className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.actividadesEnProceso || 0}</div>
//               <p className="text-xs text-white/60 mt-1">Actividades activas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Pendientes</CardTitle>
//               <Activity className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.actividadesPendientes || 0}</div>
//               <p className="text-xs text-white/60 mt-1">Por iniciar</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Top Performance Cards */}
//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Top Ejecutivas */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Award className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Ejecutivas</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Por número de clientes</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {topEjecutivas.length === 0 ? (
//                   <p className="text-white/60 text-sm text-center py-4">No hay datos disponibles</p>
//                 ) : (
//                   topEjecutivas.slice(0, 5).map((ejecutiva, index) => (
//                     <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
//                           #{index + 1}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-white">{ejecutiva.nombre}</p>
//                           <p className="text-xs text-white/60">{ejecutiva.clientes} clientes</p>
//                         </div>
//                       </div>
//                       <Badge className="bg-[#C7E196] text-[#013936]">{ejecutiva.actividades}</Badge>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Top Empresas */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Building2 className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Empresas</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Más activas en el sistema</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {topEmpresas.length === 0 ? (
//                   <p className="text-white/60 text-sm text-center py-4">No hay datos disponibles</p>
//                 ) : (
//                   topEmpresas.slice(0, 5).map((empresa, index) => (
//                     <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
//                       <div>
//                         <p className="text-sm font-medium text-white">{empresa.nombre}</p>
//                         <p className="text-xs text-white/60">{empresa.actividades} actividades</p>
//                       </div>
//                       <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
//                         {empresa.ejecutivas} ejecutivas
//                       </Badge>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Top Clientes */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Clientes</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Mayor volumen de gestiones</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {topClientes.length === 0 ? (
//                   <p className="text-white/60 text-sm text-center py-4">No hay datos disponibles</p>
//                 ) : (
//                   topClientes.slice(0, 5).map((cliente, index) => (
//                     <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
//                       <div>
//                         <p className="text-sm font-medium text-white">{cliente.nombre}</p>
//                         <p className="text-xs text-white/60">{cliente.gestiones} gestiones</p>
//                       </div>
//                       <Badge className={getEstadoBadgeColor(cliente.estado)}>
//                         {cliente.estado}
//                       </Badge>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters Card */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Filtros Avanzados</CardTitle>
//               </div>
//               {hasActiveFilters && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="text-white/80 hover:text-white hover:bg-white/10"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Limpiar Filtros
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Empresa</label>
//                 <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Todas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas</SelectItem>
//                     {empresas.map((empresa: any) => (
//                       <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
//                         {empresa.nombre_empresa}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Ejecutiva</label>
//                 <Select value={ejecutivaFilter} onValueChange={setEjecutivaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Todas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas</SelectItem>
//                     {ejecutivas.map((ejecutiva: any) => (
//                       <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
//                         {ejecutiva.nombre}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Cliente</label>
//                 <Select value={clienteFilter} onValueChange={setClienteFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Todos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos</SelectItem>
//                     {clientes.map((cliente: any) => (
//                       <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
//                         {cliente.nombre_cliente}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Tipo Actividad</label>
//                 <Select value={tipoActividadFilter} onValueChange={setTipoActividadFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Todos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos</SelectItem>
//                     <SelectItem value="Llamada">Llamada</SelectItem>
//                     <SelectItem value="WhatsApp">WhatsApp</SelectItem>
//                     <SelectItem value="Email">Email</SelectItem>
//                     <SelectItem value="LinkedIn">LinkedIn</SelectItem>
//                     <SelectItem value="Reunión presencial">Reunión presencial</SelectItem>
//                     <SelectItem value="Otro">Otro</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Fecha Desde</label>
//                 <Input
//                   type="date"
//                   value={fechaDesde}
//                   onChange={(e) => setFechaDesde(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80">Fecha Hasta</label>
//                 <Input
//                   type="date"
//                   value={fechaHasta}
//                   onChange={(e) => setFechaHasta(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Table Card */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="text-white">Registro de Actividades</CardTitle>
//                 <CardDescription className="text-white/60">
//                   {filteredTrazabilidad.length} actividades {hasActiveFilters && "filtradas"}
//                 </CardDescription>
//               </div>
//               <div className="relative w-full md:w-72">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                 <Input
//                   placeholder="Buscar actividad..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border border-white/10 overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-white/10 hover:bg-transparent">
//                     <TableHead className="font-semibold text-[#C7E196]">Fecha</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Empresa</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Tipo</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Descripción</TableHead>
//                     <TableHead className="text-center font-semibold text-[#C7E196]">Estado</TableHead>
//                     <TableHead className="text-center font-semibold text-[#C7E196]">Detalles</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredTrazabilidad.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={8} className="text-center py-8 text-white/60">
//                         No se encontraron actividades
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredTrazabilidad.map((item: any) => (
//                       <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5">
//                         <TableCell className="text-white/80 text-sm">{formatDate(item.fecha_actividad)}</TableCell>
//                         <TableCell className="text-white">
//                           <div className="flex items-center gap-2">
//                             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
//                               {item.ejecutiva_nombre?.split(" ")[0]?.charAt(0)}
//                               {item.ejecutiva_nombre?.split(" ")[1]?.charAt(0)}
//                             </div>
//                             <span className="text-sm">{item.ejecutiva_nombre}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-white/80 text-sm">{item.nombre_empresa}</TableCell>
//                         <TableCell className="text-white/80 text-sm">{item.nombre_cliente || "N/A"}</TableCell>
//                         <TableCell>
//                           <Badge className={getTipoActividadBadge(item.tipo_actividad)}>
//                             {item.tipo_actividad}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80 text-sm max-w-xs truncate">{item.descripcion}</TableCell>
//                         <TableCell className="text-center">
//                           <Badge className={getEstadoBadgeColor(item.estado)}>{item.estado}</Badge>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => openDetailDialog(item)}
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Detail Dialog */}
//         <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//           <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-[#C7E196] text-xl">Detalle de Actividad</DialogTitle>
//               <DialogDescription className="text-white/60">
//                 Información completa de la actividad #{selectedActivity?.id_trazabilidad}
//               </DialogDescription>
//             </DialogHeader>

//             {selectedActivity && (
//               <div className="space-y-6 mt-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Fecha de Actividad</label>
//                     <p className="text-white/90">{formatDate(selectedActivity.fecha_actividad)}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Estado</label>
//                     <Badge className={getEstadoBadgeColor(selectedActivity.estado)}>
//                       {selectedActivity.estado}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Ejecutiva Responsable</label>
//                     <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-sm font-semibold">
//                         {selectedActivity.ejecutiva_nombre?.split(" ")[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-white font-medium">{selectedActivity.ejecutiva_nombre}</p>
//                         <p className="text-xs text-white/60">Ejecutiva comercial</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Empresa</label>
//                     <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                       <p className="text-white/90">{selectedActivity.nombre_empresa}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Cliente</label>
//                     <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                       <p className="text-white/90">{selectedActivity.nombre_cliente || "No asignado"}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Tipo de Contacto</label>
//                     <Badge className={getTipoActividadBadge(selectedActivity.tipo_actividad)}>
//                       {selectedActivity.tipo_actividad}
//                     </Badge>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Descripción</label>
//                     <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                       <p className="text-white/90">{selectedActivity.descripcion}</p>
//                     </div>
//                   </div>

//                   {selectedActivity.notas && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-[#C7E196]">Notas Adicionales</label>
//                       <div className="p-4 bg-white/5 rounded-lg border border-white/10">
//                         <p className="text-white/90 whitespace-pre-wrap">{selectedActivity.notas}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </DashboardLayout>
//   );
// }
//VERSION 3 CON MOCK DATA 

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Search, Users, Building2, UserCheck, Activity, Filter, X, ChevronRight, TrendingUp, Target, Award, Zap, Phone, Mail, MessageSquare, Linkedin, Calendar, DollarSign, LayoutDashboard, FileText, User } from "lucide-react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";

// const navItems = [
//   { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
//   { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
//   { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
//   { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
//   { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
//   { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
//   { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
// ];
// // ========== DATOS MOCK ==========
// const mockEmpresas = [
//   { id_empresa: 1, nombre_empresa: "Ron Cartavio S.A." },
//   { id_empresa: 2, nombre_empresa: "Alicorp S.A.A." },
//   { id_empresa: 3, nombre_empresa: "Backus & Johnston" },
//   { id_empresa: 4, nombre_empresa: "Gloria S.A." },
//   { id_empresa: 5, nombre_empresa: "San Fernando" },
// ];

// const mockEjecutivas = [
//   { id_usuario: 1, nombre: "María Fernández", apellido: "Rojas" },
//   { id_usuario: 2, nombre: "Carmen López", apellido: "Torres" },
//   { id_usuario: 3, nombre: "Sandra Pérez", apellido: "Gómez" },
//   { id_usuario: 4, nombre: "Lucía Martínez", apellido: "Silva" },
//   { id_usuario: 5, nombre: "Patricia Rodríguez", apellido: "Castro" },
// ];

// const mockClientes = [
//   { id_cliente: 1, nombre_cliente: "Banco de Crédito BCP" },
//   { id_cliente: 2, nombre_cliente: "Interbank" },
//   { id_cliente: 3, nombre_cliente: "BBVA Continental" },
//   { id_cliente: 4, nombre_cliente: "Scotiabank Perú" },
//   { id_cliente: 5, nombre_cliente: "Banco Pichincha" },
//   { id_cliente: 6, nombre_cliente: "Caja Arequipa" },
//   { id_cliente: 7, nombre_cliente: "Mibanco" },
//   { id_cliente: 8, nombre_cliente: "Falabella Perú" },
//   { id_cliente: 9, nombre_cliente: "Ripley Corp" },
//   { id_cliente: 10, nombre_cliente: "Sodimac Perú" },
// ];

// const mockStats = {
//   totalActividades: 347,
//   actividadesCompletadas: 156,
//   actividadesEnProceso: 128,
//   actividadesPendientes: 63,
// };

// const mockTopEjecutivas = [
//   { nombre: "María Fernández Rojas", clientes: 28, actividades: 94, conversion: "32%" },
//   { nombre: "Carmen López Torres", clientes: 24, actividades: 87, conversion: "28%" },
//   { nombre: "Sandra Pérez Gómez", clientes: 21, actividades: 76, conversion: "25%" },
//   { nombre: "Lucía Martínez Silva", clientes: 18, actividades: 58, conversion: "22%" },
//   { nombre: "Patricia Rodríguez Castro", clientes: 15, actividades: 32, conversion: "18%" },
// ];

// const mockTopEmpresas = [
//   { nombre: "Ron Cartavio S.A.", actividades: 89, ejecutivas: 3, revenue: "$285,000" },
//   { nombre: "Alicorp S.A.A.", actividades: 76, ejecutivas: 2, revenue: "$198,000" },
//   { nombre: "Backus & Johnston", actividades: 62, ejecutivas: 2, revenue: "$165,000" },
//   { nombre: "Gloria S.A.", actividades: 58, ejecutivas: 1, revenue: "$142,000" },
//   { nombre: "San Fernando", actividades: 42, ejecutivas: 1, revenue: "$98,000" },
// ];

// const mockTopClientes = [
//   { nombre: "Banco de Crédito BCP", gestiones: 45, estado: "Venta ganada", etapa: "Firma de contrato" },
//   { nombre: "Interbank", gestiones: 38, estado: "Negociación", etapa: "Presentación de propuesta" },
//   { nombre: "BBVA Continental", gestiones: 32, estado: "En Proceso", etapa: "Presentación de solución" },
//   { nombre: "Scotiabank Perú", gestiones: 28, estado: "Calificación", etapa: "Detección de necesidades" },
//   { nombre: "Falabella Perú", gestiones: 24, estado: "Prospección", etapa: "Prospección" },
// ];

// const mockActividadesPorTipo = [
//   { tipo: "Llamada", cantidad: 128, porcentaje: 37 },
//   { tipo: "WhatsApp", cantidad: 95, porcentaje: 27 },
//   { tipo: "Email", cantidad: 67, porcentaje: 19 },
//   { tipo: "LinkedIn", cantidad: 34, porcentaje: 10 },
//   { tipo: "Reunión presencial", cantidad: 23, porcentaje: 7 },
// ];

// const mockTrazabilidad = [
//   {
//     id_trazabilidad: 1,
//     fecha_actividad: "2025-10-17T10:30:00",
//     ejecutiva_nombre: "María Fernández Rojas",
//     nombre_empresa: "Ron Cartavio S.A.",
//     nombre_cliente: "Banco de Crédito BCP",
//     tipo_actividad: "Llamada",
//     descripcion: "Seguimiento a propuesta comercial presentada la semana pasada",
//     estado: "completado",
//     etapa_oportunidad: "Negociación",
//     monto_estimado: "$45,000",
//     notas: "Cliente interesado en expandir el contrato. Solicitan ajustes en pricing para volumen mayor.",
//   },
//   {
//     id_trazabilidad: 2,
//     fecha_actividad: "2025-10-17T09:15:00",
//     ejecutiva_nombre: "Carmen López Torres",
//     nombre_empresa: "Alicorp S.A.A.",
//     nombre_cliente: "Interbank",
//     tipo_actividad: "WhatsApp",
//     descripcion: "Coordinación de reunión presencial con gerente de compras",
//     estado: "en_proceso",
//     etapa_oportunidad: "Presentación de propuesta",
//     monto_estimado: "$32,000",
//     notas: "Reunión agendada para el viernes 19 de octubre a las 3:00 PM.",
//   },
//   {
//     id_trazabilidad: 3,
//     fecha_actividad: "2025-10-16T16:45:00",
//     ejecutiva_nombre: "Sandra Pérez Gómez",
//     nombre_empresa: "Backus & Johnston",
//     nombre_cliente: "BBVA Continental",
//     tipo_actividad: "Email",
//     descripcion: "Envío de cotización actualizada según requerimientos específicos",
//     estado: "completado",
//     etapa_oportunidad: "Presentación de solución",
//     monto_estimado: "$28,500",
//     notas: "Cotización enviada con descuento del 8% por volumen. Esperando respuesta.",
//   },
//   {
//     id_trazabilidad: 4,
//     fecha_actividad: "2025-10-16T14:20:00",
//     ejecutiva_nombre: "Lucía Martínez Silva",
//     nombre_empresa: "Gloria S.A.",
//     nombre_cliente: "Scotiabank Perú",
//     tipo_actividad: "Reunión presencial",
//     descripcion: "Primera reunión de presentación de servicios y capacidades",
//     estado: "completado",
//     etapa_oportunidad: "Detección de necesidades",
//     monto_estimado: "$52,000",
//     notas: "Reunión muy positiva. Cliente mostró interés en 3 líneas de producto. Agendar follow-up.",
//   },
//   {
//     id_trazabilidad: 5,
//     fecha_actividad: "2025-10-16T11:00:00",
//     ejecutiva_nombre: "Patricia Rodríguez Castro",
//     nombre_empresa: "San Fernando",
//     nombre_cliente: "Banco Pichincha",
//     tipo_actividad: "LinkedIn",
//     descripcion: "Contacto inicial con director de operaciones",
//     estado: "pendiente",
//     etapa_oportunidad: "Prospección",
//     monto_estimado: "$18,000",
//     notas: "Mensaje enviado por LinkedIn. Esperando respuesta para agendar call exploratorio.",
//   },
//   {
//     id_trazabilidad: 6,
//     fecha_actividad: "2025-10-15T15:30:00",
//     ejecutiva_nombre: "María Fernández Rojas",
//     nombre_empresa: "Ron Cartavio S.A.",
//     nombre_cliente: "Caja Arequipa",
//     tipo_actividad: "Llamada",
//     descripcion: "Llamada de seguimiento post-presentación",
//     estado: "completado",
//     etapa_oportunidad: "Manejo de objeciones",
//     monto_estimado: "$22,000",
//     notas: "Cliente tiene objeciones sobre tiempos de entrega. Coordinando con logística.",
//   },
//   {
//     id_trazabilidad: 7,
//     fecha_actividad: "2025-10-15T10:45:00",
//     ejecutiva_nombre: "Carmen López Torres",
//     nombre_empresa: "Alicorp S.A.A.",
//     nombre_cliente: "Mibanco",
//     tipo_actividad: "WhatsApp",
//     descripcion: "Envío de documentación contractual para revisión legal",
//     estado: "en_proceso",
//     etapa_oportunidad: "Firma de contrato",
//     monto_estimado: "$67,000",
//     notas: "Documentos enviados. Cliente en proceso de revisión legal (5-7 días hábiles).",
//   },
//   {
//     id_trazabilidad: 8,
//     fecha_actividad: "2025-10-14T13:15:00",
//     ejecutiva_nombre: "Sandra Pérez Gómez",
//     nombre_empresa: "Backus & Johnston",
//     nombre_cliente: "Falabella Perú",
//     tipo_actividad: "Email",
//     descripcion: "Primera toma de contacto con gerente comercial",
//     estado: "completado",
//     etapa_oportunidad: "Calificación",
//     monto_estimado: "$41,000",
//     notas: "Cliente calificado. Budget disponible para Q4. Agendar presentación formal.",
//   },
//   {
//     id_trazabilidad: 9,
//     fecha_actividad: "2025-10-14T09:30:00",
//     ejecutiva_nombre: "Lucía Martínez Silva",
//     nombre_empresa: "Gloria S.A.",
//     nombre_cliente: "Ripley Corp",
//     tipo_actividad: "Reunión presencial",
//     descripcion: "Presentación de propuesta comercial ante comité de compras",
//     estado: "completado",
//     etapa_oportunidad: "Presentación de propuesta",
//     monto_estimado: "$58,000",
//     notas: "Presentación ante 5 stakeholders. Feedback positivo. Decisión en 2 semanas.",
//   },
//   {
//     id_trazabilidad: 10,
//     fecha_actividad: "2025-10-13T16:00:00",
//     ejecutiva_nombre: "Patricia Rodríguez Castro",
//     nombre_empresa: "San Fernando",
//     nombre_cliente: "Sodimac Perú",
//     tipo_actividad: "Llamada",
//     descripcion: "Call de seguimiento semanal - actualización de proyecto",
//     estado: "completado",
//     etapa_oportunidad: "Negociación",
//     monto_estimado: "$35,000",
//     notas: "Cliente solicitó extensión de plazo de pago a 60 días. Evaluando internamente.",
//   },
// ];

// export default function TrazabilidadDashboardMock() {
//   const [trazabilidad, setTrazabilidad] = useState(mockTrazabilidad);
//   const [filteredTrazabilidad, setFilteredTrazabilidad] = useState(mockTrazabilidad);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Filter states
//   const [empresaFilter, setEmpresaFilter] = useState<string>("all");
//   const [ejecutivaFilter, setEjecutivaFilter] = useState<string>("all");
//   const [clienteFilter, setClienteFilter] = useState<string>("all");
//   const [fechaDesde, setFechaDesde] = useState<string>("");
//   const [fechaHasta, setFechaHasta] = useState<string>("");
//   const [tipoActividadFilter, setTipoActividadFilter] = useState<string>("all");

//   // State for expanded activity detail
//   const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);

//   useEffect(() => {
//     applyFilters();
//   }, [empresaFilter, ejecutivaFilter, clienteFilter, fechaDesde, fechaHasta, tipoActividadFilter, searchTerm]);

//   const applyFilters = () => {
//     let filtered = [...mockTrazabilidad];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (item) =>
//           item.tipo_actividad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.ejecutiva_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.nombre_empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (empresaFilter !== "all") {
//       const empresa = mockEmpresas.find(e => e.id_empresa.toString() === empresaFilter);
//       filtered = filtered.filter(item => item.nombre_empresa === empresa?.nombre_empresa);
//     }

//     if (ejecutivaFilter !== "all") {
//       const ejecutiva = mockEjecutivas.find(e => e.id_usuario.toString() === ejecutivaFilter);
//       filtered = filtered.filter(item => item.ejecutiva_nombre.includes(ejecutiva?.nombre || ""));
//     }

//     if (clienteFilter !== "all") {
//       const cliente = mockClientes.find(c => c.id_cliente.toString() === clienteFilter);
//       filtered = filtered.filter(item => item.nombre_cliente === cliente?.nombre_cliente);
//     }

//     if (tipoActividadFilter !== "all") {
//       filtered = filtered.filter(item => item.tipo_actividad === tipoActividadFilter);
//     }

//     setFilteredTrazabilidad(filtered);
//   };

//   const clearFilters = () => {
//     setEmpresaFilter("all");
//     setEjecutivaFilter("all");
//     setClienteFilter("all");
//     setFechaDesde("");
//     setFechaHasta("");
//     setTipoActividadFilter("all");
//     setSearchTerm("");
//   };

//   const getEstadoBadgeColor = (estado: string) => {
//     switch (estado?.toLowerCase()) {
//       case "completado":
//       case "venta ganada":
//         return "bg-[#C7E196] text-[#013936]";
//       case "en_proceso":
//       case "negociación":
//         return "bg-blue-500/20 text-blue-300 border-blue-500/30";
//       case "pendiente":
//       case "prospección":
//         return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
//       case "cancelado":
//       case "venta perdida":
//         return "bg-red-500/20 text-red-300 border-red-500/30";
//       default:
//         return "bg-white/10 text-white/60";
//     }
//   };

//   const getTipoActividadBadge = (tipo: string) => {
//     const colores: Record<string, string> = {
//       'Llamada': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
//       'WhatsApp': 'bg-green-500/20 text-green-300 border-green-500/30',
//       'Email': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
//       'LinkedIn': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
//       'Reunión presencial': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
//       'Otro': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
//     };
//     return colores[tipo] || 'bg-white/10 text-white/60';
//   };

//   const getTipoActividadIcon = (tipo: string) => {
//     switch (tipo) {
//       case 'Llamada': return <Phone className="w-3 h-3" />;
//       case 'WhatsApp': return <MessageSquare className="w-3 h-3" />;
//       case 'Email': return <Mail className="w-3 h-3" />;
//       case 'LinkedIn': return <Linkedin className="w-3 h-3" />;
//       case 'Reunión presencial': return <Users className="w-3 h-3" />;
//       default: return <Activity className="w-3 h-3" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("es-ES", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const hasActiveFilters = empresaFilter !== "all" || ejecutivaFilter !== "all" || clienteFilter !== "all" || fechaDesde || fechaHasta || tipoActividadFilter !== "all" || searchTerm;

//   const openDetailDialog = (activity: any) => {
//     setSelectedActivity(activity);
//     setDetailDialogOpen(true);
//   };

//   return (
//     <DashboardLayout
//       navItems={navItems}
//       title="Trazabilidad de Actividades"
//       subtitle="Monitorea todas las actividades del sistema"
//     >
//       <div className="min-h-screen bg-gradient-to-br from-[#013936] to-[#024a46] p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Dashboard de Trazabilidad</h1>
//             <p className="text-white/60 mt-1">Análisis completo de actividades comerciales • Growvia ERP</p>
//           </div>
//           <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#b8d287] font-semibold">
//             <TrendingUp className="w-4 h-4 mr-2" />
//             Exportar Reporte
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-4">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 hover:border-[#C7E196]/40 transition-all">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Total Actividades</CardTitle>
//               <Activity className="h-5 w-5 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-white">{mockStats.totalActividades}</div>
//               <p className="text-xs text-white/60 mt-1">Registradas en el sistema</p>
//               <div className="mt-2 flex items-center gap-1 text-xs text-[#C7E196]">
//                 <TrendingUp className="w-3 h-3" />
//                 <span>+12% vs mes anterior</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 hover:border-[#C7E196]/40 transition-all">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Completadas</CardTitle>
//               <Target className="h-5 w-5 text-green-400" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-white">{mockStats.actividadesCompletadas}</div>
//               <p className="text-xs text-white/60 mt-1">
//                 {((mockStats.actividadesCompletadas / mockStats.totalActividades) * 100).toFixed(1)}% del total
//               </p>
//               <div className="mt-2 w-full bg-white/10 rounded-full h-2">
//                 <div
//                   className="bg-green-400 h-2 rounded-full transition-all"
//                   style={{ width: `${(mockStats.actividadesCompletadas / mockStats.totalActividades) * 100}%` }}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 hover:border-[#C7E196]/40 transition-all">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">En Proceso</CardTitle>
//               <Zap className="h-5 w-5 text-blue-400" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-white">{mockStats.actividadesEnProceso}</div>
//               <p className="text-xs text-white/60 mt-1">
//                 {((mockStats.actividadesEnProceso / mockStats.totalActividades) * 100).toFixed(1)}% activas
//               </p>
//               <div className="mt-2 w-full bg-white/10 rounded-full h-2">
//                 <div
//                   className="bg-blue-400 h-2 rounded-full transition-all"
//                   style={{ width: `${(mockStats.actividadesEnProceso / mockStats.totalActividades) * 100}%` }}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 hover:border-[#C7E196]/40 transition-all">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Pendientes</CardTitle>
//               <Calendar className="h-5 w-5 text-yellow-400" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold text-white">{mockStats.actividadesPendientes}</div>
//               <p className="text-xs text-white/60 mt-1">
//                 {((mockStats.actividadesPendientes / mockStats.totalActividades) * 100).toFixed(1)}% por iniciar
//               </p>
//               <div className="mt-2 w-full bg-white/10 rounded-full h-2">
//                 <div
//                   className="bg-yellow-400 h-2 rounded-full transition-all"
//                   style={{ width: `${(mockStats.actividadesPendientes / mockStats.totalActividades) * 100}%` }}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Top Performance Cards */}
//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Top Ejecutivas */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Award className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Ejecutivas</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Por número de clientes gestionados</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {mockTopEjecutivas.map((ejecutiva, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
//                     <div className="flex items-center gap-3">
//                       <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? 'bg-yellow-400 text-[#013936]' :
//                           index === 1 ? 'bg-gray-300 text-[#013936]' :
//                             index === 2 ? 'bg-orange-400 text-[#013936]' :
//                               'bg-[#C7E196] text-[#013936]'
//                         }`}>
//                         #{index + 1}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-white">{ejecutiva.nombre}</p>
//                         <p className="text-xs text-white/60">{ejecutiva.clientes} clientes • {ejecutiva.conversion} conversión</p>
//                       </div>
//                     </div>
//                     <Badge className="bg-[#C7E196] text-[#013936] font-semibold">{ejecutiva.actividades}</Badge>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Top Empresas */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Building2 className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Empresas Proveedoras</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Mayor actividad comercial</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {mockTopEmpresas.map((empresa, index) => (
//                   <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-sm font-medium text-white">{empresa.nombre}</p>
//                       <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
//                         <DollarSign className="w-3 h-3 mr-1" />
//                         {empresa.revenue}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-white/60">
//                       <span>{empresa.actividades} actividades</span>
//                       <span>{empresa.ejecutivas} ejecutivas asignadas</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Top Clientes */}
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader>
//               <div className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Top Clientes Finales</CardTitle>
//               </div>
//               <CardDescription className="text-white/60">Mayor volumen de gestiones</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {mockTopClientes.map((cliente, index) => (
//                   <div key={index} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-sm font-medium text-white">{cliente.nombre}</p>
//                       <Badge className={getEstadoBadgeColor(cliente.estado)}>
//                         {cliente.estado}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between text-xs text-white/60">
//                       <span>{cliente.gestiones} gestiones</span>
//                       <span>{cliente.etapa}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Actividades por Tipo */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Activity className="w-5 h-5 text-[#C7E196]" />
//               <CardTitle className="text-white">Distribución por Tipo de Actividad</CardTitle>
//             </div>
//             <CardDescription className="text-white/60">Canales de comunicación más utilizados</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-3 md:grid-cols-5">
//               {mockActividadesPorTipo.map((actividad, index) => (
//                 <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className={`p-2 rounded-lg ${getTipoActividadBadge(actividad.tipo)}`}>
//                       {getTipoActividadIcon(actividad.tipo)}
//                     </div>
//                     <span className="text-xs font-semibold text-white/60">{actividad.porcentaje}%</span>
//                   </div>
//                   <p className="text-sm font-medium text-white mb-1">{actividad.tipo}</p>
//                   <p className="text-2xl font-bold text-white">{actividad.cantidad}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Filters Card */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Filter className="w-5 h-5 text-[#C7E196]" />
//                 <CardTitle className="text-white">Filtros Avanzados</CardTitle>
//               </div>
//               {hasActiveFilters && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="text-white/80 hover:text-white hover:bg-white/10"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Limpiar Filtros ({Object.values({ empresaFilter, ejecutivaFilter, clienteFilter, tipoActividadFilter }).filter(f => f !== "all").length + (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0) + (searchTerm ? 1 : 0)})
//                 </Button>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Empresa</label>
//                 <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
//                     <SelectValue placeholder="Todas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas las empresas</SelectItem>
//                     {mockEmpresas.map((empresa) => (
//                       <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
//                         {empresa.nombre_empresa}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Ejecutiva</label>
//                 <Select value={ejecutivaFilter} onValueChange={setEjecutivaFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
//                     <SelectValue placeholder="Todas" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todas las ejecutivas</SelectItem>
//                     {mockEjecutivas.map((ejecutiva) => (
//                       <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
//                         {ejecutiva.nombre} {ejecutiva.apellido}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Cliente</label>
//                 <Select value={clienteFilter} onValueChange={setClienteFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
//                     <SelectValue placeholder="Todos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los clientes</SelectItem>
//                     {mockClientes.map((cliente) => (
//                       <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
//                         {cliente.nombre_cliente}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Tipo Actividad</label>
//                 <Select value={tipoActividadFilter} onValueChange={setTipoActividadFilter}>
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
//                     <SelectValue placeholder="Todos" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los tipos</SelectItem>
//                     <SelectItem value="Llamada">Llamada</SelectItem>
//                     <SelectItem value="WhatsApp">WhatsApp</SelectItem>
//                     <SelectItem value="Email">Email</SelectItem>
//                     <SelectItem value="LinkedIn">LinkedIn</SelectItem>
//                     <SelectItem value="Reunión presencial">Reunión presencial</SelectItem>
//                     <SelectItem value="Otro">Otro</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Fecha Desde</label>
//                 <Input
//                   type="date"
//                   value={fechaDesde}
//                   onChange={(e) => setFechaDesde(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm text-white/80 font-medium">Fecha Hasta</label>
//                 <Input
//                   type="date"
//                   value={fechaHasta}
//                   onChange={(e) => setFechaHasta(e.target.value)}
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Table Card */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="text-white text-xl">Registro de Actividades Comerciales</CardTitle>
//                 <CardDescription className="text-white/60 mt-1">
//                   Mostrando {filteredTrazabilidad.length} de {mockTrazabilidad.length} actividades
//                   {hasActiveFilters && " (filtradas)"}
//                 </CardDescription>
//               </div>
//               <div className="relative w-full md:w-80">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                 <Input
//                   placeholder="Buscar por ejecutiva, cliente, descripción..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 hover:bg-white/15 transition-all"
//                 />
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border border-white/10 overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
//                     <TableHead className="font-semibold text-[#C7E196]">Fecha</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Empresa</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Tipo</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Descripción</TableHead>
//                     <TableHead className="font-semibold text-[#C7E196]">Etapa</TableHead>
//                     <TableHead className="text-center font-semibold text-[#C7E196]">Estado</TableHead>
//                     <TableHead className="text-center font-semibold text-[#C7E196]">Detalles</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredTrazabilidad.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={9} className="text-center py-12 text-white/60">
//                         <div className="flex flex-col items-center gap-3">
//                           <Search className="w-12 h-12 text-white/20" />
//                           <p className="text-lg">No se encontraron actividades</p>
//                           <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredTrazabilidad.map((item) => (
//                       <TableRow key={item.id_trazabilidad} className="border-white/10 hover:bg-white/5 transition-all">
//                         <TableCell className="text-white/80 text-sm">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-white/40" />
//                             {formatDate(item.fecha_actividad)}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-white">
//                           <div className="flex items-center gap-2">
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
//                               {item.ejecutiva_nombre.split(" ")[0]?.charAt(0)}
//                               {item.ejecutiva_nombre.split(" ")[1]?.charAt(0)}
//                             </div>
//                             <span className="text-sm font-medium">{item.ejecutiva_nombre}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-white/80 text-sm">
//                           <div className="flex items-center gap-2">
//                             <Building2 className="w-4 h-4 text-white/40" />
//                             {item.nombre_empresa}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-white/80 text-sm font-medium">{item.nombre_cliente}</TableCell>
//                         <TableCell>
//                           <Badge className={`${getTipoActividadBadge(item.tipo_actividad)} flex items-center gap-1 w-fit`}>
//                             {getTipoActividadIcon(item.tipo_actividad)}
//                             {item.tipo_actividad}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-white/80 text-sm max-w-xs truncate">{item.descripcion}</TableCell>
//                         <TableCell className="text-white/70 text-xs">{item.etapa_oportunidad}</TableCell>
//                         <TableCell className="text-center">
//                           <Badge className={getEstadoBadgeColor(item.estado)}>
//                             {item.estado.replace("_", " ")}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => openDetailDialog(item)}
//                             className="text-[#C7E196] hover:text-white hover:bg-white/10 transition-all"
//                           >
//                             <ChevronRight className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Detail Dialog */}
//         <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//           <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl max-h-[85vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-[#C7E196] text-2xl flex items-center gap-2">
//                 <Activity className="w-6 h-6" />
//                 Detalle Completo de Actividad
//               </DialogTitle>
//               <DialogDescription className="text-white/60">
//                 ID de Trazabilidad: #{selectedActivity?.id_trazabilidad} • {selectedActivity?.fecha_actividad && formatDate(selectedActivity.fecha_actividad)}
//               </DialogDescription>
//             </DialogHeader>

//             {selectedActivity && (
//               <div className="space-y-6 mt-4">
//                 {/* Status Overview */}
//                 <div className="grid gap-4 md:grid-cols-3 p-4 bg-white/5 rounded-lg border border-white/10">
//                   <div className="space-y-1">
//                     <label className="text-xs font-medium text-white/60">Estado Actual</label>
//                     <Badge className={`${getEstadoBadgeColor(selectedActivity.estado)} text-sm`}>
//                       {selectedActivity.estado.replace("_", " ").toUpperCase()}
//                     </Badge>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-medium text-white/60">Etapa de Oportunidad</label>
//                     <p className="text-sm font-medium text-white">{selectedActivity.etapa_oportunidad}</p>
//                   </div>
//                   <div className="space-y-1">
//                     <label className="text-xs font-medium text-white/60">Monto Estimado</label>
//                     <p className="text-sm font-bold text-[#C7E196]">{selectedActivity.monto_estimado}</p>
//                   </div>
//                 </div>

//                 {/* People & Company Info */}
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196] flex items-center gap-2">
//                       <UserCheck className="w-4 h-4" />
//                       Ejecutiva Responsable
//                     </label>
//                     <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-sm font-semibold">
//                         {selectedActivity.ejecutiva_nombre.split(" ")[0]?.charAt(0)}
//                         {selectedActivity.ejecutiva_nombre.split(" ")[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-white font-semibold">{selectedActivity.ejecutiva_nombre}</p>
//                         <p className="text-xs text-white/60">Ejecutiva Comercial</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196] flex items-center gap-2">
//                       <Building2 className="w-4 h-4" />
//                       Empresa Proveedora
//                     </label>
//                     <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                       <p className="text-white/90 font-medium">{selectedActivity.nombre_empresa}</p>
//                       <p className="text-xs text-white/60 mt-1">Cliente de Growvia</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-[#C7E196] flex items-center gap-2">
//                     <Users className="w-4 h-4" />
//                     Cliente Final
//                   </label>
//                   <div className="p-3 bg-white/5 rounded-lg border border-white/10">
//                     <p className="text-white/90 font-medium text-lg">{selectedActivity.nombre_cliente}</p>
//                     <p className="text-xs text-white/60 mt-1">Prospecto en etapa: {selectedActivity.etapa_oportunidad}</p>
//                   </div>
//                 </div>

//                 {/* Activity Details */}
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196] flex items-center gap-2">
//                       {getTipoActividadIcon(selectedActivity.tipo_actividad)}
//                       Tipo de Contacto
//                     </label>
//                     <Badge className={`${getTipoActividadBadge(selectedActivity.tipo_actividad)} text-base px-4 py-2`}>
//                       {selectedActivity.tipo_actividad}
//                     </Badge>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-[#C7E196]">Descripción de la Actividad</label>
//                     <div className="p-4 bg-white/5 rounded-lg border border-white/10">
//                       <p className="text-white/90 leading-relaxed">{selectedActivity.descripcion}</p>
//                     </div>
//                   </div>

//                   {selectedActivity.notas && (
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-[#C7E196]">Notas y Observaciones</label>
//                       <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
//                         <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{selectedActivity.notas}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Metadata */}
//                 <div className="pt-4 border-t border-white/10">
//                   <p className="text-xs text-white/40 mb-3">Información del Sistema</p>
//                   <div className="grid gap-3 md:grid-cols-2">
//                     <div className="p-3 bg-white/5 rounded border border-white/10">
//                       <span className="text-xs text-white/60">ID de Trazabilidad</span>
//                       <p className="text-sm text-white/90 font-mono font-semibold">#{selectedActivity.id_trazabilidad}</p>
//                     </div>
//                     <div className="p-3 bg-white/5 rounded border border-white/10">
//                       <span className="text-xs text-white/60">Fecha de Registro</span>
//                       <p className="text-sm text-white/90 font-semibold">{formatDate(selectedActivity.fecha_actividad)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </DashboardLayout>
//   );
// }


//VERSION 4 MEJORAS 

// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Phone, Mail, MessageSquare, Linkedin, Users, ChevronRight, CheckCircle2, XCircle, Clock, AlertCircle, TrendingUp, Building2, User, Calendar } from "lucide-react";

// // ========== DATOS MOCK CON MÚLTIPLES INTENTOS ==========
// const mockIntentosContacto = [
//   // Ejecutiva María intentando contactar a BCP - 3 intentos el mismo día
//   {
//     id_trazabilidad: 1,
//     fecha_contacto: "2025-10-17T10:30:00",
//     ejecutiva: { id: 1, nombre: "María Fernández Rojas" },
//     empresa_prov: { id: 1, nombre: "Ron Cartavio S.A." },
//     cliente_final: { id: 5, nombre: "Banco de Crédito BCP" },
//     persona_contacto: { id: 12, nombre: "Carlos Mendoza", cargo: "Gerente Comercial" },
//     tipo_contacto: "WhatsApp",
//     resultado_contacto: "Positivo",
//     etapa_oportunidad: "Detección de necesidades",
//     nombre_oportunidad: "Renovación Contrato Q4 2025",
//     observaciones: "Cliente respondió por WhatsApp. Mostró interés en renovar contrato con incremento del 15%. Solicita propuesta formal por email.",
//     monto_estimado: 45000,
//     probabilidad_cierre: 60,
//   },
//   {
//     id_trazabilidad: 2,
//     fecha_contacto: "2025-10-17T14:00:00",
//     ejecutiva: { id: 1, nombre: "María Fernández Rojas" },
//     empresa_prov: { id: 1, nombre: "Ron Cartavio S.A." },
//     cliente_final: { id: 5, nombre: "Banco de Crédito BCP" },
//     persona_contacto: { id: 12, nombre: "Carlos Mendoza", cargo: "Gerente Comercial" },
//     tipo_contacto: "Email",
//     resultado_contacto: "Negativo",
//     etapa_oportunidad: "Presentación de propuesta",
//     nombre_oportunidad: "Renovación Contrato Q4 2025",
//     observaciones: "Email enviado con propuesta formal y cotización detallada. Sin respuesta después de 48 horas. Se requiere seguimiento por otro canal.",
//     monto_estimado: 45000,
//     probabilidad_cierre: 50,
//   },
//   {
//     id_trazabilidad: 3,
//     fecha_contacto: "2025-10-18T11:00:00",
//     ejecutiva: { id: 1, nombre: "María Fernández Rojas" },
//     empresa_prov: { id: 1, nombre: "Ron Cartavio S.A." },
//     cliente_final: { id: 5, nombre: "Banco de Crédito BCP" },
//     persona_contacto: { id: 12, nombre: "Carlos Mendoza", cargo: "Gerente Comercial" },
//     tipo_contacto: "Llamada",
//     resultado_contacto: "Positivo",
//     etapa_oportunidad: "Presentación de propuesta",
//     nombre_oportunidad: "Renovación Contrato Q4 2025",
//     observaciones: "Llamada telefónica exitosa. Cliente revisó el email anterior y confirma interés. Solicita reunión presencial para el viernes 20/10 a las 3:00 PM.",
//     monto_estimado: 45000,
//     probabilidad_cierre: 75,
//   },

//   // Otros intentos de otras ejecutivas
//   {
//     id_trazabilidad: 4,
//     fecha_contacto: "2025-10-17T09:15:00",
//     ejecutiva: { id: 2, nombre: "Carmen López Torres" },
//     empresa_prov: { id: 2, nombre: "Alicorp S.A.A." },
//     cliente_final: { id: 2, nombre: "Interbank" },
//     persona_contacto: { id: 8, nombre: "Ana Ruiz", cargo: "Jefa de Compras" },
//     tipo_contacto: "LinkedIn",
//     resultado_contacto: "Pendiente",
//     etapa_oportunidad: "Prospección",
//     nombre_oportunidad: "Nuevo Contrato Logística 2026",
//     observaciones: "Mensaje enviado por LinkedIn. Esperando respuesta para agendar call exploratorio. Cliente visto el mensaje pero sin responder aún.",
//     monto_estimado: 32000,
//     probabilidad_cierre: 30,
//   },
//   {
//     id_trazabilidad: 5,
//     fecha_contacto: "2025-10-16T16:45:00",
//     ejecutiva: { id: 3, nombre: "Sandra Pérez Gómez" },
//     empresa_prov: { id: 3, nombre: "Backus & Johnston" },
//     cliente_final: { id: 3, nombre: "BBVA Continental" },
//     persona_contacto: { id: 15, nombre: "Roberto Silva", cargo: "Director Operaciones" },
//     tipo_contacto: "Reunión presencial",
//     resultado_contacto: "Positivo",
//     etapa_oportunidad: "Negociación",
//     nombre_oportunidad: "Expansión Servicios Q1 2026",
//     observaciones: "Reunión presencial en oficinas del cliente. Presentación ante comité de 5 personas. Feedback muy positivo. Cliente solicitó ajustes menores en pricing.",
//     monto_estimado: 58000,
//     probabilidad_cierre: 80,
//   },
// ];

// export default function TrazabilidadIntentosView() {
//   const [intentos] = useState(mockIntentosContacto);
//   const [selectedIntento, setSelectedIntento] = useState<any | null>(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);

//   const getTipoContactoIcon = (tipo: string) => {
//     switch(tipo) {
//       case 'Llamada': return <Phone className="w-4 h-4" />;
//       case 'WhatsApp': return <MessageSquare className="w-4 h-4" />;
//       case 'Email': return <Mail className="w-4 h-4" />;
//       case 'LinkedIn': return <Linkedin className="w-4 h-4" />;
//       case 'Reunión presencial': return <Users className="w-4 h-4" />;
//       default: return <Phone className="w-4 h-4" />;
//     }
//   };

//   const getTipoContactoBadge = (tipo: string) => {
//     const colores: Record<string, string> = {
//       'Llamada': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
//       'WhatsApp': 'bg-green-500/20 text-green-300 border-green-500/30',
//       'Email': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
//       'LinkedIn': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
//       'Reunión presencial': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
//     };
//     return colores[tipo] || 'bg-white/10 text-white/60';
//   };

//   const getResultadoIcon = (resultado: string) => {
//     switch(resultado) {
//       case 'Positivo': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
//       case 'Negativo': return <XCircle className="w-4 h-4 text-red-400" />;
//       case 'Pendiente': return <Clock className="w-4 h-4 text-yellow-400" />;
//       case 'Neutro': return <AlertCircle className="w-4 h-4 text-gray-400" />;
//       default: return <AlertCircle className="w-4 h-4" />;
//     }
//   };

//   const getResultadoBadge = (resultado: string) => {
//     switch(resultado) {
//       case 'Positivo': return 'bg-green-500/20 text-green-300 border-green-500/30';
//       case 'Negativo': return 'bg-red-500/20 text-red-300 border-red-500/30';
//       case 'Pendiente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
//       case 'Neutro': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//       default: return 'bg-white/10 text-white/60';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("es-ES", {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatDateLong = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("es-ES", {
//       weekday: 'long',
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // Calcular estadísticas
//   const stats = {
//     total: intentos.length,
//     positivos: intentos.filter(i => i.resultado_contacto === 'Positivo').length,
//     negativos: intentos.filter(i => i.resultado_contacto === 'Negativo').length,
//     pendientes: intentos.filter(i => i.resultado_contacto === 'Pendiente').length,
//   };

//   const tasaExito = ((stats.positivos / stats.total) * 100).toFixed(1);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#013936] to-[#024a46] p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-white">Trazabilidad de Intentos de Contacto</h1>
//           <p className="text-white/60 mt-1">Registro detallado de cada gestión comercial realizada</p>
//         </div>
//         <Button className="bg-[#C7E196] text-[#013936] hover:bg-[#b8d287] font-semibold">
//           <TrendingUp className="w-4 h-4 mr-2" />
//           Exportar Reporte
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-white/80">Total Intentos</CardTitle>
//             <Phone className="h-5 w-5 text-[#C7E196]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-white">{stats.total}</div>
//             <p className="text-xs text-white/60 mt-1">Gestiones realizadas</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-white/80">Contactos Exitosos</CardTitle>
//             <CheckCircle2 className="h-5 w-5 text-green-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-white">{stats.positivos}</div>
//             <p className="text-xs text-white/60 mt-1">{tasaExito}% de efectividad</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-white/80">Sin Respuesta</CardTitle>
//             <XCircle className="h-5 w-5 text-red-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-white">{stats.negativos}</div>
//             <p className="text-xs text-white/60 mt-1">Requieren seguimiento</p>
//           </CardContent>
//         </Card>

//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-white/80">Pendientes</CardTitle>
//             <Clock className="h-5 w-5 text-yellow-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold text-white">{stats.pendientes}</div>
//             <p className="text-xs text-white/60 mt-1">Esperando respuesta</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tabla de Intentos */}
//       <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//         <CardHeader>
//           <CardTitle className="text-white text-xl">Historial Completo de Intentos de Contacto</CardTitle>
//           <CardDescription className="text-white/60">
//             Cada fila representa un intento individual de contacto • Vista completa para empresas proveedoras
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border border-white/10 overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow className="border-white/10 hover:bg-transparent bg-white/5">
//                   <TableHead className="font-semibold text-[#C7E196]">Fecha & Hora</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Cliente Final</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Contacto</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Canal</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Resultado</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Oportunidad</TableHead>
//                   <TableHead className="font-semibold text-[#C7E196]">Observaciones</TableHead>
//                   <TableHead className="text-center font-semibold text-[#C7E196]">Detalles</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {intentos.map((intento) => (
//                   <TableRow 
//                     key={intento.id_trazabilidad} 
//                     className="border-white/10 hover:bg-white/5 transition-all"
//                   >
//                     <TableCell className="text-white/80 text-sm font-mono">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-3 h-3 text-white/40" />
//                         {formatDate(intento.fecha_contacto)}
//                       </div>
//                     </TableCell>
                    
//                     <TableCell className="text-white">
//                       <div className="flex items-center gap-2">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
//                           {intento.ejecutiva.nombre.split(" ")[0]?.charAt(0)}
//                           {intento.ejecutiva.nombre.split(" ")[1]?.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium">{intento.ejecutiva.nombre}</p>
//                           <p className="text-xs text-white/60">{intento.empresa_prov.nombre}</p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-white">
//                       <div className="flex items-center gap-2">
//                         <Building2 className="w-4 h-4 text-white/40" />
//                         <p className="text-sm font-medium">{intento.cliente_final.nombre}</p>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-white/80 text-sm">
//                       <div className="flex items-center gap-2">
//                         <User className="w-3 h-3 text-white/40" />
//                         <div>
//                           <p className="font-medium">{intento.persona_contacto.nombre}</p>
//                           <p className="text-xs text-white/60">{intento.persona_contacto.cargo}</p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       <Badge className={`${getTipoContactoBadge(intento.tipo_contacto)} flex items-center gap-1 w-fit`}>
//                         {getTipoContactoIcon(intento.tipo_contacto)}
//                         {intento.tipo_contacto}
//                       </Badge>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         {getResultadoIcon(intento.resultado_contacto)}
//                         <Badge className={getResultadoBadge(intento.resultado_contacto)}>
//                           {intento.resultado_contacto}
//                         </Badge>
//                       </div>
//                     </TableCell>

//                     <TableCell className="text-white/80 text-sm max-w-xs">
//                       <p className="font-medium truncate">{intento.nombre_oportunidad}</p>
//                       <p className="text-xs text-white/60">{intento.etapa_oportunidad}</p>
//                     </TableCell>

//                     <TableCell className="text-white/70 text-sm max-w-md">
//                       <p className="truncate" title={intento.observaciones}>
//                         {intento.observaciones}
//                       </p>
//                     </TableCell>

//                     <TableCell className="text-center">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedIntento(intento);
//                           setDetailDialogOpen(true);
//                         }}
//                         className="text-[#C7E196] hover:text-white hover:bg-white/10"
//                       >
//                         <ChevronRight className="w-4 h-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Detail Dialog */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-[#C7E196] text-2xl flex items-center gap-2">
//               {selectedIntento && getTipoContactoIcon(selectedIntento.tipo_contacto)}
//               Detalle del Intento de Contacto
//             </DialogTitle>
//             <DialogDescription className="text-white/60">
//               ID: #{selectedIntento?.id_trazabilidad} • {selectedIntento?.fecha_contacto && formatDateLong(selectedIntento.fecha_contacto)}
//             </DialogDescription>
//           </DialogHeader>

//           {selectedIntento && (
//             <div className="space-y-6 mt-4">
//               {/* Resultado prominente */}
//               <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {getResultadoIcon(selectedIntento.resultado_contacto)}
//                   <div>
//                     <p className="text-sm text-white/60">Resultado del Contacto</p>
//                     <p className="text-2xl font-bold text-white">{selectedIntento.resultado_contacto}</p>
//                   </div>
//                 </div>
//                 <Badge className={`${getTipoContactoBadge(selectedIntento.tipo_contacto)} text-lg px-4 py-2`}>
//                   {getTipoContactoIcon(selectedIntento.tipo_contacto)}
//                   <span className="ml-2">{selectedIntento.tipo_contacto}</span>
//                 </Badge>
//               </div>

//               {/* Información de personas */}
//               <div className="grid gap-4 md:grid-cols-2">
//                 <Card className="bg-white/5 border-white/10">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-[#C7E196] text-sm flex items-center gap-2">
//                       <User className="w-4 h-4" />
//                       Ejecutiva Responsable
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] font-semibold">
//                         {selectedIntento.ejecutiva.nombre.split(" ")[0]?.charAt(0)}
//                         {selectedIntento.ejecutiva.nombre.split(" ")[1]?.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-white">{selectedIntento.ejecutiva.nombre}</p>
//                         <p className="text-xs text-white/60">{selectedIntento.empresa_prov.nombre}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white/5 border-white/10">
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-[#C7E196] text-sm flex items-center gap-2">
//                       <User className="w-4 h-4" />
//                       Persona de Contacto
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="font-semibold text-white">{selectedIntento.persona_contacto.nombre}</p>
//                     <p className="text-sm text-white/70">{selectedIntento.persona_contacto.cargo}</p>
//                     <p className="text-xs text-white/60 mt-1">{selectedIntento.cliente_final.nombre}</p>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Información de oportunidad */}
//               <Card className="bg-white/5 border-white/10">
//                 <CardHeader>
//                   <CardTitle className="text-[#C7E196] text-sm">Información de la Oportunidad</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-white/60">Nombre de Oportunidad</p>
//                       <p className="font-semibold text-white">{selectedIntento.nombre_oportunidad}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-white/60">Etapa Actual</p>
//                       <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
//                         {selectedIntento.etapa_oportunidad}
//                       </Badge>
//                     </div>
//                   </div>
//                   {selectedIntento.monto_estimado && (
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-xs text-white/60">Monto Estimado</p>
//                         <p className="font-bold text-[#C7E196] text-lg">
//                           ${selectedIntento.monto_estimado.toLocaleString()}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-white/60">Probabilidad de Cierre</p>
//                         <div className="flex items-center gap-2">
//                           <div className="w-full bg-white/10 rounded-full h-2">
//                             <div 
//                               className="bg-[#C7E196] h-2 rounded-full transition-all"
//                               style={{ width: `${selectedIntento.probabilidad_cierre}%` }}
//                             />
//                           </div>
//                           <span className="text-sm font-semibold text-white">
//                             {selectedIntento.probabilidad_cierre}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Observaciones Detalladas */}
//               <Card className="bg-white/5 border-white/10">
//                 <CardHeader>
//                   <CardTitle className="text-[#C7E196] text-sm">Observaciones Detalladas</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="p-4 bg-white/5 rounded border border-white/10">
//                     <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
//                       {selectedIntento.observaciones}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Metadata */}
//               <div className="pt-4 border-t border-white/10">
//                 <p className="text-xs text-white/40 mb-3">Información del Sistema</p>
//                 <div className="grid gap-3 md:grid-cols-3 text-sm">
//                   <div className="p-3 bg-white/5 rounded border border-white/10">
//                     <span className="text-xs text-white/60">ID de Trazabilidad</span>
//                     <p className="text-white/90 font-mono font-semibold">#{selectedIntento.id_trazabilidad}</p>
//                   </div>
//                   <div className="p-3 bg-white/5 rounded border border-white/10">
//                     <span className="text-xs text-white/60">Fecha de Registro</span>
//                     <p className="text-white/90 font-semibold">{formatDateLong(selectedIntento.fecha_contacto)}</p>
//                   </div>
//                   <div className="p-3 bg-white/5 rounded border border-white/10">
//                     <span className="text-xs text-white/60">Empresa Proveedora</span>
//                     <p className="text-white/90 font-semibold">{selectedIntento.empresa_prov.nombre}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }