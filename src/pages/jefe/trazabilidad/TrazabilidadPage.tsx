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
    if (!user || user.role !== "jefe") {
      navigate("/login");
      return;
    }
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
        return "bg-[#C7E196] text-[#013936]";
      case "en_proceso":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "pendiente":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "cancelado":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-white/10 text-white/60";
    }
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
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Tipo de Actividad</label>
                  <div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {selectedActivity.tipo_actividad}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#C7E196]">Descripción Completa</label>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">{selectedActivity.descripcion}</p>
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