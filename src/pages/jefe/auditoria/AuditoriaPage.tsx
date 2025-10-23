// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { LayoutDashboard, Building2, UserCheck, Users, Activity, Search, FileText, AlertCircle, User } from "lucide-react";
// import { useToast } from "@/hooks/useToast";
// import { jefeService, AuditoriaRecord } from "@/services/jefeService";

// const navItems = [
//   { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
//   { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
//   { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
//   { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
//   { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
//   { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
//   { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
// ];

// export default function AuditoriaPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [auditorias, setAuditorias] = useState<AuditoriaRecord[]>([]);
//   const [filteredAuditorias, setFilteredAuditorias] = useState<AuditoriaRecord[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterAccion, setFilterAccion] = useState<string>("todas");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log('📍 JefeDashboard - User context:', user);

//     // ✅ SOLUCIÓN: Verificar tanto contexto como localStorage
//     const storedUser = localStorage.getItem('user');
//     const token = sessionStorage.getItem('token');

//     console.log('📍 JefeDashboard - Stored user:', storedUser);
//     console.log('📍 JefeDashboard - Token:', token);

//     // ✅ PERMITIR acceso si hay token, incluso si el contexto no se actualizó aún
//     if (!user && !storedUser) {
//       console.log('❌ JefeDashboard: Sin usuario en contexto ni storage, redirigiendo...');
//       navigate("/login");
//       return;
//     }

//     // ✅ Usar el usuario del contexto O del localStorage
//     const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

//     if (!currentUser) {
//       console.log('❌ JefeDashboard: No se pudo obtener usuario, redirigiendo...');
//       navigate("/login");
//       return;
//     }

//     const allowedRoles = ["jefe", "Jefe", "Administrador"];
//     if (!allowedRoles.includes(currentUser.role)) {
//       console.log('❌ JefeDashboard: Rol no permitido:', currentUser.role);
//       navigate("/login");
//       return;
//     }

//     console.log('✅ JefeDashboard: Acceso permitido para:', currentUser.role);
//     console.log('✅ JefeDashboard: Fuente del usuario:', user ? 'contexto' : 'localStorage');
//     fetchAuditorias();
//   }, [user, navigate]);

//   useEffect(() => {
//     let filtered = auditorias;

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (auditoria) =>
//           auditoria.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           auditoria.rut_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           auditoria.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (auditoria.detalles && auditoria.detalles.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (auditoria.ejecutiva_nombre && auditoria.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (auditoria.responsable_nombre &&
//             auditoria.responsable_nombre.toLowerCase().includes(searchTerm.toLowerCase())),
//       );
//     }

//     // Filter by action type
//     if (filterAccion !== "todas") {
//       filtered = filtered.filter((auditoria) => auditoria.accion === filterAccion);
//     }

//     setFilteredAuditorias(filtered);
//   }, [searchTerm, filterAccion, auditorias]);

//   const fetchAuditorias = async () => {
//     try {
//       setLoading(true);
//       const data = await jefeService.getAuditoria();
//       setAuditorias(data);
//       setFilteredAuditorias(data);
//     } catch (error) {
//       console.error("Error fetching auditorias:", error);
//       toast({
//         title: "Error",
//         description: "No se pudo cargar el registro de auditoría",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAccionBadge = (accion: string) => {
//     const accionLower = accion.toLowerCase();
//     if (accionLower.includes("desactivar") || accionLower.includes("deshabilitar")) {
//       return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{accion}</Badge>;
//     }
//     if (accionLower.includes("activar") || accionLower.includes("habilitar")) {
//       return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{accion}</Badge>;
//     }
//     if (accionLower.includes("modificar") || accionLower.includes("actualizar")) {
//       return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{accion}</Badge>;
//     }
//     return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{accion}</Badge>;
//   };

//   const uniqueAcciones = Array.from(new Set(auditorias.map((a) => a.accion)));

