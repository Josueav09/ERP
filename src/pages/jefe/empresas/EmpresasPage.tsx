import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  Activity,
  Plus,
  Pencil,
  Trash2,
  Search,
  UserPlus,
  X,
  FileText,
  User
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jefeService, Empresa, Ejecutiva } from "@/services/jefeService";

interface EjecutivaAsignada {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_asignacion?: string;
  activo?: boolean;
  total_empresas?: number;
}

export default function EmpresasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpresa, setCurrentEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState({
    nombre_empresa: "",
    rut: "",
    direccion: "",
    telefono: "",
    email_contacto: "",
  });

  const [isEjecutivasDialogOpen, setIsEjecutivasDialogOpen] = useState(false);
  const [currentEmpresaEjecutivas, setCurrentEmpresaEjecutivas] = useState<EjecutivaAsignada[]>([]);
  const [availableEjecutivas, setAvailableEjecutivas] = useState<Ejecutiva[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [loadingEjecutivas, setLoadingEjecutivas] = useState(false);

  const navItems = [
    { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
    { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
    { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
    { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
    { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
    { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
    { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
  ];

  useEffect(() => {
    if (!user || user.role !== "jefe") {
      navigate("/login");
      return;
    }
    fetchEmpresas();
  }, [user, navigate]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEjecutivasDialog = async (empresaId: number) => {
    setSelectedEmpresaId(empresaId);
    setLoadingEjecutivas(true);
    setIsEjecutivasDialogOpen(true);

    try {
      // Obtener ejecutivas de la empresa
      const empresaData = await jefeService.getEmpresaEjecutivas(empresaId);
      setCurrentEmpresaEjecutivas(empresaData.ejecutivas || []);

      // Obtener todas las ejecutivas disponibles
      const ejecutivasData = await jefeService.getEjecutivas();
      setAvailableEjecutivas(ejecutivasData);
    } catch (error) {
      console.error("Error fetching ejecutivas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ejecutivas",
        variant: "destructive",
      });
    } finally {
      setLoadingEjecutivas(false);
    }
  };

  const handleAddEjecutiva = async (ejecutivaId: number) => {
    if (!selectedEmpresaId) return;

    try {
      await jefeService.addEjecutivaToEmpresa(selectedEmpresaId, ejecutivaId);

      toast({
        title: "Éxito",
        description: "Ejecutiva agregada correctamente",
      });

      // Recargar ejecutivas de la empresa
      await handleOpenEjecutivasDialog(selectedEmpresaId);
      await fetchEmpresas();
    } catch (error: any) {
      console.error("Error adding ejecutiva:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar la ejecutiva",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEjecutiva = async (ejecutivaId: number) => {
    if (!selectedEmpresaId) return;

    if (!confirm("¿Estás seguro de que deseas quitar esta ejecutiva de la empresa?")) return;

    try {
      await jefeService.removeEjecutivaFromEmpresa(selectedEmpresaId, ejecutivaId);

      toast({
        title: "Éxito",
        description: "Ejecutiva removida correctamente",
      });

      // Recargar ejecutivas de la empresa
      await handleOpenEjecutivasDialog(selectedEmpresaId);
      await fetchEmpresas();
    } catch (error) {
      console.error("Error removing ejecutiva:", error);
      toast({
        title: "Error",
        description: "No se pudo quitar la ejecutiva",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (empresa?: Empresa) => {
    if (empresa) {
      setIsEditing(true);
      setCurrentEmpresa(empresa);
      setFormData({
        nombre_empresa: empresa.nombre_empresa || "",
        rut: empresa.rut || "",
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        email_contacto: empresa.email_contacto || "",
      });
    } else {
      setIsEditing(false);
      setCurrentEmpresa(null);
      setFormData({
        nombre_empresa: "",
        rut: "",
        direccion: "",
        telefono: "",
        email_contacto: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentEmpresa(null);
    setFormData({
      nombre_empresa: "",
      rut: "",
      direccion: "",
      telefono: "",
      email_contacto: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && currentEmpresa) {
        await jefeService.updateEmpresa(currentEmpresa.id_empresa, formData);
      } else {
        await jefeService.createEmpresa(formData);
      }

      toast({
        title: "Éxito",
        description: `Empresa ${isEditing ? "actualizada" : "creada"} correctamente`,
      });

      handleCloseDialog();
      fetchEmpresas();
    } catch (error) {
      console.error("Error saving empresa:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la empresa",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta empresa?")) return;

    try {
      await jefeService.deleteEmpresa(id);

      toast({
        title: "Éxito",
        description: "Empresa eliminada correctamente",
      });

      fetchEmpresas();
    } catch (error) {
      console.error("Error deleting empresa:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la empresa",
        variant: "destructive",
      });
    }
  };

  const handleToggleEstado = async (empresa: Empresa) => {
    const nuevoEstado = !empresa.activo;

    // Mostrar confirmación si se va a desactivar
    if (!nuevoEstado) {
      const confirmacion = confirm(
        `¿Estás seguro de que deseas desactivar la empresa "${empresa.nombre_empresa}"?\n\n` +
          `Esto también desactivará a todos los ${empresa.total_clientes} cliente(s) asociados a esta empresa.`,
      );
      if (!confirmacion) return;
    }

    try {
      await jefeService.toggleEmpresaEstado(empresa.id_empresa, nuevoEstado);

      toast({
        title: "Éxito",
        description: `Empresa ${nuevoEstado ? "activada" : "desactivada"} correctamente`,
      });

      fetchEmpresas();
    } catch (error: any) {
      console.error("Error toggling estado:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado de la empresa",
        variant: "destructive",
      });
    }
  };

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.email_contacto ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAvailableEjecutivas = availableEjecutivas.filter(
    (ejecutiva) =>
      !currentEmpresaEjecutivas.some((assigned) => assigned.id_usuario === ejecutiva.id_usuario && assigned.activo),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#013936] via-[#024a46] to-[#013936] flex items-center justify-center">
        <div className="text-white text-lg">Cargando empresas...</div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Gestión de Empresas" subtitle="Administra las empresas proveedoras">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Empresas</p>
                <p className="text-3xl font-bold text-white">{empresas.length}</p>
              </div>
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Building2 className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Ejecutivas</p>
                <p className="text-3xl font-bold text-white">
                  {empresas.reduce((acc, emp) => acc + Number.parseInt(emp.total_ejecutivas || "0"), 0)}
                </p>
              </div>
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Clientes</p>
                <p className="text-3xl font-bold text-white">
                  {empresas.reduce((acc, emp) => acc + Number.parseInt(emp.total_clientes || "0"), 0)}
                </p>
              </div>
              <div className="p-3 bg-[#C7E196]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#C7E196]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Buscar por nombre, RUT o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
              />
            </div>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Empresa
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-[#C7E196] font-semibold">Estado</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold">Empresa</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold">RUC</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold">Contacto</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold">Ejecutivas</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold">Clientes</TableHead>
                  <TableHead className="text-[#C7E196] font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmpresas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-white/60 py-8">
                      No se encontraron empresas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmpresas.map((empresa) => (
                    <TableRow key={empresa.id_empresa} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={empresa.activo}
                            onCheckedChange={() => handleToggleEstado(empresa)}
                            className="data-[state=checked]:bg-[#C7E196]"
                          />
                          <Badge
                            className={
                              empresa.activo
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {empresa.activo ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        <div>
                          <p className="font-semibold">{empresa.nombre_empresa}</p>
                          <p className="text-sm text-white/60">{empresa.direccion}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">{empresa.rut}</TableCell>
                      <TableCell className="text-white/80">
                        <div>
                          <p className="text-sm">{empresa.email_contacto}</p>
                          <p className="text-sm text-white/60">{empresa.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEjecutivasDialog(empresa.id_empresa)}
                          className="p-0 h-auto hover:bg-transparent"
                        >
                          <Badge className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30 hover:bg-[#C7E196]/30 cursor-pointer">
                            {empresa.total_ejecutivas} <UserPlus className="w-3 h-3 ml-1" />
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {empresa.total_clientes}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDialog(empresa)}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(empresa.id_empresa)}
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
        </Card>

        {/* Dialog for Create/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">{isEditing ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
              <DialogDescription className="text-white/60">
                {isEditing ? "Actualiza la información de la empresa" : "Completa los datos de la nueva empresa"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_empresa" className="text-white/80">
                    Nombre de la Empresa
                  </Label>
                  <Input
                    id="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rut" className="text-white/80">
                    RUC
                  </Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-white/80">
                    Dirección
                  </Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-white/80">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_contacto" className="text-white/80">
                    Email de Contacto
                  </Label>
                  <Input
                    id="email_contacto"
                    type="email"
                    value={formData.email_contacto}
                    onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseDialog}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium">
                  {isEditing ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEjecutivasDialogOpen} onOpenChange={setIsEjecutivasDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Gestionar Ejecutivas</DialogTitle>
              <DialogDescription className="text-white/60">Agrega o quita ejecutivas de esta empresa</DialogDescription>
            </DialogHeader>

            {loadingEjecutivas ? (
              <div className="py-8 text-center text-white/60">Cargando ejecutivas...</div>
            ) : (
              <div className="space-y-6 py-4">
                {/* Ejecutivas actuales */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Ejecutivas Asignadas ({currentEmpresaEjecutivas.filter((e) => e.activo).length})
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border border-white/20 bg-white/5 p-4">
                    {currentEmpresaEjecutivas.filter((e) => e.activo).length === 0 ? (
                      <p className="text-white/60 text-sm text-center py-4">
                        No hay ejecutivas asignadas a esta empresa
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {currentEmpresaEjecutivas.filter((e) => e.activo).map((ejecutiva) => (
                          <div
                            key={ejecutiva.id_usuario}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-white">
                                {ejecutiva.nombre} {ejecutiva.apellido}
                              </p>
                              <p className="text-sm text-white/60">{ejecutiva.email}</p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveEjecutiva(ejecutiva.id_usuario)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Ejecutivas disponibles */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Ejecutivas Disponibles ({filteredAvailableEjecutivas.length})
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border border-white/20 bg-white/5 p-4">
                    {filteredAvailableEjecutivas.length === 0 ? (
                      <p className="text-white/60 text-sm text-center py-4">
                        No hay ejecutivas disponibles para asignar
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {filteredAvailableEjecutivas.map((ejecutiva) => (
                          <div
                            key={ejecutiva.id_usuario}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-white">
                                {ejecutiva.nombre} {ejecutiva.apellido}
                              </p>
                              <p className="text-sm text-white/60">{ejecutiva.email}</p>
                              <p className="text-xs text-white/40 mt-1">
                                {ejecutiva.total_empresas} empresa(s) asignada(s)
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddEjecutiva(ejecutiva.id_usuario)}
                              className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agregar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsEjecutivasDialogOpen(false)}
                className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}