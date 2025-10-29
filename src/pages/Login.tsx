// frontend/src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { SimpleCaptcha } from "../components/common/simple-captcha";
import { EmailVerificationModal } from "../components/common/email-verification-modal";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResponse, setCaptchaResponse] = useState(""); // ✅ respuesta del usuario
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  

  const { login, verifyEmailCode } = useAuth();
  const navigate = useNavigate();

  // ✅ Callback cuando se verifica el captcha
  const handleCaptchaVerify = (token: string, userInput: string) => {
    setCaptchaToken(token);
    setCaptchaResponse(userInput);
  };

// frontend/src/pages/LoginPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!captchaToken || !captchaResponse) {
    setError("Por favor complete la verificación captcha");
    return;
  }

  if (!username.trim() || !password.trim()) {
    setError("Email y contraseña son obligatorios");
    return;
  }

  setIsLoading(true);

  try {
    const result = await login(username, password, captchaToken, captchaResponse);

    if (result.success && result.requiresEmailVerification) {
      console.log("✅ Login exitoso, requiere verificación");
      setIsLoading(false);
      setUserEmail(result.email || username);
      setShowEmailVerification(true);
    } else {
      // ✅ MOSTRAR ERROR ESPECÍFICO DEL BACKEND
      setError(result.error || "Error al iniciar sesión");
      setCaptchaToken("");
      setCaptchaResponse("");
      setIsLoading(false);
    }
  } catch (err: any) {
    console.error("Error en login:", err);
    
    // ✅ MEJOR MANEJO DE ERRORES HTTP
    if (err.response?.data?.message) {
      // Error del backend con mensaje específico
      setError(err.response.data.message);
    } else if (err.response?.data?.error) {
      // Error del backend con campo 'error'
      setError(err.response.data.error);
    } else if (err.message) {
      // Error de conexión
      setError(err.message);
    } else {
      setError("Error de conexión con el servidor");
    }
    
    setCaptchaToken("");
    setCaptchaResponse("");
    setIsLoading(false);
  }
};

const handleEmailVerify = async (code: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await verifyEmailCode(code);
    if (result.success) {
      setShowEmailVerification(false);
//      navigate("/dashboard");
      return { success: true };
    } else {
      // ✅ MOSTRAR ERROR ESPECÍFICO DEL BACKEND EN VERIFICACIÓN
      const errorMsg = result.error || "Código incorrecto";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  } catch (err: any) {
    console.error("Error en verificación:", err);
    
    // ✅ MEJOR MANEJO DE ERRORES EN VERIFICACIÓN
    let errorMsg = "Error al verificar el código";
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMsg = err.response.data.error;
    } else if (err.message) {
      errorMsg = err.message;
    }
    
    setError(errorMsg);
    return { success: false, error: errorMsg };
  }
};  


  return (
    <div className="min-h-screen bg-[#013936] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23C7E196' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          <div className="space-y-6">
            <img src="/growvia-logo.png" alt="Growvia" className="mb-8 w-72" />
            <h1 className="text-5xl font-bold leading-tight">Tu fuerza de ventas, lista para crecer</h1>
            <p className="text-xl text-white/80">
              Accede a tu panel de control y gestiona tu equipo de vendedores profesionales.
            </p>
          </div>
          <div className="flex gap-2 pt-8">
            <div className="h-1 w-16 bg-[#C7E196] rounded-full" />
            <div className="h-1 w-8 bg-[#C7E196]/60 rounded-full" />
            <div className="h-1 w-4 bg-[#C7E196]/30 rounded-full" />
          </div>
        </div>
          
        {/* Login Form */}
        <Card className="w-full shadow-2xl border-0">
          <CardHeader className="space-y-3 pb-0">
            <div className="lg:hidden mb-4">
              <img src="/growvia-logo.png" alt="Growvia" className="w-48 mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#013936]">Zona de Clientes</CardTitle>
            <CardDescription className="text-base">Ingrese sus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#013936] font-medium">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#013936]/40" />
                  <Input
                    id="username"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="su-email@ejemplo.com"
                    className="pl-10 h-12 border-[#013936]/20 focus-visible:ring-[#C7E196]"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#013936] font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#013936]/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 border-[#013936]/20 focus-visible:ring-[#C7E196]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#013936]/40 hover:text-[#013936]/60"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label className="text-[#013936] font-medium">Verificación de seguridad</Label>
                <SimpleCaptcha onVerify={handleCaptchaVerify} />
              </div>

              {/* Botón */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90 font-semibold text-base shadow-lg"
                disabled={isLoading || !captchaToken || !captchaResponse}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <EmailVerificationModal
        open={showEmailVerification}
        email={userEmail}
        onVerify={handleEmailVerify}
        onClose={() => {
          setShowEmailVerification(false);
          setUserEmail("");
        }}
      />
      <style>
        {`
    .fixed[data-state="open"] {
      z-index: 9999 !important;
    }
    [data-radix-dialog-content] {
      z-index: 10000 !important;
    }
  `}
      </style>
    </div>
  );
}