//   return (
//     <DashboardLayout navItems={navItems} title="Auditoría de Contratos" subtitle="Registro de cambios y acciones">
//       <div className="space-y-6">
//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Total Registros</CardTitle>
//               <FileText className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{auditorias.length}</div>
//               <p className="text-xs text-white/60 mt-1">Acciones registradas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Clientes Afectados</CardTitle>
//               <Users className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{new Set(auditorias.map((a) => a.id_cliente)).size}</div>
//               <p className="text-xs text-white/60 mt-1">Clientes únicos</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Tipos de Acciones</CardTitle>
//               <AlertCircle className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{uniqueAcciones.length}</div>
//               <p className="text-xs text-white/60 mt-1">Acciones diferentes</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Audit Log Table */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="text-white">Registro de Auditoría</CardTitle>
//                 <CardDescription className="text-white/60">
//                   Historial completo de cambios en clientes y empresas
//                 </CardDescription>
//               </div>
//               <div className="flex flex-col gap-2 sm:flex-row">
//                 <div className="relative w-full sm:w-64">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                   <Input
//                     placeholder="Buscar en auditoría..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <Select value={filterAccion} onValueChange={setFilterAccion}>
//                   <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
//                     <SelectValue placeholder="Filtrar por acción" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="todas">Todas las acciones</SelectItem>
//                     {uniqueAcciones.map((accion) => (
//                       <SelectItem key={accion} value={accion}>
//                         {accion}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
//               </div>
//             ) : (
//               <div className="rounded-md border border-white/10 overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="border-white/10 hover:bg-transparent">
//                       <TableHead className="font-semibold text-[#C7E196]">Fecha</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">RUT</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Acción</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Detalles</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Responsable</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredAuditorias.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center py-8 text-white/60">
//                           {searchTerm || filterAccion !== "todas"
//                             ? "No se encontraron registros"
//                             : "No hay registros de auditoría"}
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredAuditorias.map((auditoria) => (
//                         <TableRow key={auditoria.id_auditoria} className="border-white/10 hover:bg-white/5">
//                           <TableCell className="text-white/80 text-sm">
//                             {new Date(auditoria.fecha_accion).toLocaleString("es-CL", {
//                               year: "numeric",
//                               month: "2-digit",
//                               day: "2-digit",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </TableCell>
//                           <TableCell className="text-white font-medium">{auditoria.nombre_cliente}</TableCell>
//                           <TableCell className="text-white/80 text-sm font-mono">{auditoria.rut_cliente}</TableCell>
//                           <TableCell>{getAccionBadge(auditoria.accion)}</TableCell>
//                           <TableCell className="text-white/80 text-sm max-w-xs">
//                             {auditoria.detalles ? (
//                               <span className="line-clamp-2">{auditoria.detalles}</span>
//                             ) : (
//                               <span className="text-white/40">Sin detalles</span>
//                             )}
//                           </TableCell>
//                           <TableCell className="text-white/80 text-sm">
//                             {auditoria.ejecutiva_nombre || <span className="text-white/40">N/A</span>}
//                           </TableCell>
//                           <TableCell className="text-white/80 text-sm">
//                             {auditoria.responsable_nombre || <span className="text-white/40">Sistema</span>}
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// } 

// pages/AuditoriaPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, UserCheck, Users, Activity, Search, FileText, AlertCircle, User, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { auditoriaService, AuditoriaRecord, AuditoriaStats } from "@/services/auditoriaService";

const navItems = [
  { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
  { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
  { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
  { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
  { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
  { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
];

export default function AuditoriaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [auditorias, setAuditorias] = useState<AuditoriaRecord[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<AuditoriaRecord[]>([]);
  const [stats, setStats] = useState<AuditoriaStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAccion, setFilterAccion] = useState<string>("todas");
  const [filterUsuario, setFilterUsuario] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  useEffect(() => {
    console.log('📍 AuditoriaPage - Verificando autenticación...');

    const storedUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!user && !storedUser) {
      console.log('❌ AuditoriaPage: Sin usuario, redirigiendo...');
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
      console.log('❌ AuditoriaPage: Rol no permitido:', currentUser.role);
      navigate("/login");
      return;
    }

    console.log('✅ AuditoriaPage: Acceso permitido');
    fetchAuditoriaData();
  }, [user, navigate]);

  useEffect(() => {
    filterAuditorias();
  }, [searchTerm, filterAccion, filterUsuario, auditorias]);

  // const fetchAuditoriaData = async () => {
  //   try {
  //     setLoading(true);

  //     const [auditoriaData, statsData] = await Promise.all([
  //       auditoriaService.getAuditoria(),
  //       auditoriaService.getEstadisticas()
  //     ]);

  //     setAuditorias(auditoriaData);
  //     setFilteredAuditorias(auditoriaData);
  //     setStats(statsData);

  //     console.log('✅ Datos de auditoría cargados:', auditoriaData.length, 'registros');
  //   } catch (error) {
  //     console.error("Error fetching auditoria data:", error);
  //     toast({
  //       title: "Error",
  //       description: "No se pudo cargar el registro de auditoría",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // En tu AuditoriaPage.tsx - actualizar fetchAuditoriaData
  const fetchAuditoriaData = async () => {
    try {
      setLoading(true);

      // ✅ Cargar auditoría y estadísticas en paralelo
      const [auditoriaData, statsData] = await Promise.all([
        auditoriaService.getAuditoria(),
        auditoriaService.getEstadisticas()
      ]);

      setAuditorias(auditoriaData);
      setFilteredAuditorias(auditoriaData);
      setStats(statsData);

      console.log('✅ Datos de auditoría cargados:', auditoriaData.length, 'registros');

      toast({
        title: "Datos cargados",
        description: `${auditoriaData.length} registros de auditoría cargados`,
      });

    } catch (error) {
      console.error("Error fetching auditoria data:", error);

      // ✅ Cargar datos de prueba en caso de error
      const datosPrueba = auditoriaService.getDatosPrueba();
      setAuditorias(datosPrueba);
      setFilteredAuditorias(datosPrueba);

      toast({
        title: "Usando datos de demostración",
        description: "Los datos reales de auditoría no están disponibles",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAuditorias = () => {
    let filtered = auditorias;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auditoria) =>
          (auditoria.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (auditoria.empresa_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (auditoria.ejecutiva_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          auditoria.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auditoria.detalles.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auditoria.usuario_responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by action type
    if (filterAccion !== "todas") {
      filtered = filtered.filter((auditoria) => auditoria.accion === filterAccion);
    }

    // Filter by user
    if (filterUsuario !== "todos") {
      filtered = filtered.filter((auditoria) => auditoria.usuario_responsable === filterUsuario);
    }

    setFilteredAuditorias(filtered);
  };

  // const aplicarFiltrosFecha = async () => {
  //   try {
  //     setLoading(true);
  //     const filters: any = {};
  //     if (fechaInicio) filters.fechaInicio = fechaInicio;
  //     if (fechaFin) filters.fechaFin = fechaFin;

  //     const data = await auditoriaService.getAuditoria(filters);
  //     setAuditorias(data);
  //     toast({
  //       title: "Filtros aplicados",
  //       description: `Se encontraron ${data.length} registros`,
  //     });
  //   } catch (error) {
  //     console.error("Error aplicando filtros:", error);
  //     toast({
  //       title: "Error",
  //       description: "No se pudieron aplicar los filtros",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const aplicarFiltrosFecha = async () => {
    try {
      setLoading(true);

      const filters: any = {};
      if (fechaInicio) filters.fechaInicio = fechaInicio;
      if (fechaFin) filters.fechaFin = fechaFin;

      // ✅ USAR EL MÉTODO CON FILTROS
      const data = await auditoriaService.getAuditoria(filters);
      setAuditorias(data);
      setFilteredAuditorias(data);

      toast({
        title: "Filtros aplicados",
        description: `Se encontraron ${data.length} registros`,
      });
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      toast({
        title: "Error",
        description: "No se pudieron aplicar los filtros",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = async () => {
    setFechaInicio("");
    setFechaFin("");
    setSearchTerm("");
    setFilterAccion("todas");
    setFilterUsuario("todos");
    await fetchAuditoriaData();
  };

  const getAccionBadge = (accion: string) => {
    const accionLower = accion.toLowerCase();

    if (accionLower.includes('crear') || accionLower.includes('nuevo') || accionLower.includes('activar')) {
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{accion}</Badge>;
    }
    if (accionLower.includes('eliminar') || accionLower.includes('desactivar') || accionLower.includes('deshabilitar')) {
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{accion}</Badge>;
    }
    if (accionLower.includes('modificar') || accionLower.includes('actualizar') || accionLower.includes('cambiar')) {
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{accion}</Badge>;
    }
    if (accionLower.includes('reasignar') || accionLower.includes('transferir')) {
      return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{accion}</Badge>;
    }

    return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{accion}</Badge>;
  };

  const getEntidadAfectada = (auditoria: AuditoriaRecord) => {
    if (auditoria.empresa_nombre) return `Empresa: ${auditoria.empresa_nombre}`;
    if (auditoria.cliente_nombre) return `Cliente: ${auditoria.cliente_nombre}`;
    if (auditoria.ejecutiva_nombre) return `Ejecutiva: ${auditoria.ejecutiva_nombre}`;
    return "Sistema";
  };

  const uniqueAcciones = auditoriaService.getAccionesUnicas(auditorias);
  const uniqueUsuarios = auditoriaService.getUsuariosUnicos(auditorias);

  return (
    <DashboardLayout navItems={navItems} title="Auditoría del Sistema" subtitle="Registro completo de cambios y acciones">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Registros</CardTitle>
              <FileText className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.total_registros || auditorias.length}</div>
              <p className="text-xs text-white/60 mt-1">Acciones registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Tipos de Acciones</CardTitle>
              <AlertCircle className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{uniqueAcciones.length}</div>
              <p className="text-xs text-white/60 mt-1">Acciones diferentes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Usuarios Activos</CardTitle>
              <User className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{uniqueUsuarios.length}</div>
              <p className="text-xs text-white/60 mt-1">Usuarios únicos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Acción Más Común</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white truncate">
                {stats?.resumen?.accion_mas_comun || 'N/A'}
              </div>
              <p className="text-xs text-white/60 mt-1">Frecuencia</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros Avanzados */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#C7E196]" />
              <CardTitle className="text-white">Filtros Avanzados</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Filtra por fechas específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label className="text-sm text-white/80 mb-2 block">Fecha Inicio</label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-white/80 mb-2 block">Fecha Fin</label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={aplicarFiltrosFecha}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar
                </Button>
                <Button
                  onClick={limpiarFiltros}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Registro de Auditoría</CardTitle>
                <CardDescription className="text-white/60">
                  Historial completo de cambios en el sistema
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    placeholder="Buscar en auditoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <Select value={filterAccion} onValueChange={setFilterAccion}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Filtrar por acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las acciones</SelectItem>
                    {uniqueAcciones.map((accion) => (
                      <SelectItem key={accion} value={accion}>
                        {accion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterUsuario} onValueChange={setFilterUsuario}>
                  <SelectTrigger className="w-full sm:w-48 bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                    <SelectValue placeholder="Filtrar por usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los usuarios</SelectItem>
                    {uniqueUsuarios.map((usuario) => (
                      <SelectItem key={usuario} value={usuario}>
                        {usuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <TableHead className="font-semibold text-[#C7E196]">Fecha</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Entidad Afectada</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Acción</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Detalles</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Usuario</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Cambios</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditorias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-white/60">
                          {searchTerm || filterAccion !== "todas" || filterUsuario !== "todos"
                            ? "No se encontraron registros con los filtros aplicados"
                            : "No hay registros de auditoría"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAuditorias.map((auditoria) => (
                        <TableRow key={auditoria.id_auditoria} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white/80 text-sm">
                            {auditoriaService.formatFecha(auditoria.fecha_accion)}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {getEntidadAfectada(auditoria)}
                          </TableCell>
                          <TableCell>{getAccionBadge(auditoria.accion)}</TableCell>
                          <TableCell className="text-white/80 text-sm max-w-xs">
                            <span className="line-clamp-2">{auditoria.detalles}</span>
                            {auditoria.observaciones_adicionales && (
                              <p className="text-xs text-white/60 mt-1">
                                {auditoria.observaciones_adicionales}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">
                            {auditoria.usuario_responsable}
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">
                            {auditoria.estado_anterior && auditoria.estado_nuevo ? (
                              <div className="text-xs">
                                <span className="text-red-300 line-through">{auditoria.estado_anterior}</span>
                                <span className="mx-1">→</span>
                                <span className="text-green-300">{auditoria.estado_nuevo}</span>
                              </div>
                            ) : (
                              <span className="text-white/40">-</span>
                            )}
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
    </DashboardLayout>
  );
}
