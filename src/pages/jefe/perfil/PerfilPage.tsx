import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Building2, UserCheck, Users, Activity, User, Key, Save, RefreshCw, FileText } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Badge } from "@/components/ui/badge";
import { jefeService } from "@/services/jefeService";

interface JefeData {
  id_jefe: number;  // ✅ Cambiar de id_usuario a id_jefe
  rol: string;
  nombre_completo: string;  // ✅ Cambiar de nombre/apellido separados a nombre_completo
  email: string;
  telefono?: string;
  dni: string;  // ✅ Agregar dni
  linkedin?: string;  // ✅ Agregar linkedin
  fecha_creacion: string;
  fecha_actualizacion?: string;  // ✅ Cambiar de ultima_conexion
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

export default function PerfilPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jefeData, setJefeData] = useState<JefeData | null>(null);

  const [formData, setFormData] = useState({
    nombre_completo: "",  // ✅ Unificar nombre y apellido
    email: "",
    rol: "",
    telefono: "",
    dni: "",  // ✅ Agregar dni
    linkedin: "",  // ✅ Agregar linkedin
    password_actual: "",
    password_nueva: "",
    password_confirmar: "",
  });


  useEffect(() => {
  
  // ✅ SOLUCIÓN: Verificar tanto contexto como localStorage
  const storedUser = localStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  // ✅ PERMITIR acceso si hay token, incluso si el contexto no se actualizó aún
  if (!user && !storedUser) {
    navigate("/login");
    return;
  }
  
  // ✅ Usar el usuario del contexto O del localStorage
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
    fetchJefeData();
  }, [user, navigate]);

  const fetchJefeData = async () => {
    try {
      setLoading(true);
      const data = await jefeService.getPerfil();


      setJefeData(data);
      setFormData({
        nombre_completo: data.nombre_completo || '',
        email: data.email || '', // Manejar ambos nombres
        rol: data.rol || 'Jefe',
        telefono: data.telefono || '',
        dni: data.dni || '',
        linkedin: data.linkedin || '',
        password_actual: "",
        password_nueva: "",
        password_confirmar: "",
      });
    } catch (error) {
      console.error("Error fetching jefe data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);

      await jefeService.updatePerfil({
        nombre_completo: formData.nombre_completo,  // ✅ Usar nombre_completo
        email: formData.email,
        telefono: formData.telefono,
        dni: formData.dni,  // ✅ Incluir dni
        linkedin: formData.linkedin,  // ✅ Incluir linkedin
      });

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados exitosamente",
      });

      fetchJefeData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };


  const handleChangePassword = async () => {
    if (formData.password_nueva !== formData.password_confirmar) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password_nueva.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      await jefeService.updatePassword({
        password_actual: formData.password_actual,
        password_nueva: formData.password_nueva,
      });

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      setFormData({
        ...formData,
        password_actual: "",
        password_nueva: "",
        password_confirmar: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Mi Perfil" subtitle="Gestiona tu información personal">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Mi Perfil" subtitle="Gestiona tu información personal">
      <div className="space-y-6">
        {/* Profile Info Card */}
        <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C7E196] text-[#013936] text-2xl font-bold">
                {jefeData?.nombre_completo?.charAt(0) || "J"}
              </div>
              <div>
                <CardTitle className="text-white">
                  {jefeData?.nombre_completo || "Nombre no disponible"}
                </CardTitle>
                <CardDescription className="text-white/60 flex items-center gap-2 mt-1">
                  {/* ✅ Mostrar correctamente el rol */}
                  <Badge className={`${jefeData?.rol === 'Administrador'
                      ? 'bg-blue-500/20 !text-blue-900 border-blue-500/30'
                      : 'bg-[#C7E196]/20 !text-[#013936] border-[#C7E196]/30'
                    }`}>
                    {jefeData?.rol || 'Jefe'}
                  </Badge>
                  <span className="text-xs">
                    DNI: {jefeData?.dni || 'No disponible'}
                  </span>
                  <span className="text-xs">
                    Miembro desde{" "}
                    {jefeData?.fecha_creacion ? new Date(jefeData.fecha_creacion).toLocaleDateString() : "N/A"}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Información Personal</CardTitle>
              </div>
              <CardDescription className="text-white/60">Actualiza tus datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ✅ Campo DNI */}
              <div className="grid gap-2">
                <Label htmlFor="dni" className="text-white/80">
                  DNI
                </Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Ingresa tu DNI"
                />
              </div>

              {/* ✅ Campo Nombre Completo (en lugar de nombre y apellido separados) */}
              <div className="grid gap-2">
                <Label htmlFor="nombre_completo" className="text-white/80">
                  Nombre Completo
                </Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/80">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono" className="text-white/80">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="+51 987654321"
                />
              </div>

              {/* ✅ Campo LinkedIn */}
              <div className="grid gap-2">
                <Label htmlFor="linkedin" className="text-white/80">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="w-full bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          {/* Change Password */}
          <Card className="bg-gradient-to-br from-[#024a46] to-[#013936] border-[#C7E196]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#C7E196]" />
                <CardTitle className="text-white">Cambiar Contraseña</CardTitle>
              </div>
              <CardDescription className="text-white/60">Actualiza tu contraseña de acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password_actual" className="text-white/80">
                  Contraseña Actual
                </Label>
                <Input
                  id="password_actual"
                  type="password"
                  value={formData.password_actual}
                  onChange={(e) => setFormData({ ...formData, password_actual: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_nueva" className="text-white/80">
                  Nueva Contraseña
                </Label>
                <Input
                  id="password_nueva"
                  type="password"
                  value={formData.password_nueva}
                  onChange={(e) => setFormData({ ...formData, password_nueva: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmar" className="text-white/80">
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="password_confirmar"
                  type="password"
                  value={formData.password_confirmar}
                  onChange={(e) => setFormData({ ...formData, password_confirmar: e.target.value })}
                  className="bg-white/10 border-white/20 text-white focus:border-[#C7E196]"
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={
                  saving || !formData.password_actual || !formData.password_nueva || !formData.password_confirmar
                }
                className="w-full bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}