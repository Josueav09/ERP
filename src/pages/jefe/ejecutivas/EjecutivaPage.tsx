// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Switch } from "@/components/ui/switch";
// import {
//   Search,
//   Users,
//   Building2,
//   UserCheck,
//   Activity,
//   LayoutDashboard,
//   Pencil,
//   Eye,
//   ExternalLink,
//   Plus,
//   FileText,
//   User
// } from "lucide-react";
// import { useToast } from "@/hooks/useToast";
// import { jefeService, Ejecutiva } from "@/services/jefeService";

// interface EjecutivaDetalle {
//   ejecutiva: {
//     id_usuario: number;
//     nombre: string;
//     apellido: string;
//     email: string;
//     telefono: string;
//     activo: boolean;
//   };
//   empresas: Array<{
//     id_empresa: number;
//     nombre_empresa: string;
//     rut: string;
//     fecha_asignacion: string;
//     asignacion_activa: boolean;
//   }>;
//   clientes: Array<{
//     id_cliente: number;
//     nombre_cliente: string;
//     rut_cliente: string;
//     email: string;
//     telefono: string;
//     estado: string;
//     nombre_empresa: string;
//     fecha_registro: string;
//   }>;
// }

// const navItems = [
//   { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
//   { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
//   { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
//   { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
//   { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
//   { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
//   { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
// ];

// export default function EjecutivasPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([]);
//   const [filteredEjecutivas, setFilteredEjecutivas] = useState<Ejecutiva[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [currentEjecutiva, setCurrentEjecutiva] = useState<Ejecutiva | null>(null);
//   const [ejecutivaDetalle, setEjecutivaDetalle] = useState<EjecutivaDetalle | null>(null);
//   const [formData, setFormData] = useState({
//     nombre: "",
//     apellido: "",
//     email: "",
//     telefono: "",
//     activo: true,
//   });
//   const [createFormData, setCreateFormData] = useState({
//     nombre: "",
//     apellido: "",
//     email: "",
//     telefono: "",
//     password: "",
//     dni: ""
//   });

// useEffect(() => {
//   console.log('📍 JefeDashboard - User context:', user);
  
//   // ✅ SOLUCIÓN: Verificar tanto contexto como localStorage
//   const storedUser = localStorage.getItem('user');
//   const token = sessionStorage.getItem('token');
  
//   console.log('📍 JefeDashboard - Stored user:', storedUser);
//   console.log('📍 JefeDashboard - Token:', token);
  
//   // ✅ PERMITIR acceso si hay token, incluso si el contexto no se actualizó aún
//   if (!user && !storedUser) {
//     console.log('❌ JefeDashboard: Sin usuario en contexto ni storage, redirigiendo...');
//     navigate("/login");
//     return;
//   }
  
//   // ✅ Usar el usuario del contexto O del localStorage
//   const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
  
//   if (!currentUser) {
//     console.log('❌ JefeDashboard: No se pudo obtener usuario, redirigiendo...');
//     navigate("/login");
//     return;
//   }
  
//   const allowedRoles = ["jefe", "Jefe", "Administrador"];
//   if (!allowedRoles.includes(currentUser.role)) {
//     console.log('❌ JefeDashboard: Rol no permitido:', currentUser.role);
//     navigate("/login");
//     return;
//   }
  
//   console.log('✅ JefeDashboard: Acceso permitido para:', currentUser.role);
//   console.log('✅ JefeDashboard: Fuente del usuario:', user ? 'contexto' : 'localStorage');
//     fetchEjecutivas();
//   }, [user, navigate]);

//   useEffect(() => {
//     const filtered = ejecutivas.filter(
//       (ejecutiva) =>
//         (ejecutiva.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (ejecutiva.apellido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (ejecutiva.email || '').toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//     setFilteredEjecutivas(filtered);
//   }, [searchTerm, ejecutivas]);

//   const fetchEjecutivas = async () => {
//     try {
//       setLoading(true);
//       const data = await jefeService.getEjecutivas();
//       setEjecutivas(data);
//       setFilteredEjecutivas(data);
//     } catch (error) {
//       console.error("Error fetching ejecutivas:", error);
//       toast({
//         title: "Error",
//         description: "No se pudieron cargar las ejecutivas",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenEditDialog = (ejecutiva: Ejecutiva) => {
//     setCurrentEjecutiva(ejecutiva);
//     setFormData({
//       nombre: ejecutiva.nombre || '',
//       apellido: ejecutiva.apellido || '',
//       email: ejecutiva.email || '',
//       telefono: ejecutiva.telefono || "",
//       activo: ejecutiva.activo,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleEditSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       if (!currentEjecutiva) return;

//       await jefeService.updateEjecutiva(currentEjecutiva.id_usuario, formData);

//       toast({
//         title: "Éxito",
//         description: "Ejecutiva actualizada correctamente",
//       });

