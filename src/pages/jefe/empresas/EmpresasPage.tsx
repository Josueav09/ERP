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
  Search,
  UserPlus,
  X,
  FileText,
  User,
  Filter,
  Eye,
  EyeOff,
  Key
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

interface FormErrors {
  nombre_empresa?: string;
  rut?: string;
  direccion?: string;
  telefono?: string;
  email_contacto?: string;
  contraseña?: string;
  confirmarContraseña?: string;
}

interface Filters {
  estado: 'todos' | 'activas' | 'inactivas';
  tamanio: 'todos' | 'Pequeña' | 'Mediana' | 'Grande';
  rubro: string;
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
    contraseña: "",
    confirmarContraseña: "",
    pagina_web: "",
    rubro: "",
    tamanio_empresa: "Mediana" as "Pequeña" | "Mediana" | "Grande"
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🎛️ Filtros avanzados
  const [filters, setFilters] = useState<Filters>({
    estado: 'todos',
    tamanio: 'todos',
    rubro: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // 📊 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEjecutivasDialogOpen, setIsEjecutivasDialogOpen] = useState(false);
  const [currentEmpresaEjecutivas, setCurrentEmpresaEjecutivas] = useState<EjecutivaAsignada[]>([]);
  const [availableEjecutivas, setAvailableEjecutivas] = useState<Ejecutiva[]>([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [loadingEjecutivas, setLoadingEjecutivas] = useState(false);

  // Diálogo de detalles
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedEmpresaDetails, setSelectedEmpresaDetails] = useState<Empresa | null>(null);

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

    fetchEmpresas();
    fetchEjecutivasDisponibles();
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

  const fetchEjecutivasDisponibles = async () => {
    try {

      // ✅ VALIDAR QUE selectedEmpresa NO SEA NULL
      if (!selectedEmpresaId || !selectedEmpresaId) {
        setAvailableEjecutivas([]);
        return;
      }

      const data = await jefeService.getEjecutivasDisponibles();
      setAvailableEjecutivas(data);
    } catch (error) {
      console.error('❌ [EmpresasPage] Error cargando ejecutivas disponibles:', error);
      setAvailableEjecutivas([]);
    }
  };


  // 🔒 Validación de formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre_empresa.trim()) {
      newErrors.nombre_empresa = "El nombre de la empresa es requerido";
    } else if (formData.nombre_empresa.trim().length < 2) {
      newErrors.nombre_empresa = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.rut.trim()) {
      newErrors.rut = "El RUC es requerido";
    } else if (!/^\d{11}$/.test(formData.rut)) {
      newErrors.rut = "El RUC debe tener exactamente 11 dígitos";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^[\d\s+\-()]{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono no es válido";
    }

    if (!formData.email_contacto.trim()) {
      newErrors.email_contacto = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contacto)) {
      newErrors.email_contacto = "El email no es válido";
    }

    // Validar contraseña solo al crear nueva empresa O cuando se ingrese una nueva en edición
    if (!isEditing) {
      // Validación para creación
      if (!formData.contraseña) {
        newErrors.contraseña = "La contraseña es requerida";
      } else if (formData.contraseña.length < 6) {
        newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contraseña)) {
        newErrors.contraseña = "La contraseña debe contener mayúsculas, minúsculas y números";
      }

      if (!formData.confirmarContraseña) {
        newErrors.confirmarContraseña = "Confirma la contraseña";
      } else if (formData.contraseña !== formData.confirmarContraseña) {
        newErrors.confirmarContraseña = "Las contraseñas no coinciden";
      }
    } else {
      // Validación para edición (solo si se ingresa nueva contraseña)
      if (formData.contraseña && formData.contraseña.length > 0) {
        if (formData.contraseña.length < 6) {
          newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contraseña)) {
          newErrors.contraseña = "La contraseña debe contener mayúsculas, minúsculas y números";
        }

        if (!formData.confirmarContraseña) {
          newErrors.confirmarContraseña = "Confirma la nueva contraseña";
        } else if (formData.contraseña !== formData.confirmarContraseña) {
          newErrors.confirmarContraseña = "Las contraseñas no coinciden";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // En el método handleOpenEjecutivasDialog
  const handleOpenEjecutivasDialog = async (empresaId: number) => {
    setSelectedEmpresaId(empresaId);
    setLoadingEjecutivas(true);
    setIsEjecutivasDialogOpen(true);

    try {

      // ✅ Cargar ejecutivas asignadas
      const empresaData = await jefeService.getEmpresaEjecutivas(empresaId);
      setCurrentEmpresaEjecutivas(empresaData.ejecutivas || []);

      // ✅ Cargar ejecutivas disponibles (NUEVO MÉTODO SIMPLE)
      const ejecutivasDisponibles = await jefeService.getEjecutivasDisponibles();
      setAvailableEjecutivas(ejecutivasDisponibles);

    } catch (error: any) {
      console.error("❌ [EmpresasPage] Error:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las ejecutivas",
        variant: "destructive",
      });
    } finally {
      setLoadingEjecutivas(false);
    }
  };

  // Prueba con este código que incluye ambos
const handleAddEjecutiva = async (ejecutivaId: number) => {
  try {
    await jefeService.addEjecutivaToEmpresa(selectedEmpresaId!, ejecutivaId);
    toast({ title: "✅ Éxito", description: "Ejecutiva asignada" });
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message;
    
    // Forzar ambos métodos
    alert(`IMPORTANTE: ${errorMsg} . ELIGE OTRA EJECUTIVA O DESVINCULA LA EJECUTIVA PARA SELECCIONARLA`);
    toast({ 
      title: "❌ TOAST Error", 
      description: errorMsg,
      variant: "destructive" 
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
        contraseña: "", // Vacío en edición - opcional
        confirmarContraseña: "", // Vacío en edición - opcional
        pagina_web: empresa.pagina_web || "",
        rubro: empresa.rubro || "",
        tamanio_empresa: (empresa.tamanio_empresa as "Pequeña" | "Mediana" | "Grande") || "Mediana"
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
        contraseña: "",
        confirmarContraseña: "",
        pagina_web: "",
        rubro: "",
        tamanio_empresa: "Mediana"
      });
    }
    setErrors({});
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
      contraseña: "",
      confirmarContraseña: "",
      pagina_web: "",
      rubro: "",
      tamanio_empresa: "Mediana"
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Preparar datos para enviar
      const empresaData: any = {
        nombre_empresa: formData.nombre_empresa,
        rut: formData.rut,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email_contacto: formData.email_contacto,
        pagina_web: formData.pagina_web,
        rubro: formData.rubro,
        tamanio_empresa: formData.tamanio_empresa
      };

      // Solo incluir contraseña si se proporcionó una nueva
      if (formData.contraseña && formData.contraseña.length > 0) {
        empresaData.contraseña = formData.contraseña;
      }

      if (isEditing && currentEmpresa) {
        await jefeService.updateEmpresa(currentEmpresa.id_empresa, empresaData);
      } else {
        await jefeService.createEmpresa(empresaData);
      }

      toast({
        title: "Éxito",
        description: `Empresa ${isEditing ? "actualizada" : "creada"} correctamente${formData.contraseña ? ' con nueva contraseña' : ''}`,
      });

      handleCloseDialog();
      fetchEmpresas();
    } catch (error: any) {
      console.error("Error saving empresa:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la empresa",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // En EmpresasPage.tsx - MEJORAR handleToggleEstado
const handleToggleEstado = async (empresa: Empresa) => {
  const nuevoEstado = !empresa.activo;
  const accion = nuevoEstado ? "activar" : "desactivar";

  const confirmacion = confirm(
    `¿Estás seguro de que deseas ${accion.toUpperCase()} la empresa "${empresa.nombre_empresa}"?\n\n` +
    `Esto también ${nuevoEstado ? "activará" : "desactivará"} todos los clientes asociados.`
  );

  if (!confirmacion) return;

  try {
    await jefeService.toggleEmpresaEstado(empresa.id_empresa, nuevoEstado);
    
    toast({
      title: "✅ Éxito",
      description: `Empresa ${accion}ada correctamente. Los clientes asociados han sido ${accion}ados.`,
      duration: 5000,
    });
    
    fetchEmpresas();
    
  } catch (error: any) {
    console.error("❌ [Frontend] Error cambiando estado:", error);
    
    // ✅ EXTRAER MENSAJE DE ERROR DETALLADO
    let errorMessage = "Error al cambiar estado de la empresa";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    
    toast({
      title: "❌ Error",
      description: errorMessage,
      variant: "destructive",
      duration: 8000, // Más tiempo para leer el error
    });
    
    // ✅ También mostrar alert para asegurar que se vea
    alert(`❌ Error: ${errorMessage}`);
  }
};
  const handleViewDetails = (empresa: Empresa) => {
    setSelectedEmpresaDetails(empresa);
    setIsDetailsDialogOpen(true);
  };


  // 🎛️ Filtrado avanzado
  const filteredEmpresas = empresas.filter((empresa) => {
    const matchesSearch =
      (empresa.nombre_empresa || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.rut || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (empresa.email_contacto || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado =
      filters.estado === 'todos' ||
      (filters.estado === 'activas' && empresa.activo) ||
      (filters.estado === 'inactivas' && !empresa.activo);

    const matchesTamanio =
      filters.tamanio === 'todos' ||
      empresa.tamanio_empresa === filters.tamanio;

    const matchesRubro =
      !filters.rubro ||
      (empresa.rubro || "").toLowerCase().includes(filters.rubro.toLowerCase());

    return matchesSearch && matchesEstado && matchesTamanio && matchesRubro;
  });

  // 📊 Paginación
  const paginatedEmpresas = filteredEmpresas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredAvailableEjecutivas = availableEjecutivas.filter(
    (ejecutiva) =>
      !currentEmpresaEjecutivas.some((assigned) => assigned.id_usuario === ejecutiva.id_usuario && assigned.activo),
  );

  // Obtener rubros únicos para el filtro
  const uniqueRubros = Array.from(new Set(empresas.map(emp => emp.rubro).filter(Boolean))) as string[];

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

        {/* Search, Filters and Actions */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Buscar por nombre, RUT o email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Empresa
                </Button>

              </div>
            </div>

            {/* 🎛️ Filtros avanzados */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Estado</Label>
                  <select
                    value={filters.estado}
                    onChange={(e) => {
                      setFilters({ ...filters, estado: e.target.value as any });
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-[#C7E196] focus:outline-none text-sm"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="activas">Solo activas</option>
                    <option value="inactivas">Solo inactivas</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Tamaño</Label>
                  <select
                    value={filters.tamanio}
                    onChange={(e) => {
                      setFilters({ ...filters, tamanio: e.target.value as any });
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-[#C7E196] focus:outline-none text-sm"
                  >
                    <option value="todos">Todos los tamaños</option>
                    <option value="Pequeña">Pequeña</option>
                    <option value="Mediana">Mediana</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80 text-sm">Rubro</Label>
                  <select
                    value={filters.rubro}
                    onChange={(e) => {
                      setFilters({ ...filters, rubro: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-[#C7E196] focus:outline-none text-sm"
                  >
                    <option value="">Todos los rubros</option>
                    {uniqueRubros.map((rubro) => (
                      <option key={rubro} value={rubro}>{rubro}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow key="table-header" className="border-white/10 hover:bg-transparent  ">
                  <TableHead className="text-white font-semibold pl-10 pb-4 ">Estado</TableHead>
                  <TableHead className="text-white font-semibold pb-4">Empresa</TableHead>
                  <TableHead className="text-white font-semibold pb-4">RUC</TableHead>
                  <TableHead className="text-white font-semibold pb-4">Contacto</TableHead>
                  <TableHead className="text-white font-semibold pb-4">Ejecutivas</TableHead>
                  <TableHead className="text-white font-semibold pb-4">Clientes</TableHead>
                  <TableHead className="text-white font-semibold text-right pr-10 pb-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmpresas.length === 0 ? (
                  <TableRow key="no-results">
                    <TableCell colSpan={7} className="text-center text-white/60 py-8 ">
                      {filteredEmpresas.length === 0 ? "No se encontraron empresas" : "No hay resultados para los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmpresas.map((empresa) => (
                    <TableRow
                      key={`empresa-${empresa.id_empresa}`}
                      className="border-white/10 hover:bg-white/5 "
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 pl-3">
                          <Switch
                            checked={empresa.activo}
                            onCheckedChange={() => handleToggleEstado(empresa)}
                            className="data-[state=checked]:bg-[#C7E196]"
                          />
                          <Badge
                            className={
                              empresa.activo
                                ? "bg-[#012826] text-012826 border-[#012826]"
                                : "bg-[#FF0000] text-red-500 border-[#FF0000]"
                            }
                          >
                            {empresa.activo ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white pt-5">
                        <div>
                          <p className="font-semibold">{empresa.nombre_empresa || "Sin nombre"}</p>
                          <p className="text-sm text-white/60">{empresa.direccion || "Sin dirección"}</p>
                          {empresa.rubro && (
                            <Badge
                              variant="outline"
                              className="mt-1 bg-blue-500/10 text-white/60 border-blue-500/20 text-xs"
                            >
                              {empresa.rubro}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">{empresa.rut || "Sin RUC"}</TableCell>
                      <TableCell className="text-white/80">
                        <div>
                          <p className="text-sm">{empresa.email_contacto || "Sin email"}</p>
                          <p className="text-sm text-white/60">{empresa.telefono || "Sin teléfono"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEjecutivasDialog(empresa.id_empresa)}
                          className="p-0 h-auto hover:bg-transparent"
                        >
                          <Badge className="bg-[#C7E196]/20 text-[#012826] border-[#C7E196]/30 hover:bg-[#C7E196]/30 cursor-pointer">
                            {empresa.total_ejecutivas || "0"} <UserPlus className="w-3 h-3 ml-1" />
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell className="!pl-6">
                        <Badge className="bg-blue-500/20 text-[#012826] border-blue-500/30">
                          {empresa.total_clientes || "0"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 pr-6">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDialog(empresa)}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                            title="Editar empresa"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleViewDetails(empresa)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>


                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 📊 Paginación */}
          {filteredEmpresas.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-white/10">
              <div className="text-white/60 text-sm">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredEmpresas.length)} de {filteredEmpresas.length} empresas
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-500/30 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                    } disabled:opacity-50`}
                >
                  Anterior
                </Button>


                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
                            : "text-white border-white/20 hover:bg-white/10"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-500/30 text-white" : "bg-gray-700 text-white hover:bg-gray-600"
                    } disabled:opacity-50`}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Dialog for Create/Edit - VERSIÓN CORREGIDA */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">{isEditing ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
              <DialogDescription className="text-white/60">
                {isEditing ? "Actualiza la información de la empresa" : "Completa los datos de la nueva empresa"}
              </DialogDescription>
            </DialogHeader>

            {/* ScrollArea que funciona correctamente */}
            <ScrollArea className="h-[70vh] pr-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_empresa" className="text-white/80">
                      Nombre de la Empresa *
                    </Label>
                    <Input
                      id="nombre_empresa"
                      value={formData.nombre_empresa}
                      onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    />
                    {errors.nombre_empresa && (
                      <p className="text-red-400 text-sm">{errors.nombre_empresa}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rut" className="text-white/80">
                      RUC *
                    </Label>
                    <Input
                      id="rut"
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    />
                    {errors.rut && (
                      <p className="text-red-400 text-sm">{errors.rut}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="text-white/80">
                      Dirección *
                    </Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    />
                    {errors.direccion && (
                      <p className="text-red-400 text-sm">{errors.direccion}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-white/80">
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                      />
                      {errors.telefono && (
                        <p className="text-red-400 text-sm">{errors.telefono}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tamanio_empresa" className="text-white/80">
                        Tamaño de Empresa
                      </Label>
                      <select
                        id="tamanio_empresa"
                        value={formData.tamanio_empresa}
                        onChange={(e) => setFormData({ ...formData, tamanio_empresa: e.target.value as any })}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-[#C7E196] focus:outline-none"
                      >
                        <option value="Pequeña">Pequeña</option>
                        <option value="Mediana">Mediana</option>
                        <option value="Grande">Grande</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email_contacto" className="text-white/80">
                      Email de Contacto *
                    </Label>
                    <Input
                      id="email_contacto"
                      type="email"
                      value={formData.email_contacto}
                      onChange={(e) => setFormData({ ...formData, email_contacto: e.target.value })}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    />
                    {errors.email_contacto && (
                      <p className="text-red-400 text-sm">{errors.email_contacto}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pagina_web" className="text-white/80">
                        Página Web
                      </Label>
                      <Input
                        id="pagina_web"
                        value={formData.pagina_web}
                        onChange={(e) => setFormData({ ...formData, pagina_web: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rubro" className="text-white/80">
                        Rubro
                      </Label>
                      <Input
                        id="rubro"
                        value={formData.rubro}
                        onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                      />
                    </div>
                  </div>

                  {/* 🔑 Campos de contraseña */}
                  <div className={`pt-4 ${isEditing ? 'border-t border-white/10' : ''}`}>
                    {isEditing && (
                      <div className="mb-4">
                        <h4 className="text-[#C7E196] text-sm font-medium flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Cambiar Contraseña (Opcional)
                        </h4>
                        <p className="text-white/60 text-xs mt-1">
                          Completa solo si deseas cambiar la contraseña. Si dejas vacío, se mantendrá la contraseña actual.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="contraseña" className="text-white/80">
                        {isEditing ? "Nueva Contraseña" : "Contraseña *"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="contraseña"
                          type={showPassword ? "text" : "password"}
                          value={formData.contraseña}
                          onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196] pr-10"
                          placeholder={isEditing ? "Dejar vacío para no cambiar" : "Ingresa la contraseña"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.contraseña && (
                        <p className="text-red-400 text-sm">{errors.contraseña}</p>
                      )}
                      {isEditing && formData.contraseña && (
                        <p className="text-green-400 text-xs">✓ Nueva contraseña configurada</p>
                      )}
                    </div>

                    {(formData.contraseña || !isEditing) && (
                      <div className="space-y-2 mt-3">
                        <Label htmlFor="confirmarContraseña" className="text-white/80">
                          {isEditing ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña *"}
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmarContraseña"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmarContraseña}
                            onChange={(e) => setFormData({ ...formData, confirmarContraseña: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196] pr-10"
                            placeholder={isEditing ? "Confirma la nueva contraseña" : "Confirma la contraseña"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                        {errors.confirmarContraseña && (
                          <p className="text-red-400 text-sm">{errors.confirmarContraseña}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="pt-4 mt-4 border-t border-white/10">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseDialog}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
                    disabled={submitting}
                  >
                    {submitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Gestión de Ejecutivas */}
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
                          <div key={ejecutiva.id_usuario} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
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

                {/* Ejecutivas disponibles - VERSIÓN CORREGIDA */}
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
                          <div key={ejecutiva.id_usuario} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div>
                              <p className="font-medium text-white">
                                {/* Mostrar nombre completo correctamente */}
                                {ejecutiva.nombre_completo || `${ejecutiva.nombre || ''} ${ejecutiva.apellido || ''}`.trim()}
                              </p>
                              <p className="text-sm text-white/60">{ejecutiva.email}</p>
                              <p className="text-xs text-white/40 mt-1">
                                {ejecutiva.total_empresas || 0} empresa(s) asignada(s)
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

        {/* Diálogo de Detalles de Empresa */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Detalles de Empresa</DialogTitle>
              <DialogDescription className="text-white/60">
                Información completa de la empresa
              </DialogDescription>
            </DialogHeader>

            {selectedEmpresaDetails && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6 py-4 pr-6">
                  {/* Información Básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Nombre de la Empresa</Label>
                        <p className="text-white text-lg font-semibold mt-1">
                          {selectedEmpresaDetails.nombre_empresa || "No especificado"}
                        </p>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">RUC</Label>
                        <p className="text-white mt-1">{selectedEmpresaDetails.rut || "No especificado"}</p>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Estado</Label>
                        <Badge className={
                          selectedEmpresaDetails.activo
                            ? "bg-green-500/20 text-green-300 border-green-500/30 mt-1"
                            : "bg-red-500/20 text-red-300 border-red-500/30 mt-1"
                        }>
                          {selectedEmpresaDetails.activo ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Tamaño de Empresa</Label>
                        <p className="text-white mt-1">{selectedEmpresaDetails.tamanio_empresa || "No especificado"}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Email de Contacto</Label>
                        <p className="text-white mt-1">{selectedEmpresaDetails.email_contacto || "No especificado"}</p>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Teléfono</Label>
                        <p className="text-white mt-1">{selectedEmpresaDetails.telefono || "No especificado"}</p>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Rubro</Label>
                        <p className="text-white mt-1">{selectedEmpresaDetails.rubro || "No especificado"}</p>
                      </div>

                      <div>
                        <Label className="text-[#C7E196] text-sm font-medium">Página Web</Label>
                        <p className="text-white mt-1">
                          {selectedEmpresaDetails.pagina_web ? (
                            <a
                              href={selectedEmpresaDetails.pagina_web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#C7E196] hover:underline"
                            >
                              {selectedEmpresaDetails.pagina_web}
                            </a>
                          ) : "No especificado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <Label className="text-[#C7E196] text-sm font-medium">Dirección</Label>
                    <p className="text-white mt-1">{selectedEmpresaDetails.direccion || "No especificado"}</p>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <Label className="text-[#C7E196] text-sm font-medium">Ejecutivas Asignadas</Label>
                      <p className="text-2xl font-bold text-white mt-2">
                        {selectedEmpresaDetails.total_ejecutivas || "0"}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <Label className="text-[#C7E196] text-sm font-medium">Total Clientes</Label>
                      <p className="text-2xl font-bold text-white mt-2">
                        {selectedEmpresaDetails.total_clientes || "0"}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <Label className="text-[#C7E196] text-sm font-medium">Fecha de Creación</Label>
                      <p className="text-white mt-2">
                        {selectedEmpresaDetails.fecha_creacion
                          ? new Date(selectedEmpresaDetails.fecha_creacion).toLocaleDateString('es-ES')
                          : "No disponible"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  {(selectedEmpresaDetails.pais || selectedEmpresaDetails.departamento || selectedEmpresaDetails.provincia) && (
                    <div className="pt-4 border-t border-white/10">
                      <Label className="text-[#C7E196] text-sm font-medium mb-3 block">Ubicación</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedEmpresaDetails.pais && (
                          <div>
                            <Label className="text-white/60 text-xs">País</Label>
                            <p className="text-white">{selectedEmpresaDetails.pais}</p>
                          </div>
                        )}
                        {selectedEmpresaDetails.departamento && (
                          <div>
                            <Label className="text-white/60 text-xs">Departamento</Label>
                            <p className="text-white">{selectedEmpresaDetails.departamento}</p>
                          </div>
                        )}
                        {selectedEmpresaDetails.provincia && (
                          <div>
                            <Label className="text-white/60 text-xs">Provincia</Label>
                            <p className="text-white">{selectedEmpresaDetails.provincia}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información de Contacto Adicional */}
                  {(selectedEmpresaDetails.linkedin || selectedEmpresaDetails.grupo_economico) && (
                    <div className="pt-4 border-t border-white/10">
                      <Label className="text-[#C7E196] text-sm font-medium mb-3 block">Información Adicional</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEmpresaDetails.linkedin && (
                          <div>
                            <Label className="text-white/60 text-xs">LinkedIn</Label>
                            <p className="text-white">
                              <a
                                href={selectedEmpresaDetails.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#C7E196] hover:underline"
                              >
                                {selectedEmpresaDetails.linkedin}
                              </a>
                            </p>
                          </div>
                        )}
                        {selectedEmpresaDetails.grupo_economico && (
                          <div>
                            <Label className="text-white/60 text-xs">Grupo Económico</Label>
                            <p className="text-white">{selectedEmpresaDetails.grupo_economico}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setIsDetailsDialogOpen(false)}
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