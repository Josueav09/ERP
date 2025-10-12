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
  Key,
  Copy,
  RefreshCw,
  FileText,
  User
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jefeService, Cliente, Empresa, Ejecutiva } from "@/services/jefeService";

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

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    apellido_cliente: "",
    rut_cliente: "",
    email_cliente: "",
    password: "",
    telefono_cliente: "",
    direccion_cliente: "",
    ciudad_cliente: "",
    id_empresa: "",
    id_ejecutiva: "",
  });

  // Password generation states
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);

  // Options for selects
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([]);

  useEffect(() => {
    if (!user || user.role !== "jefe") {
      navigate("/login");
      return;
    }
    fetchOptions();
    fetchClientes();
  }, [user, navigate]);

  useEffect(() => {
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.rut_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.ejecutiva_nombre && cliente.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.direccion && cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const fetchOptions = async () => {
    try {
      const [empresasData, ejecutivasData] = await Promise.all([
        jefeService.getEmpresas(),
        jefeService.getEjecutivas()
      ]);

      setEmpresas(empresasData);
      setEjecutivas(ejecutivasData);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await jefeService.getClientes();
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setGeneratedPassword(newPassword);
    setFormData({ ...formData, password: newPassword });
    setShowGeneratedPassword(true);
    toast({
      title: "Contraseña generada",
      description: "Se ha generado una nueva contraseña. Guarda los cambios para aplicarla.",
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Copiado",
      description: "Contraseña copiada al portapapeles",
    });
  };

  const openEditDialog = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nombre_cliente: cliente.nombre_cliente,
      apellido_cliente: cliente.apellido_cliente || "",
      rut_cliente: cliente.rut_cliente,
      email_cliente: cliente.email,
      password: "",
      telefono_cliente: cliente.telefono || "",
      direccion_cliente: cliente.direccion || "",
      ciudad_cliente: "",
      id_empresa: cliente.id_empresa.toString(),
      id_ejecutiva: cliente.id_ejecutiva?.toString() || "",
    });
    setGeneratedPassword("");
    setShowGeneratedPassword(false);
    setEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({
      nombre_cliente: "",
      apellido_cliente: "",
      rut_cliente: "",
      email_cliente: "",
      password: "",
      telefono_cliente: "",
      direccion_cliente: "",
      ciudad_cliente: "",
      id_empresa: "",
      id_ejecutiva: "",
    });
    setGeneratedPassword("");
    setShowGeneratedPassword(false);
    setCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      await jefeService.createCliente(formData);

      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente",
      });

      setCreateDialogOpen(false);
      fetchClientes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedCliente) return;

    try {
      await jefeService.updateCliente(selectedCliente.id_cliente, formData);

      toast({
        title: "Cliente actualizado",
        description: "Los cambios han sido guardados exitosamente",
      });

      setEditDialogOpen(false);
      fetchClientes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas desactivar este cliente?")) return;

    try {
      await jefeService.deleteCliente(id);

      toast({
        title: "Cliente desactivado",
        description: "El cliente ha sido desactivado exitosamente",
      });

      fetchClientes();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo desactivar el cliente",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Gestión de Clientes" subtitle="Administra los clientes de las empresas">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{clientes.length}</div>
              <p className="text-xs text-white/60 mt-1">Clientes activos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Empresas Únicas</CardTitle>
              <Building2 className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{new Set(clientes.map((c) => c.id_empresa)).size}</div>
              <p className="text-xs text-white/60 mt-1">Con clientes asignados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Ejecutivas Asignadas</CardTitle>
              <UserCheck className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {new Set(clientes.map((c) => c.id_ejecutiva).filter(Boolean)).size}
              </div>
              <p className="text-xs text-white/60 mt-1">Gestionando clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Lista de Clientes</CardTitle>
                <CardDescription className="text-white/60">
                  Gestiona la información de todos los clientes
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <Button
                  onClick={openCreateDialog}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Cliente
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
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">RUC</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Contacto</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Dirección</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Empresa</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
                      <TableHead className="text-center font-semibold text-[#C7E196]">Estado</TableHead>
                      <TableHead className="text-center font-semibold text-[#C7E196]">Actividades</TableHead>
                      <TableHead className="text-center font-semibold text-[#C7E196]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-white/60">
                          {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-xs font-semibold">
                                {cliente.nombre_cliente?.charAt(0) || "?"}
                              </div>
                              <span className="font-medium">{`${cliente.nombre_cliente || ""} ${cliente.apellido_cliente || ""}`}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-sm font-mono">{cliente.rut_cliente}</TableCell>
                          <TableCell className="text-white/80 text-sm">
                            <div className="space-y-1">
                              <p>{cliente.email}</p>
                              {cliente.telefono && <p className="text-xs text-white/60">{cliente.telefono}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-sm max-w-xs">
                            {cliente.direccion ? (
                              <div className="flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-[#C7E196] mt-1 flex-shrink-0" />
                                <span className="line-clamp-2">{cliente.direccion}</span>
                              </div>
                            ) : (
                              <span className="text-white/40">No especificada</span>
                            )}
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">{cliente.nombre_empresa}</TableCell>
                          <TableCell className="text-white/80 text-sm">
                            {cliente.ejecutiva_nombre || <span className="text-white/40">Sin asignar</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                cliente.estado === "activo"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                              }
                            >
                              {cliente.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {cliente.total_actividades}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(cliente)}
                                className="text-[#C7E196] hover:text-white hover:bg-white/10"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(cliente.id_cliente)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Añadir Nuevo Cliente</DialogTitle>
              <DialogDescription className="text-white/60">
                Completa la información del nuevo cliente. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre_cliente" className="text-white/80">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre_cliente"
                    value={formData.nombre_cliente}
                    onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                    className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                    placeholder="Juan"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="apellido_cliente" className="text-white/80">
                    Apellido *
                  </Label>
                  <Input
                    id="apellido_cliente"
                    value={formData.apellido_cliente}
                    onChange={(e) => setFormData({ ...formData, apellido_cliente: e.target.value })}
                    className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rut_cliente" className="text-white/80">
                  RUT *
                </Label>
                <Input
                  id="rut_cliente"
                  value={formData.rut_cliente}
                  onChange={(e) => setFormData({ ...formData, rut_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196] font-mono"
                  placeholder="12.345.678-9"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email_cliente" className="text-white/80">
                  Email *
                </Label>
                <Input
                  id="email_cliente"
                  type="email"
                  value={formData.email_cliente}
                  onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="cliente@ejemplo.com"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white/80">
                  Contraseña *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono_cliente" className="text-white/80">
                  Teléfono
                </Label>
                <Input
                  id="telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={(e) => setFormData({ ...formData, telefono_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="direccion_cliente" className="text-white/80">
                  Dirección
                </Label>
                <Input
                  id="direccion_cliente"
                  value={formData.direccion_cliente}
                  onChange={(e) => setFormData({ ...formData, direccion_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Calle, número, comuna"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_empresa" className="text-white/80">
                  Empresa *
                </Label>
                <Select
                  value={formData.id_empresa}
                  onValueChange={(value) => setFormData({ ...formData, id_empresa: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
                        {empresa.nombre_empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_ejecutiva" className="text-white/80">
                  Ejecutiva Asignada
                </Label>
                <Select
                  value={formData.id_ejecutiva}
                  onValueChange={(value) => setFormData({ ...formData, id_ejecutiva: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Selecciona una ejecutiva (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin asignar</SelectItem>
                    {ejecutivas.map((ejecutiva) => (
                      <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
                        {ejecutiva.nombre} {ejecutiva.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setCreateDialogOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90">
                Crear Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Editar Cliente</DialogTitle>
              <DialogDescription className="text-white/60">Actualiza la información del cliente</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_nombre_cliente" className="text-white/80">
                  Nombre del Cliente
                </Label>
                <Input
                  id="edit_nombre_cliente"
                  value={formData.nombre_cliente}
                  onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_apellido_cliente" className="text-white/80">
                  Apellido del Cliente
                </Label>
                <Input
                  id="edit_apellido_cliente"
                  value={formData.apellido_cliente}
                  onChange={(e) => setFormData({ ...formData, apellido_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_rut_cliente" className="text-white/80">
                  RUT
                </Label>
                <Input
                  id="edit_rut_cliente"
                  value={formData.rut_cliente}
                  onChange={(e) => setFormData({ ...formData, rut_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196] font-mono"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_email_cliente" className="text-white/80">
                  Email
                </Label>
                <Input
                  id="edit_email_cliente"
                  type="email"
                  value={formData.email_cliente}
                  onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_telefono_cliente" className="text-white/80">
                  Teléfono
                </Label>
                <Input
                  id="edit_telefono_cliente"
                  value={formData.telefono_cliente}
                  onChange={(e) => setFormData({ ...formData, telefono_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_direccion_cliente" className="text-white/80">
                  Dirección
                </Label>
                <Input
                  id="edit_direccion_cliente"
                  value={formData.direccion_cliente}
                  onChange={(e) => setFormData({ ...formData, direccion_cliente: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_id_empresa" className="text-white/80">
                  Empresa
                </Label>
                <Select
                  value={formData.id_empresa}
                  onValueChange={(value) => setFormData({ ...formData, id_empresa: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id_empresa} value={empresa.id_empresa.toString()}>
                        {empresa.nombre_empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit_id_ejecutiva" className="text-white/80">
                  Ejecutiva Asignada
                </Label>
                <Select
                  value={formData.id_ejecutiva}
                  onValueChange={(value) => setFormData({ ...formData, id_ejecutiva: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sin asignar</SelectItem>
                    {ejecutivas.map((ejecutiva) => (
                      <SelectItem key={ejecutiva.id_usuario} value={ejecutiva.id_usuario.toString()}>
                        {ejecutiva.nombre} {ejecutiva.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#C7E196]" />
                  <h3 className="text-sm font-semibold text-[#C7E196]">Gestión de Contraseña</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm text-white/80">Contraseña Actual</p>
                      <p className="text-xs text-white/60 mt-1">Las contraseñas están encriptadas por seguridad</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Configurada</Badge>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="w-full bg-[#C7E196]/10 text-[#C7E196] hover:bg-[#C7E196]/20 border border-[#C7E196]/30"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generar Nueva Contraseña
                  </Button>

                  {showGeneratedPassword && generatedPassword && (
                    <div className="space-y-2 p-3 rounded bg-[#C7E196]/10 border border-[#C7E196]/30">
                      <Label className="text-[#C7E196] text-sm font-semibold">Nueva Contraseña Generada</Label>
                      <div className="flex gap-2">
                        <Input
                          value={generatedPassword}
                          readOnly
                          className="bg-white/10 border-white/20 text-white font-mono"
                        />
                        <Button
                          type="button"
                          onClick={handleCopyPassword}
                          size="sm"
                          className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-[#C7E196]/80">
                        ⚠️ Copia esta contraseña antes de guardar. No podrás verla después.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="edit_password" className="text-white/80">
                      O Ingresa una Contraseña Manual
                    </Label>
                    <Input
                      id="edit_password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        setShowGeneratedPassword(false)
                      }}
                      className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                      placeholder="Dejar vacío para no cambiar"
                    />
                    <p className="text-xs text-white/60">
                      Solo completa este campo si deseas cambiar la contraseña manualmente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setEditDialogOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}