//       setIsEditDialogOpen(false);
//       fetchEjecutivas();
//     } catch (error) {
//       console.error("Error updating ejecutiva:", error);
//       toast({
//         title: "Error",
//         description: "No se pudo actualizar la ejecutiva",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleOpenDetailDialog = async (ejecutiva: Ejecutiva) => {
//     try {
//       const data = await jefeService.getEjecutivaDetalle(ejecutiva.id_usuario);
//       setEjecutivaDetalle(data);
//       setIsDetailDialogOpen(true);
//     } catch (error) {
//       console.error("Error fetching ejecutiva details:", error);
//       toast({
//         title: "Error",
//         description: "No se pudieron cargar los detalles",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleGoToTrazabilidad = (ejecutivaId: number) => {
//     navigate(`/dashboard/jefe/trazabilidad?ejecutiva=${ejecutivaId}`);
//   };

//   const handleOpenCreateDialog = () => {
//     setCreateFormData({
//       nombre: "",
//       apellido: "",
//       email: "",
//       telefono: "",
//       password: "",
//       dni: ""
//     });
//     setIsCreateDialogOpen(true);
//   };

//   const handleCreateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ VALIDACIÓN ADICIONAL
//     if (!createFormData.dni || createFormData.dni.length < 8) {
//       toast({
//         title: "Error de validación",
//         description: "El DNI debe tener al menos 8 caracteres",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!createFormData.nombre || !createFormData.apellido) {
//       toast({
//         title: "Error de validación",
//         description: "Nombre y apellido son requeridos",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await jefeService.createEjecutiva(createFormData);

//       toast({
//         title: "Éxito",
//         description: "Ejecutiva creada correctamente",
//       });

//       setIsCreateDialogOpen(false);
//       fetchEjecutivas();
//     } catch (error: any) {
//       console.error("Error creating ejecutiva:", error);
//       toast({
//         title: "Error",
//         description: error.message || "No se pudo crear la ejecutiva",
//         variant: "destructive",
//       });
//     }
//   };

//   const totalEjecutivas = ejecutivas.length;
//   const ejecutivasActivas = ejecutivas.filter((e) => e.activo).length;
//   const totalEmpresas = ejecutivas.reduce((sum, e) => sum + Number(e.total_empresas || 0), 0);
//   const totalClientes = ejecutivas.reduce((sum, e) => sum + Number(e.total_clientes || 0), 0);
//   const totalActividades = ejecutivas.reduce((sum, e) => sum + Number(e.total_actividades || 0), 0);

