import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Users,
  Building2,
  UserCheck,
  Activity,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  FileText,
  User,
  Briefcase,
  TrendingUp,
  Building,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Archive
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jefeService, ClienteFinal, Ejecutiva, Empresa } from "@/services/jefeService";

const navItems = [
  { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
  { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
  { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
  { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
  { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
  { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
];

export default function ClientesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clientes, setClientes] = useState<ClienteFinal[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteFinal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");

  // Modal states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteFinal | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    razon_social: "",
    ruc: "",
    correo: "",
    telefono: "",
    direccion: "",
    pais: "Perú",
    departamento: "",
    provincia: "",
    pagina_web: "",
    linkedin: "",
    rubro: "",
    sub_rubro: "",
    tamanio_empresa: "Mediana",
    grupo_economico: "",
    facturacion_anual: "",
    cantidad_empleados: "",
    id_ejecutiva: "",
    id_empresa_prov: "",
  });

  const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // ✅ Autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (!user && !storedUser) {
      navigate("/login");
      return;
    }
    
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
    
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    const allowedRoles = ["jefe", "Jefe", "Administrador"];
    if (!allowedRoles.includes(currentUser.role)) {
      navigate("/login");
      return;
    }
    
    fetchEjecutivas();
    fetchEmpresas();
    fetchClientes();
  }, [user, navigate]);

  // ✅ Filtrado
  useEffect(() => {
    let filtered = clientes;
    
    // Filtro por estado (usando el campo 'estado' de la BD)
    if (statusFilter === "active") {
      filtered = filtered.filter(cliente => cliente.estado === 'Activo');
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(cliente => cliente.estado === 'Inactivo');
    }
    
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((cliente) => {
        return (
          cliente.razon_social?.toLowerCase().includes(searchLower) ||
          cliente.ruc?.toLowerCase().includes(searchLower) ||
          cliente.correo?.toLowerCase().includes(searchLower) ||
          cliente.telefono?.toLowerCase().includes(searchLower) ||
          cliente.rubro?.toLowerCase().includes(searchLower) ||
          cliente.ejecutiva_nombre?.toLowerCase().includes(searchLower) ||
          cliente.empresa_nombre?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    setFilteredClientes(filtered);
  }, [searchTerm, clientes, statusFilter]);

  const fetchEjecutivas = async () => {
    try {
      const data = await jefeService.getEjecutivas();
      setEjecutivas(data);
    } catch (error) {
      console.error("Error fetching ejecutivas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ejecutivas",
        variant: "destructive",
      });
    }
  };

  const fetchEmpresas = async () => {
    try {
      const data = await jefeService.getEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error("Error fetching empresas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      });
    }
  };

  const fetchClientes = async () => {
    console.log('entro al fetch');
    try {
      setLoading(true);
      console.log('entro al fetch');
      const data = await jefeService.getClientes();
      console.log('📥 Clientes recibidos:', data);
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openViewDialog = (cliente: ClienteFinal) => {
    setSelectedCliente(cliente);
    setViewDialogOpen(true);
  };

  const openEditDialog = (cliente: ClienteFinal) => {
      console.log('✏️ Abriendo diálogo de edición para:', cliente.razon_social);

    setSelectedCliente(cliente);
    setFormData({
      razon_social: cliente.razon_social,
      ruc: cliente.ruc || "",
      correo: cliente.correo || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      pais: cliente.pais || "Perú",
      departamento: cliente.departamento || "",
      provincia: cliente.provincia || "",
      pagina_web: cliente.pagina_web || "",
      linkedin: cliente.linkedin || "",
      rubro: cliente.rubro || "",
      sub_rubro: cliente.sub_rubro || "",
      tamanio_empresa: cliente.tamanio_empresa || "Mediana",
      grupo_economico: cliente.grupo_economico || "",
      facturacion_anual: cliente.facturacion_anual?.toString() || "",
      cantidad_empleados: cliente.cantidad_empleados?.toString() || "",
      id_ejecutiva: cliente.id_ejecutiva?.toString() || "",
      id_empresa_prov: cliente.id_empresa_prov?.toString() || "",
    });
    setEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    console.log('➕ Abriendo diálogo de creación');
    setFormData({
      razon_social: "",
      ruc: "",
      correo: "",
      telefono: "",
      direccion: "",
      pais: "Perú",
      departamento: "",
      provincia: "",
      pagina_web: "",
      linkedin: "",
      rubro: "",
      sub_rubro: "",
      tamanio_empresa: "Mediana",
      grupo_economico: "",
      facturacion_anual: "",
      cantidad_empleados: "",
      id_ejecutiva: "",
      id_empresa_prov: "",
    });
    setCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      if (!formData.razon_social) {
        toast({
          title: "Error",
          description: "La razón social es obligatoria",
          variant: "destructive",
        });
        return;
      }

      if (!formData.id_ejecutiva) {
        toast({
          title: "Error",
          description: "Debe asignar una ejecutiva",
          variant: "destructive",
        });
        return;
      }

      if (!formData.id_empresa_prov) {
        toast({
          title: "Error",
          description: "Debe asignar una empresa proveedora",
          variant: "destructive",
        });
        return;
      }

      const dataToSend = {
        ...formData,
        id_ejecutiva: parseInt(formData.id_ejecutiva),
        id_empresa_prov: parseInt(formData.id_empresa_prov),
        facturacion_anual: formData.facturacion_anual ? parseFloat(formData.facturacion_anual) : null,
        cantidad_empleados: formData.cantidad_empleados ? parseInt(formData.cantidad_empleados) : null,
        estado: 'Activo' // Por defecto se crea como activo
      };

      await jefeService.createCliente(dataToSend);

      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      });

      setCreateDialogOpen(false);
      fetchClientes();
    } catch (error: any) {
      console.error("Error creating cliente:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el cliente",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedCliente) return;

    try {
      if (!formData.razon_social) {
        toast({
          title: "Error",
          description: "La razón social es obligatoria",
          variant: "destructive",
        });
        return;
      }

      const dataToSend = {
        ...formData,
        id_ejecutiva: formData.id_ejecutiva ? parseInt(formData.id_ejecutiva) : null,
        id_empresa_prov: formData.id_empresa_prov ? parseInt(formData.id_empresa_prov) : null,
        facturacion_anual: formData.facturacion_anual ? parseFloat(formData.facturacion_anual) : null,
        cantidad_empleados: formData.cantidad_empleados ? parseInt(formData.cantidad_empleados) : null,
        estado: selectedCliente.estado // Mantener el estado actual
      };

      await jefeService.updateCliente(selectedCliente.id_cliente_final, dataToSend);

      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente",
      });

      setEditDialogOpen(false);
      fetchClientes();
    } catch (error: any) {
      console.error("Error updating cliente:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el cliente",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas desactivar este cliente?")) return;

    try {
      await jefeService.deleteCliente(id);

      toast({
        title: "Éxito",
        description: "Cliente desactivado correctamente",
      });

      fetchClientes();
    } catch (error: any) {
      console.error("Error deleting cliente:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo desactivar el cliente",
        variant: "destructive",
      });
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas activar este cliente?")) return;

    try {
      // ✅ SOLUCIÓN ALTERNATIVA: Usar update en lugar de activate
      await jefeService.updateCliente(id, { estado: 'Activo' });

      toast({
        title: "Éxito",
        description: "Cliente activado correctamente",
      });

      fetchClientes();
    } catch (error: any) {
      console.error("Error activating cliente:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo activar el cliente",
        variant: "destructive",
      });
    }
  };

  // Estadísticas usando el campo 'estado'
  const activeClientes = clientes.filter(c => c.estado === 'Activo');
  const inactiveClientes = clientes.filter(c => c.estado === 'Inactivo');

  return (
    <DashboardLayout navItems={navItems} title="Gestión de Clientes Finales" subtitle="Administra los clientes finales del sistema">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium text-white/80">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{clientes.length}</div>
              <p className="text-xs text-white/60 mt-1">Todos los clientes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Clientes Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeClientes.length}</div>
              <p className="text-xs text-white/60 mt-1">En operación</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Clientes Inactivos</CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{inactiveClientes.length}</div>
              <p className="text-xs text-white/60 mt-1">Desactivados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Actividades</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {clientes.reduce((sum, c) => sum + (c.total_actividades || 0), 0)}
              </div>
              <p className="text-xs text-white/60 mt-1">Registros de trazabilidad</p>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Lista de Clientes Finales</CardTitle>
                <CardDescription className="text-white/60">
                  Gestiona la información de todos los clientes finales
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#012826]/80 text-white">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>

                  </Select>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    />
                  </div>
                </div>
                <Button
                  onClick={openCreateDialog}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent text-white">
                      <TableHead className="font-semibold text-white">Estado</TableHead>
                      <TableHead className="font-semibold text-white">Razón Social</TableHead>
                      <TableHead className="font-semibold text-white">RUC</TableHead>
                      <TableHead className="font-semibold text-white">Contacto</TableHead>
                      <TableHead className="font-semibold text-white">Empresa</TableHead>
                      <TableHead className="font-semibold text-white">Ejecutiva</TableHead>
                      <TableHead className="text-center font-semibold text-white">Actividades</TableHead>
                      <TableHead className="text-center font-semibold text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-white/80">
                          {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente_final} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <Badge 
                              className={cliente.estado === 'Activo'
                                ? "bg-green-500/20 border-green-500/30 text-[#013936]" 
                                : "bg-red-500/20 border-red-500/30 text-red-600"
                              }
                            >
                              {cliente.estado === 'Activo' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {cliente.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            <div className="flex items-center gap-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C7E196] text-[#013936] text-sm font-bold">
                                {cliente.razon_social?.charAt(0) || "?"}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{cliente.razon_social}</p>
                                {cliente.grupo_economico && (
                                  <p className="text-xs text-white/70">{cliente.grupo_economico}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/90 text-sm font-mono">{cliente.ruc || "N/A"}</TableCell>
                          <TableCell className="text-white/90 text-sm">
                            <div className="space-y-1">
                              {cliente.correo && (
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-white/60" />
                                  <p className="text-xs text-white/90">{cliente.correo}</p>
                                </div>
                              )}
                              {cliente.telefono && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-white/60" />
                                  <p className="text-xs text-white/90">{cliente.telefono}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/90 text-sm">
                            {cliente.empresa_nombre ? (
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                                {cliente.empresa_nombre}
                              </Badge>
                            ) : (
                              <span className="text-white/40">Sin asignar</span>
                            )}
                          </TableCell>
                          <TableCell className="text-white/90 text-sm">
                            {cliente.ejecutiva_nombre || <span className="text-white/40">Sin asignar</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-500/20 text-[#013936] border-blue-500/30">
                              {cliente.total_actividades || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewDialog(cliente)}
                                className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(cliente)}
                                className="text-[#C7E196] hover:text-white hover:bg-white/10"
                                disabled={cliente.estado === 'Inactivo'}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              {cliente.estado === 'Activo' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(cliente.id_cliente_final)}
                                  className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleActivate(cliente.id_cliente_final)}
                                  className="text-green-300 hover:text-green-200 hover:bg-green-500/20"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
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

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Detalles del Cliente</DialogTitle>
              <DialogDescription className="text-white/60">
                Información completa del cliente
              </DialogDescription>
            </DialogHeader>

            {selectedCliente && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 pr-4">
                  {/* Estado */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      className={selectedCliente.estado === 'Activo'
                        ? "bg-green-500/20 border-green-500/30 text-[#013936]" 
                        : "bg-red-500/20 border-red-500/30 text-red-600"
                      }
                    >
                      {selectedCliente.estado}
                    </Badge>
                    <span className="text-white/60 text-sm">
                      {selectedCliente.estado === 'Activo'
                        ? "Cliente activo en el sistema" 
                        : "Cliente desactivado temporalmente"
                      }
                    </span>
                  </div>

                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#C7E196] flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Razón Social</p>
                        <p className="text-white font-medium">{selectedCliente.razon_social}</p>
                      </div>
                      <div>
                        <p className="text-white/60">RUC</p>
                        <p className="text-white font-mono">{selectedCliente.ruc || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Correo</p>
                        <p className="text-white">{selectedCliente.correo || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Teléfono</p>
                        <p className="text-white">{selectedCliente.telefono || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-white/60">Página Web</p>
                        <p className="text-white">{selectedCliente.pagina_web || "N/A"}</p>
                      </div>
                      {selectedCliente.linkedin && (
                        <div className="col-span-2">
                          <p className="text-white/60">LinkedIn</p>
                          <p className="text-white">{selectedCliente.linkedin}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#C7E196] flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Ubicación
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">País</p>
                        <p className="text-white">{selectedCliente.pais || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Departamento</p>
                        <p className="text-white">{selectedCliente.departamento || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Provincia</p>
                        <p className="text-white">{selectedCliente.provincia || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-white/60">Dirección</p>
                        <p className="text-white">{selectedCliente.direccion || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información Empresarial */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#C7E196] flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Información Empresarial
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Rubro</p>
                        <p className="text-white">{selectedCliente.rubro || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Sub-Rubro</p>
                        <p className="text-white">{selectedCliente.sub_rubro || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Tamaño Empresa</p>
                        <p className="text-white">{selectedCliente.tamanio_empresa || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Grupo Económico</p>
                        <p className="text-white">{selectedCliente.grupo_economico || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Facturación Anual</p>
                        <p className="text-white">
                          {selectedCliente.facturacion_anual 
                            ? `S/. ${selectedCliente.facturacion_anual.toLocaleString()}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Cantidad Empleados</p>
                        <p className="text-white">{selectedCliente.cantidad_empleados || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Asignaciones */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#C7E196] flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Asignaciones
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60">Empresa Proveedora</p>
                        <p className="text-white font-medium">{selectedCliente.empresa_nombre || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Ejecutiva Asignada</p>
                        <p className="text-white font-medium">{selectedCliente.ejecutiva_nombre || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Total Actividades</p>
                        <Badge className="bg-green-500/20 text-[#013936] border-green-500/30">
                          {selectedCliente.total_actividades || 0}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-white/60">Fecha Creación</p>
                        <p className="text-white text-xs">
                          {selectedCliente.fecha_creacion 
                            ? new Date(selectedCliente.fecha_creacion).toLocaleDateString() 
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}

            <DialogFooter>
              <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cerrar
            </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>

                {/* Create/Edit Dialog */}
        <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }
        }}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196] pb-2">
                {createDialogOpen ? "Crear Nuevo Cliente" : "Editar Cliente"}
              </DialogTitle>
              <DialogDescription className="text-white/60 ">
                {createDialogOpen 
                  ? "Ingresa los datos del nuevo cliente final"
                  : "Modifica los datos del cliente"}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-[#C7E196]">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-white/80 pb-3">Razón Social *</Label>
                      <Input
                        value={formData.razon_social}
                        onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Ingrese razón social"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">RUC</Label>
                      <Input
                        value={formData.ruc}
                        onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="20XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Teléfono</Label>
                      <Input
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-white/80 pb-3">Correo Electrónico</Label>
                      <Input
                        type="email"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-white/80 pb-3">Página Web</Label>
                      <Input
                        value={formData.pagina_web}
                        onChange={(e) => setFormData({ ...formData, pagina_web: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="https://www.empresa.com"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-white/80 pb-3">LinkedIn</Label>
                      <Input
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="https://linkedin.com/company/empresa"
                      />
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-[#C7E196]">Ubicación</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80 pb-3 ">País</Label>
                      <Input
                        value={formData.pais}
                        onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Departamento</Label>
                      <Input
                        value={formData.departamento}
                        onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Lima"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Provincia</Label>
                      <Input
                        value={formData.provincia}
                        onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Lima"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-white/80 pb-3">Dirección</Label>
                      <Textarea
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Av. Principal 123, San Isidro"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Información Empresarial */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-[#C7E196]">Información Empresarial</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80 pb-3">Rubro</Label>
                      <Input
                        value={formData.rubro}
                        onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Tecnología, Retail, etc."
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Sub-Rubro</Label>
                      <Input
                        value={formData.sub_rubro}
                        onChange={(e) => setFormData({ ...formData, sub_rubro: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Software, E-commerce, etc."
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Tamaño Empresa</Label>
                      <Select
                        value={formData.tamanio_empresa}
                        onValueChange={(value) => setFormData({ ...formData, tamanio_empresa: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>

                        {/* Aquí agregamos fondo y color al desplegable */}
                        <SelectContent className="bg-[#013936] text-white border border-white/20">
                          <SelectItem value="Pequeña" className="text-white">Pequeña</SelectItem>
                          <SelectItem value="Mediana" className="text-white">Mediana</SelectItem>
                          <SelectItem value="Grande" className="text-white">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white/80 pb-3">Grupo Económico</Label>
                      <Input
                        value={formData.grupo_economico}
                        onChange={(e) => setFormData({ ...formData, grupo_economico: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="Grupo empresarial"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Facturación Anual (S/.)</Label>
                      <Input
                        type="number"
                        value={formData.facturacion_anual}
                        onChange={(e) => setFormData({ ...formData, facturacion_anual: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <Label className="text-white/80 pb-3">Cantidad Empleados</Label>
                      <Input
                        type="number"
                        value={formData.cantidad_empleados}
                        onChange={(e) => setFormData({ ...formData, cantidad_empleados: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Asignaciones */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-[#C7E196]">Asignaciones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/80 pb-3">Empresa Proveedora *</Label>
                      <Select
                        value={formData.id_empresa_prov}
                        onValueChange={(value) => setFormData({ ...formData, id_empresa_prov: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Seleccione empresa" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#013936] text-white border border-white/20">
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
                              {empresa.nombre_empresa || empresa.razon_social}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pb-4">
                      <Label className="text-white/80 pb-3">Ejecutiva Asignada *</Label>
                      <Select
                        value={formData.id_ejecutiva}
                        onValueChange={(value) => setFormData({ ...formData, id_ejecutiva: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Seleccione ejecutiva" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#013936] text-white border border-white/20">
                          {ejecutivas.filter(e => e.activo).map((ejecutiva) => (
                            <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
                              {ejecutiva.nombre} {ejecutiva.apellido}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setEditDialogOpen(false);
                }}
                  className="!bg-transparent border-white/20 text-white hover:!bg-white/10 transition-colors duration-200"

              >
                Cancelar
              </Button>
              <Button
                onClick={createDialogOpen ? handleCreate : handleUpdate}
                className="!bg-transparent !border !border-white/20 text-white hover:!bg-white/10 transition-colors duration-200"
              >
                {createDialogOpen ? "Crear Cliente" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
