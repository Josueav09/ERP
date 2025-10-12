import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutDashboard, Building2, UserCheck, Users, Activity, Search, FileText, AlertCircle, User } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jefeService, AuditoriaRecord } from "@/services/jefeService";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAccion, setFilterAccion] = useState<string>("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "jefe") {
      navigate("/login");
      return;
    }
    fetchAuditorias();
  }, [user, navigate]);

  useEffect(() => {
    let filtered = auditorias;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auditoria) =>
          auditoria.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auditoria.rut_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auditoria.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (auditoria.detalles && auditoria.detalles.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (auditoria.ejecutiva_nombre && auditoria.ejecutiva_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (auditoria.responsable_nombre &&
            auditoria.responsable_nombre.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Filter by action type
    if (filterAccion !== "todas") {
      filtered = filtered.filter((auditoria) => auditoria.accion === filterAccion);
    }

    setFilteredAuditorias(filtered);
  }, [searchTerm, filterAccion, auditorias]);

  const fetchAuditorias = async () => {
    try {
      setLoading(true);
      const data = await jefeService.getAuditoria();
      setAuditorias(data);
      setFilteredAuditorias(data);
    } catch (error) {
      console.error("Error fetching auditorias:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el registro de auditoría",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccionBadge = (accion: string) => {
    const accionLower = accion.toLowerCase();
    if (accionLower.includes("desactivar") || accionLower.includes("deshabilitar")) {
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{accion}</Badge>;
    }
    if (accionLower.includes("activar") || accionLower.includes("habilitar")) {
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{accion}</Badge>;
    }
    if (accionLower.includes("modificar") || accionLower.includes("actualizar")) {
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{accion}</Badge>;
    }
    return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{accion}</Badge>;
  };

  const uniqueAcciones = Array.from(new Set(auditorias.map((a) => a.accion)));

  return (
    <DashboardLayout navItems={navItems} title="Auditoría de Contratos" subtitle="Registro de cambios y acciones">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Total Registros</CardTitle>
              <FileText className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{auditorias.length}</div>
              <p className="text-xs text-white/60 mt-1">Acciones registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/80">Clientes Afectados</CardTitle>
              <Users className="h-4 w-4 text-[#C7E196]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{new Set(auditorias.map((a) => a.id_cliente)).size}</div>
              <p className="text-xs text-white/60 mt-1">Clientes únicos</p>
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
        </div>

        {/* Audit Log Table */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">Registro de Auditoría</CardTitle>
                <CardDescription className="text-white/60">
                  Historial completo de cambios en clientes y empresas
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
                      <TableHead className="font-semibold text-[#C7E196]">Cliente</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">RUT</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Acción</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Detalles</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Ejecutiva</TableHead>
                      <TableHead className="font-semibold text-[#C7E196]">Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAuditorias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-white/60">
                          {searchTerm || filterAccion !== "todas"
                            ? "No se encontraron registros"
                            : "No hay registros de auditoría"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAuditorias.map((auditoria) => (
                        <TableRow key={auditoria.id_auditoria} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white/80 text-sm">
                            {new Date(auditoria.fecha_accion).toLocaleString("es-CL", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-white font-medium">{auditoria.nombre_cliente}</TableCell>
                          <TableCell className="text-white/80 text-sm font-mono">{auditoria.rut_cliente}</TableCell>
                          <TableCell>{getAccionBadge(auditoria.accion)}</TableCell>
                          <TableCell className="text-white/80 text-sm max-w-xs">
                            {auditoria.detalles ? (
                              <span className="line-clamp-2">{auditoria.detalles}</span>
                            ) : (
                              <span className="text-white/40">Sin detalles</span>
                            )}
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">
                            {auditoria.ejecutiva_nombre || <span className="text-white/40">N/A</span>}
                          </TableCell>
                          <TableCell className="text-white/80 text-sm">
                            {auditoria.responsable_nombre || <span className="text-white/40">Sistema</span>}
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