//   return (
//     <DashboardLayout
//       navItems={navItems}
//       title="Gestión de Ejecutivas"
//       subtitle="Supervisa el desempeño de las ejecutivas"
//     >
//       <div className="space-y-6">
//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Total Ejecutivas</CardTitle>
//               <Users className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{totalEjecutivas}</div>
//               <p className="text-xs text-white/60 mt-1">{ejecutivasActivas} activas</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Activas</CardTitle>
//               <UserCheck className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{ejecutivasActivas}</div>
//               <p className="text-xs text-white/60 mt-1">
//                 {((ejecutivasActivas / totalEjecutivas) * 100 || 0).toFixed(0)}% del total
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Empresas</CardTitle>
//               <Building2 className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{totalEmpresas}</div>
//               <p className="text-xs text-white/60 mt-1">Asignadas en total</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Clientes</CardTitle>
//               <Users className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{totalClientes}</div>
//               <p className="text-xs text-white/60 mt-1">Gestionados</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-white/80">Actividades</CardTitle>
//               <Activity className="h-4 w-4 text-[#C7E196]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{totalActividades}</div>
//               <p className="text-xs text-white/60 mt-1">Registradas</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Table Card */}
//         <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
//           <CardHeader>
//             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <CardTitle className="text-white">Lista de Ejecutivas</CardTitle>
//                 <CardDescription className="text-white/60">
//                   Visualiza el desempeño y asignaciones de cada ejecutiva
//                 </CardDescription>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//                 <div className="relative flex-1 md:w-72">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
//                   <Input
//                     placeholder="Buscar ejecutiva..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <Button
//                   onClick={handleOpenCreateDialog}
//                   className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium whitespace-nowrap"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Añadir Ejecutiva
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
//               </div>
//             ) : (
//               <div className="rounded-md border border-white/10 overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="border-white/10 hover:bg-transparent">
//                       <TableHead className="font-semibold text-[#C7E196]">Nombre</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Email</TableHead>
//                       <TableHead className="font-semibold text-[#C7E196]">Teléfono</TableHead>
//                       <TableHead className="text-center font-semibold text-[#C7E196]">Empresas</TableHead>
//                       <TableHead className="text-center font-semibold text-[#C7E196]">Clientes</TableHead>
//                       <TableHead className="text-center font-semibold text-[#C7E196]">Actividades</TableHead>
//                       <TableHead className="text-center font-semibold text-[#C7E196]">Estado</TableHead>
//                       <TableHead className="text-right font-semibold text-[#C7E196]">Acciones</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredEjecutivas.length === 0 ? (
//                       <TableRow key="no-results"> {/* ✅ KEY AGREGADA */}
//                         <TableCell colSpan={8} className="text-center py-8 text-white/60">
//                           {searchTerm
//                             ? "No se encontraron ejecutivas con ese criterio"
//                             : "No hay ejecutivas registradas"}
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredEjecutivas.map((ejecutiva) => (
//                         <TableRow key={`ejecutiva-${ejecutiva.id_usuario}`} className="border-white/10 hover:bg-white/5">
//                           <TableCell className="font-medium text-white">
//                             <button
//                               onClick={() => handleOpenDetailDialog(ejecutiva)}
//                               className="flex items-center gap-2 hover:text-[#C7E196] transition-colors"
//                             >
//                               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-sm font-semibold">
//                                 {ejecutiva.nombre?.charAt(0) || ''}
//                                 {ejecutiva.apellido?.charAt(0) || ''}
//                               </div>
//                               <span className="underline decoration-dotted">
//                                 {(ejecutiva.nombre || '')} {(ejecutiva.apellido || '')}
//                               </span>
//                             </button>
//                           </TableCell>
//                           <TableCell className="text-white/80">{ejecutiva.email || 'N/A'}</TableCell>
//                           <TableCell className="text-white/80">{ejecutiva.telefono || "N/A"}</TableCell>
//                           <TableCell className="text-center">
//                             <Badge className="bg-[#C7E196]/20 text-[#C7E196] border-[#C7E196]/30">
//                               {ejecutiva.total_empresas || 0}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-center">
//                             <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
//                               {ejecutiva.total_clientes || 0}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-center">
//                             <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
//                               {ejecutiva.total_actividades || 0}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-center">
//                             <Badge
//                               className={
//                                 ejecutiva.activo
//                                   ? "bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/80"
//                                   : "bg-white/10 text-white/60"
//                               }
//                             >
//                               {ejecutiva.activo ? "Activa" : "Inactiva"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-2">
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 onClick={() => handleOpenDetailDialog(ejecutiva)}
//                                 className="text-white/80 hover:text-white hover:bg-white/10"
//                                 title="Ver detalles"
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 onClick={() => handleOpenEditDialog(ejecutiva)}
//                                 className="text-white/80 hover:text-white hover:bg-white/10"
//                                 title="Editar"
//                               >
//                                 <Pencil className="w-4 h-4" />
//                               </Button>
//                             </div>
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

//         {/* Detail Dialog */}
//         <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
//           <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="text-[#C7E196] text-xl">
//                 {ejecutivaDetalle?.ejecutiva.nombre} {ejecutivaDetalle?.ejecutiva.apellido}
//               </DialogTitle>
//               <DialogDescription className="text-white/60">Información detallada de la ejecutiva</DialogDescription>
//             </DialogHeader>
//             {ejecutivaDetalle && (
//               <div className="space-y-6 py-4">
//                 {/* Empresas Section */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                       <Building2 className="w-5 h-5 text-[#C7E196]" />
//                       Empresas Asociadas ({ejecutivaDetalle.empresas.length})
//                     </h3>
//                   </div>
//                   {ejecutivaDetalle.empresas.length === 0 ? (
//                     <p key="no-empresas" className="text-white/60 text-sm">No tiene empresas asignadas</p>
//                   ) : (
//                     <div className="space-y-2">
//                       {ejecutivaDetalle.empresas.map((empresa) => (
//                         <div
//                           key={`empresa-${empresa.id_empresa}`}
//                           className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between"
//                         >
//                           <div>
//                             <p className="font-medium text-white">{empresa.nombre_empresa}</p>
//                             <p className="text-sm text-white/60">RUC: {empresa.rut}</p>
//                           </div>
//                           <Badge
//                             className={
//                               empresa.asignacion_activa ? "bg-[#C7E196] text-[#013936]" : "bg-white/10 text-white/60"
//                             }
//                           >
//                             {empresa.asignacion_activa ? "Activa" : "Inactiva"}
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Clientes Section */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                       <Users className="w-5 h-5 text-[#C7E196]" />
//                       Clientes Asignados ({ejecutivaDetalle.clientes.length})
//                     </h3>
//                   </div>
//                   {ejecutivaDetalle.clientes.length === 0 ? (
//                     <p key="no-clientes" className="text-white/60 text-sm">No tiene clientes asignados</p>
//                   ) : (
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                       {ejecutivaDetalle.clientes.map((cliente) => (
//                         <div
//                           key={`cliente-${cliente.id_cliente}`}
//                           className="bg-white/5 border border-white/10 rounded-lg p-3"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <p className="font-medium text-white">{cliente.nombre_cliente}</p>
//                               <p className="text-sm text-white/60">RUC: {cliente.rut_cliente}</p>
//                               <p className="text-sm text-white/60">Empresa: {cliente.nombre_empresa}</p>
//                               <p className="text-sm text-white/60">Email: {cliente.email}</p>
//                             </div>
//                             <Badge
//                               className={
//                                 cliente.estado === "activo"
//                                   ? "bg-[#C7E196] text-[#013936]"
//                                   : "bg-white/10 text-white/60"
//                               }
//                             >
//                               {cliente.estado}
//                             </Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Trazabilidad Button */}
//                 <div className="pt-4 border-t border-white/10">
//                   <Button
//                     onClick={() => handleGoToTrazabilidad(ejecutivaDetalle.ejecutiva.id_usuario)}
//                     className="w-full bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
//                   >
//                     <Activity className="w-4 h-4 mr-2" />
//                     Ver Trazabilidad Completa
//                     <ExternalLink className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => setIsDetailDialogOpen(false)}
//                 className="text-white/80 hover:text-white hover:bg-white/10"
//               >
//                 Cerrar
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Edit Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-md">
//             <DialogHeader>
//               <DialogTitle className="text-[#C7E196]">Editar Ejecutiva</DialogTitle>
//               <DialogDescription className="text-white/60">Actualiza la información de la ejecutiva</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleEditSubmit}>
//               <div className="space-y-4 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="nombre" className="text-white/80">
//                     Nombre
//                   </Label>
//                   <Input
//                     id="nombre"
//                     value={formData.nombre}
//                     onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
//                     required
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="apellido" className="text-white/80">
//                     Apellido
//                   </Label>
//                   <Input
//                     id="apellido"
//                     value={formData.apellido}
//                     onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
//                     required
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-white/80">
//                     Email
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     required
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="telefono" className="text-white/80">
//                     Teléfono
//                   </Label>
//                   <Input
//                     id="telefono"
//                     value={formData.telefono}
//                     onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                   />
//                 </div>
//                 <div className="flex items-center justify-between space-x-2">
//                   <Label htmlFor="activo" className="text-white/80">
//                     Estado Activo
//                   </Label>
//                   <Switch
//                     id="activo"
//                     checked={formData.activo}
//                     onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={() => setIsEditDialogOpen(false)}
//                   className="text-white/80 hover:text-white hover:bg-white/10"
//                 >
//                   Cancelar
//                 </Button>
//                 <Button type="submit" className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium">
//                   Actualizar
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Create Dialog */}
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-md">
//             <DialogHeader>
//               <DialogTitle className="text-[#C7E196]">Añadir Nueva Ejecutiva</DialogTitle>
//               <DialogDescription className="text-white/60">Crea una nueva ejecutiva en el sistema</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateSubmit}>
//               <div className="space-y-4 py-4">
//                 {/* ✅ CAMPO DNI - REQUERIDO */}
//                 <div className="space-y-2">
//                   <Label htmlFor="create-dni" className="text-white/80">
//                     DNI *
//                   </Label>
//                   <Input
//                     id="create-dni"
//                     value={createFormData.dni}
//                     onChange={(e) => setCreateFormData({ ...createFormData, dni: e.target.value })}
//                     required
//                     minLength={8}
//                     maxLength={20}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="Ingrese DNI (8-20 caracteres)"
//                   />
//                   <p className="text-xs text-white/60">Mínimo 8 caracteres</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="create-nombre" className="text-white/80">
//                     Nombre *
//                   </Label>
//                   <Input
//                     id="create-nombre"
//                     value={createFormData.nombre}
//                     onChange={(e) => setCreateFormData({ ...createFormData, nombre: e.target.value })}
//                     required
//                     minLength={2}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="Ingrese nombre"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="create-apellido" className="text-white/80">
//                     Apellido *
//                   </Label>
//                   <Input
//                     id="create-apellido"
//                     value={createFormData.apellido}
//                     onChange={(e) => setCreateFormData({ ...createFormData, apellido: e.target.value })}
//                     required
//                     minLength={2}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="Ingrese apellido"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="create-email" className="text-white/80">
//                     Email *
//                   </Label>
//                   <Input
//                     id="create-email"
//                     type="email"
//                     value={createFormData.email}
//                     onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
//                     required
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="ejemplo@correo.com"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="create-telefono" className="text-white/80">
//                     Teléfono
//                   </Label>
//                   <Input
//                     id="create-telefono"
//                     value={createFormData.telefono}
//                     onChange={(e) => setCreateFormData({ ...createFormData, telefono: e.target.value })}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="+51 987 654 321"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="create-password" className="text-white/80">
//                     Contraseña *
//                   </Label>
//                   <Input
//                     id="create-password"
//                     type="password"
//                     value={createFormData.password}
//                     onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
//                     required
//                     minLength={6}
//                     className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
//                     placeholder="Mínimo 6 caracteres"
//                   />
//                   <p className="text-xs text-white/60">Mínimo 6 caracteres</p>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={() => setIsCreateDialogOpen(false)}
//                   className="text-white/80 hover:text-white hover:bg-white/10"
//                 >
//                   Cancelar
//                 </Button>
//                 <Button type="submit" className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium">
//                   Crear Ejecutiva
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </DashboardLayout>
//   );
// }

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Building2,
  UserCheck,
  Activity,
  LayoutDashboard,
  Pencil,
  Eye,
  ExternalLink,
  Plus,
  FileText,
  User
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jefeService } from "@/services/jefeService";

// Interface corregida para coincidir con lo que devuelve el servicio
interface Ejecutiva {
  id_usuario: number;
  id_ejecutiva?: number;
  dni: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  email: string;
  correo: string;
  telefono: string;
  linkedin: string;
  estado_ejecutiva: string;
  activo: boolean;
  total_empresas: number;
  total_clientes: number;
  total_actividades: number;
  id_empresa_prov?: number;
  empresa_asignada?: string;
}

interface EjecutivaDetalle {
  ejecutiva: {
    id_ejecutiva: number;
    dni: string;
    nombre_completo: string;
    correo: string;
    telefono: string;
    linkedin: string;
    estado_ejecutiva: string;
    id_empresa_prov?: number;
    empresa_nombre?: string;
  };
  empresas: Array<{
    id_empresa: number;
    nombre_empresa: string;
    rut: string;
    fecha_asignacion: string;
    asignacion_activa: boolean;
  }>;
  clientes: Array<{
    id_cliente: number;
    nombre_cliente: string;
    rut_cliente: string;
    email: string;
    telefono: string;
    estado: string;
    nombre_empresa: string;
    fecha_registro: string;
  }>;
}

const navItems = [
  { label: "Resumen", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard/jefe" },
  { label: "Empresas", icon: <Building2 className="w-5 h-5" />, href: "/dashboard/jefe/empresas" },
  { label: "Ejecutivas", icon: <UserCheck className="w-5 h-5" />, href: "/dashboard/jefe/ejecutivas" },
  { label: "Clientes", icon: <Users className="w-5 h-5" />, href: "/dashboard/jefe/clientes" },
  { label: "Trazabilidad", icon: <Activity className="w-5 h-5" />, href: "/dashboard/jefe/trazabilidad" },
  { label: "Auditoria", icon: <FileText className="w-5 h-5" />, href: "/dashboard/jefe/auditoria" },
  { label: "Perfil", icon: <User className="w-5 h-5" />, href: "/dashboard/jefe/perfil" },
];

export default function EjecutivasPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ejecutivas, setEjecutivas] = useState<Ejecutiva[]>([]);
  const [filteredEjecutivas, setFilteredEjecutivas] = useState<Ejecutiva[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentEjecutiva, setCurrentEjecutiva] = useState<Ejecutiva | null>(null);
  const [ejecutivaDetalle, setEjecutivaDetalle] = useState<EjecutivaDetalle | null>(null);
  
  // Form data para edición
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    linkedin: "",
    estado_ejecutiva: "Activo",
    contraseña: "" // ✅ AGREGAR CAMPO PARA CONTRASEÑA
  });

  // Form data para creación
  const [createFormData, setCreateFormData] = useState({
    dni: "",
    nombre_completo: "",
    correo: "",
    telefono: "",
    linkedin: "",
    contraseña: "",
    estado_ejecutiva: "Activo"
  });

  useEffect(() => {
    console.log('📍 JefeDashboard - User context:', user);
    
    const storedUser = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    console.log('📍 JefeDashboard - Stored user:', storedUser);
    console.log('📍 JefeDashboard - Token:', token);
    
    if (!user && !storedUser) {
      console.log('❌ JefeDashboard: Sin usuario en contexto ni storage, redirigiendo...');
      navigate("/login");
      return;
    }
    
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
    fetchEjecutivas();
  }, [user, navigate]);

  useEffect(() => {
    const filtered = ejecutivas.filter(
      (ejecutiva) =>
        (ejecutiva.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ejecutiva.correo || ejecutiva.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ejecutiva.dni || '').toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredEjecutivas(filtered);
  }, [searchTerm, ejecutivas]);

  const fetchEjecutivas = async () => {
    try {
      setLoading(true);
      const data = await jefeService.getEjecutivas();
      console.log('📥 Datos recibidos del backend:', data);
      
      // Asegurarnos de que los datos tengan la estructura correcta
      const ejecutivasFormateadas = data.map((ej: any) => ({
        id_usuario: ej.id_usuario || ej.id_ejecutiva,
        id_ejecutiva: ej.id_ejecutiva || ej.id_usuario,
        dni: ej.dni || '',
        nombre: ej.nombre || '',
        apellido: ej.apellido || '',
        nombre_completo: ej.nombre_completo || `${ej.nombre || ''} ${ej.apellido || ''}`.trim(),
        email: ej.email || ej.correo || '',
        correo: ej.correo || ej.email || '',
        telefono: ej.telefono || '',
        linkedin: ej.linkedin || '',
        estado_ejecutiva: ej.estado_ejecutiva || 'Activo',
        activo: ej.activo !== false,
        total_empresas: ej.total_empresas || 0,
        total_clientes: ej.total_clientes || 0,
        total_actividades: ej.total_actividades || 0,
        id_empresa_prov: ej.id_empresa_prov,
        empresa_asignada: ej.empresa_asignada
      }));
      
      setEjecutivas(ejecutivasFormateadas);
      setFilteredEjecutivas(ejecutivasFormateadas);
    } catch (error) {
      console.error("Error fetching ejecutivas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ejecutivas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (ejecutiva: Ejecutiva) => {
    setCurrentEjecutiva(ejecutiva);
    setFormData({
      nombre_completo: ejecutiva.nombre_completo || '',
      telefono: ejecutiva.telefono || "",
      linkedin: ejecutiva.linkedin || "",
      estado_ejecutiva: ejecutiva.estado_ejecutiva || "Activo",
          contraseña: "" // ✅ INICIALIZAR VACÍO (por seguridad)

    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!currentEjecutiva) return;

      // Usar id_ejecutiva si está disponible, sino id_usuario
      const ejecutivaId = currentEjecutiva.id_ejecutiva || currentEjecutiva.id_usuario;
      
      await jefeService.updateEjecutiva(ejecutivaId, formData);

      toast({
        title: "Éxito",
        description: "Ejecutiva actualizada correctamente",
      });

      setIsEditDialogOpen(false);
      fetchEjecutivas();
    } catch (error) {
      console.error("Error updating ejecutiva:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la ejecutiva",
        variant: "destructive",
      });
    }
  };

  const handleOpenDetailDialog = async (ejecutiva: Ejecutiva) => {
    try {
      console.log('🔍 Botón ojo clickeado para ejecutiva:', ejecutiva);
      
      // Datos básicos mientras carga
      const basicData: EjecutivaDetalle = {
        ejecutiva: {
          id_ejecutiva: ejecutiva.id_ejecutiva || ejecutiva.id_usuario,
          dni: ejecutiva.dni || '',
          nombre_completo: ejecutiva.nombre_completo || '',
          correo: ejecutiva.correo || ejecutiva.email || '',
          telefono: ejecutiva.telefono || '',
          linkedin: ejecutiva.linkedin || '',
          estado_ejecutiva: ejecutiva.estado_ejecutiva || 'Activo',
          id_empresa_prov: ejecutiva.id_empresa_prov,
          empresa_nombre: ejecutiva.empresa_asignada
        },
        empresas: [],
        clientes: []
      };
      
      setEjecutivaDetalle(basicData);
      setIsDetailDialogOpen(true);
      
      // Intentar cargar datos detallados
      try {
        console.log('📡 Llamando a getEjecutivaDetalle...');
        const ejecutivaId = ejecutiva.id_ejecutiva || ejecutiva.id_usuario;
        const detailedData = await jefeService.getEjecutivaDetalle(ejecutivaId);
        console.log('✅ Datos recibidos:', detailedData);
        setEjecutivaDetalle(detailedData);
      } catch (error) {
        console.warn("No se pudieron cargar los detalles completos:", error);
        // Mantener los datos básicos
      }
      
    } catch (error) {
      console.error("Error opening detail dialog:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles",
        variant: "destructive",
      });
    }
  };

  const handleGoToTrazabilidad = (ejecutivaId: number) => {
    navigate(`/dashboard/jefe/trazabilidad?ejecutiva=${ejecutivaId}`);
  };

  const handleOpenCreateDialog = () => {
    setCreateFormData({
      dni: "",
      nombre_completo: "",
      correo: "",
      telefono: "",
      linkedin: "",
      contraseña: "",
      estado_ejecutiva: "Activo"
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!createFormData.dni || createFormData.dni.length < 8) {
      toast({
        title: "Error de validación",
        description: "El DNI debe tener al menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!createFormData.nombre_completo) {
      toast({
        title: "Error de validación",
        description: "El nombre completo es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!createFormData.contraseña || createFormData.contraseña.length < 6) {
      toast({
        title: "Error de validación",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      // Obtener el usuario del almacenamiento para el id_jefe
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      // Agregar el id_jefe del usuario actual
      const dataToSend = {
        ...createFormData,
        id_jefe: currentUser?.id || user?.id || 1
      };

      await jefeService.createEjecutiva(dataToSend);

      toast({
        title: "Éxito",
        description: "Ejecutiva creada correctamente",
      });

      setIsCreateDialogOpen(false);
      fetchEjecutivas();
    } catch (error: any) {
      console.error("Error creating ejecutiva:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la ejecutiva",
        variant: "destructive",
      });
    }
  };

  // Helper para obtener iniciales del nombre completo
  const getInitials = (nombreCompleto: string) => {
    if (!nombreCompleto) return '??';
    const names = nombreCompleto.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return nombreCompleto.substring(0, 2).toUpperCase();
  };

  const totalEjecutivas = ejecutivas.length;
  const ejecutivasActivas = ejecutivas.filter((e) => e.estado_ejecutiva === 'Activo').length;
  const totalEmpresas = ejecutivas.reduce((sum, e) => sum + Number(e.total_empresas || 0), 0);
  const totalClientes = ejecutivas.reduce((sum, e) => sum + Number(e.total_clientes || 0), 0);
  const totalActividades = ejecutivas.reduce((sum, e) => sum + Number(e.total_actividades || 0), 0);

  return (
    <DashboardLayout
      navItems={navItems}
      title="Gestión de Ejecutivas"
      subtitle="Supervisa el desempeño de las ejecutivas"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Ejecutivas</CardTitle>
              <Users className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalEjecutivas}</div>
              <p className="text-xs text-white/60 mt-1">{ejecutivasActivas} activas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Activas</CardTitle>
              <UserCheck className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ejecutivasActivas}</div>
              <p className="text-xs text-white/60 mt-1">
                {((ejecutivasActivas / totalEjecutivas) * 100 || 0).toFixed(0)}% del total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalEmpresas}</div>
              <p className="text-xs text-white/60 mt-1">Asignadas en total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Clientes</CardTitle>
              <Users className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalClientes}</div>
              <p className="text-xs text-white/60 mt-1">Gestionados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Actividades</CardTitle>
              <Activity className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalActividades}</div>
              <p className="text-xs text-white/60 mt-1">Registradas</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Lista de Ejecutivas</CardTitle>
                <CardDescription className="text-white/60">
                  Visualiza el desempeño y asignaciones de cada ejecutiva
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    placeholder="Buscar ejecutiva..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <Button
                  onClick={handleOpenCreateDialog}
                  className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Ejecutiva
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
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="font-semibold text-white">Ejecutiva</TableHead>
                      <TableHead className="font-semibold text-white">DNI</TableHead>
                      <TableHead className="font-semibold text-white">Email</TableHead>
                      <TableHead className="font-semibold text-white">Teléfono</TableHead>
                      <TableHead className="text-center font-semibold text-white">Empresas</TableHead>
                      <TableHead className="text-center font-semibold text-white">Clientes</TableHead>
                      <TableHead className="text-center font-semibold text-white">Actividades</TableHead>
                      <TableHead className="text-center font-semibold text-white">Estado</TableHead>
                      <TableHead className="text-right font-semibold text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEjecutivas.length === 0 ? (
                      <TableRow key="no-results">
                        <TableCell colSpan={9} className="text-center py-8 text-white/60">
                          {searchTerm
                            ? "No se encontraron ejecutivas con ese criterio"
                            : "No hay ejecutivas registradas"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEjecutivas.map((ejecutiva) => (
                        <TableRow key={`ejecutiva-${ejecutiva.id_usuario}`} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-medium text-white">
                            <button
                              onClick={() => handleOpenDetailDialog(ejecutiva)}
                              className="flex items-center gap-2 hover:text-[#C7E196] transition-colors"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-sm font-semibold">
                                {getInitials(ejecutiva.nombre_completo || '')}
                              </div>
                              <span className="underline decoration-dotted">
                                {ejecutiva.nombre_completo || 'N/A'}
                              </span>
                            </button>
                          </TableCell>
                          <TableCell className="text-white/80">{ejecutiva.dni || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">{ejecutiva.correo || ejecutiva.email || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">{ejecutiva.telefono || "N/A"}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-[#C7E196]/20 text-[#013936] border-[#C7E196]/30">
                              {ejecutiva.total_empresas || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-500/20 text-[#013936] border-blue-500/30">
                              {ejecutiva.total_clientes || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-purple-500/20 text-[#013936] border-purple-500/30">
                              {ejecutiva.total_actividades || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                ejecutiva.estado_ejecutiva === 'Activo'
                                  ? "bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/80"
                                  : ejecutiva.estado_ejecutiva === 'Suspendido'
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-white/10 text-white/60"
                              }
                            >
                              {ejecutiva.estado_ejecutiva || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenDetailDialog(ejecutiva)}
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleOpenEditDialog(ejecutiva)}
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
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

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196] text-xl">
                {ejecutivaDetalle?.ejecutiva.nombre_completo}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Información detallada de la ejecutiva
              </DialogDescription>
            </DialogHeader>
            {ejecutivaDetalle && (
              <div className="space-y-6 py-4">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-white/60">DNI:</span> {ejecutivaDetalle.ejecutiva.dni}</p>
                      <p><span className="text-white/60">Email:</span> {ejecutivaDetalle.ejecutiva.correo}</p>
                      <p><span className="text-white/60">Teléfono:</span> {ejecutivaDetalle.ejecutiva.telefono || 'N/A'}</p>
                      <p><span className="text-white/60">LinkedIn:</span> {ejecutivaDetalle.ejecutiva.linkedin || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Estado y Asignaciones</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-white/60">Estado:</span> 
                        <Badge className={`ml-2 ${
                          ejecutivaDetalle.ejecutiva.estado_ejecutiva === 'Activo' 
                            ? 'bg-[#C7E196] text-[#013936]' 
                            : ejecutivaDetalle.ejecutiva.estado_ejecutiva === 'Suspendido'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {ejecutivaDetalle.ejecutiva.estado_ejecutiva}
                        </Badge>
                      </p>
                      <p><span className="text-white/60">Empresa Asignada:</span> {ejecutivaDetalle.ejecutiva.empresa_nombre || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Empresas Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#C7E196]" />
                      Empresas Asociadas ({ejecutivaDetalle.empresas?.length || 0})
                    </h3>
                  </div>
                  {(!ejecutivaDetalle.empresas || ejecutivaDetalle.empresas.length === 0) ? (
                    <p className="text-white/60 text-sm">No tiene empresas asignadas</p>
                  ) : (
                    <div className="space-y-2">
                      {ejecutivaDetalle.empresas.map((empresa) => (
                        <div
                          key={`empresa-${empresa.id_empresa}`}
                          className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-white">{empresa.nombre_empresa}</p>
                            <p className="text-sm text-white/60">RUC: {empresa.rut}</p>
                          </div>
                          <Badge
                            className={
                              empresa.asignacion_activa ? "bg-[#C7E196] text-[#013936]" : "bg-white/10 text-white/60"
                            }
                          >
                            {empresa.asignacion_activa ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clientes Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#C7E196]" />
                      Clientes Asignados ({ejecutivaDetalle.clientes?.length || 0})
                    </h3>
                  </div>
                  {(!ejecutivaDetalle.clientes || ejecutivaDetalle.clientes.length === 0) ? (
                    <p className="text-white/60 text-sm">No tiene clientes asignados</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {ejecutivaDetalle.clientes.map((cliente) => (
                        <div
                          key={`cliente-${cliente.id_cliente}`}
                          className="bg-white/5 border border-white/10 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-white">{cliente.nombre_cliente}</p>
                              <p className="text-sm text-white/60">RUC: {cliente.rut_cliente}</p>
                              <p className="text-sm text-white/60">Empresa: {cliente.nombre_empresa}</p>
                              <p className="text-sm text-white/60">Email: {cliente.email}</p>
                            </div>
                            <Badge
                              className={
                                cliente.estado === "activo"
                                  ? "bg-[#C7E196] text-[#013936]"
                                  : "bg-white/10 text-white/60"
                              }
                            >
                              {cliente.estado}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trazabilidad Button */}
                <div className="pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleGoToTrazabilidad(ejecutivaDetalle.ejecutiva.id_ejecutiva)}
                    className="w-full bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Ver Trazabilidad Completa
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDetailDialogOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Editar Ejecutiva</DialogTitle>
              <DialogDescription className="text-white/60">
                Actualiza la información de la ejecutiva
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_completo" className="text-white/80">
                    Nombre Completo
                  </Label>
                  <Input
                    id="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-white/80">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="https://linkedin.com/in/usuario"
                  />
                </div>

                {/* ✅ AGREGAR CAMPO DE CONTRASEÑA */}
                <div className="space-y-2">
                  <Label htmlFor="contraseña" className="text-white/80">
                    Nueva Contraseña
                  </Label>
                  <Input
                    id="contraseña"
                    type="password"
                    value={formData.contraseña}
                    onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="Dejar vacío para mantener la actual"
                    minLength={6}
                  />
                  <p className="text-xs text-white/60">
                    Solo completa si deseas cambiar la contraseña (mínimo 6 caracteres)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado_ejecutiva" className="text-white/80">
                    Estado
                  </Label>
                  <Select
                    value={formData.estado_ejecutiva}
                    onValueChange={(value) => setFormData({ ...formData, estado_ejecutiva: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#024a46] border-[#C7E196]/20 text-white">
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium">
                  Actualizar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#C7E196]">Añadir Nueva Ejecutiva</DialogTitle>
              <DialogDescription className="text-white/60">
                Crea una nueva ejecutiva en el sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-dni" className="text-white/80">
                    DNI *
                  </Label>
                  <Input
                    id="create-dni"
                    value={createFormData.dni}
                    onChange={(e) => setCreateFormData({ ...createFormData, dni: e.target.value })}
                    required
                    minLength={8}
                    maxLength={20}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="Ingrese DNI (8-20 caracteres)"
                  />
                  <p className="text-xs text-white/60">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-nombre_completo" className="text-white/80">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="create-nombre_completo"
                    value={createFormData.nombre_completo}
                    onChange={(e) => setCreateFormData({ ...createFormData, nombre_completo: e.target.value })}
                    required
                    minLength={2}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="Ingrese nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-correo" className="text-white/80">
                    Email *
                  </Label>
                  <Input
                    id="create-correo"
                    type="email"
                    value={createFormData.correo}
                    onChange={(e) => setCreateFormData({ ...createFormData, correo: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-telefono" className="text-white/80">
                    Teléfono
                  </Label>
                  <Input
                    id="create-telefono"
                    value={createFormData.telefono}
                    onChange={(e) => setCreateFormData({ ...createFormData, telefono: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="+51 987 654 321"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-linkedin" className="text-white/80">
                    LinkedIn
                  </Label>
                  <Input
                    id="create-linkedin"
                    value={createFormData.linkedin}
                    onChange={(e) => setCreateFormData({ ...createFormData, linkedin: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="https://linkedin.com/in/usuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-contraseña" className="text-white/80">
                    Contraseña *
                  </Label>
                  <Input
                    id="create-contraseña"
                    type="password"
                    value={createFormData.contraseña}
                    onChange={(e) => setCreateFormData({ ...createFormData, contraseña: e.target.value })}
                    required
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#C7E196]"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <p className="text-xs text-white/60">Mínimo 6 caracteres</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-medium">
                  Crear Ejecutiva
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}