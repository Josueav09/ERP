

// // frontend/src/components/common/SimpleCaptcha.tsx
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { RefreshCw } from "lucide-react";

// interface SimpleCaptchaProps {
//   onVerify: (token: string, userInput: string) => void;
// }

// export function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
//   const [captchaText, setCaptchaText] = useState("");
//   const [captchaToken, setCaptchaToken] = useState("");
//   const [userInput, setUserInput] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCaptcha = async () => {
//     try {
//       setIsLoading(true);
//       const res = await fetch("/auth/captcha"); // proxy lo redirige a localhost:3001
      
//       if (!res.ok) {
//         throw new Error('Error al cargar captcha');
//       }

//       const data = await res.json();
//       setCaptchaText(data.captchaText);
//       setCaptchaToken(data.captchaToken);
//       setUserInput("");
//       setIsVerified(false);
//     } catch (err) {
//       console.error("Error cargando captcha:", err);
//       alert("Error al cargar captcha. Recargue la página.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCaptcha();
//   }, []);

//   const handleVerify = () => {
//     if (!userInput.trim()) {
//       alert("Debe ingresar el código captcha");
//       return;
//     }

//     if (userInput.toUpperCase() === captchaText.toUpperCase()) {
//       setIsVerified(true);
//       // ✅ Pasar token Y respuesta del usuario
//       onVerify(captchaToken, userInput);
//     } else {
//       alert("Código captcha incorrecto");
//       fetchCaptcha(); // regenerar captcha
//       setUserInput("");
//       setIsVerified(false);
//     }
//   };

//   if (isVerified) {
//     return (
//       <div className="flex items-center gap-2 rounded-lg border-2 border-[#C7E196] bg-[#C7E196]/10 p-3">
//         <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C7E196]">
//           <svg className="h-3 w-3 text-[#013936]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <span className="text-sm font-medium text-[#013936]">✓ Verificado</span>
//         <button
//           type="button"
//           onClick={fetchCaptcha}
//           className="ml-auto text-xs text-[#013936]/60 hover:text-[#013936] underline"
//         >
//           Cambiar
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         <div className="flex-1 select-none rounded-lg bg-gradient-to-br from-[#013936] to-[#025550] p-4 text-center">
//           {isLoading ? (
//             <span className="text-white text-sm">Cargando...</span>
//           ) : (
//             <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
//               {captchaText}
//             </span>
//           )}
//         </div>
//         <Button 
//           type="button" 
//           variant="outline" 
//           size="icon" 
//           onClick={fetchCaptcha}
//           disabled={isLoading}
//         >
//           <RefreshCw className={`h-4 w-4 text-[#013936] ${isLoading ? 'animate-spin' : ''}`} />
//         </Button>
//       </div>
//       <div className="flex gap-2">
//         <Input
//           type="text"
//           placeholder="Ingrese el código"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value.toUpperCase())}
//           onKeyDown={(e) => e.key === "Enter" && handleVerify()}
//           className="flex-1 border-[#013936]/20 focus-visible:ring-[#C7E196] uppercase"
//           maxLength={6}
//           disabled={isLoading}
//         />
//         <Button 
//           type="button" 
//           onClick={handleVerify} 
//           className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
//           disabled={isLoading || !userInput.trim()}
//         >
//           Verificar
//         </Button>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { authService } from "@/services/authService";

interface SimpleCaptchaProps {
  onVerify: (token: string, userInput: string) => void;
}

export function SimpleCaptcha({ onVerify }: SimpleCaptchaProps) {
  const [captchaText, setCaptchaText] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getCaptcha();
      
      setCaptchaText(data.captchaText);
      setCaptchaToken(data.captchaToken);
      setUserInput("");
      setIsVerified(false);
    } catch (err) {
      console.error("Error cargando captcha:", err);
      alert("Error al cargar captcha. Recargue la página.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleVerify = () => {
    if (!userInput.trim()) {
      alert("Debe ingresar el código captcha");
      return;
    }

    if (userInput.toUpperCase() === captchaText.toUpperCase()) {
      setIsVerified(true);
      onVerify(captchaToken, userInput);
    } else {
      alert("Código captcha incorrecto");
      fetchCaptcha();
      setUserInput("");
      setIsVerified(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 rounded-lg border-2 border-[#C7E196] bg-[#C7E196]/10 p-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C7E196]">
          <svg className="h-3 w-3 text-[#013936]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm font-medium text-[#013936]">✓ Verificado</span>
        <button
          type="button"
          onClick={fetchCaptcha}
          className="ml-auto text-xs text-[#013936]/60 hover:text-[#013936] underline"
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 select-none rounded-lg bg-gradient-to-br from-[#013936] to-[#025550] p-4 text-center">
          {isLoading ? (
            <span className="text-white text-sm">Cargando...</span>
          ) : (
            <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white">
              {captchaText}
            </span>
          )}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={fetchCaptcha}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 text-[#013936] ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Ingrese el código"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          className="flex-1 border-[#013936]/20 focus-visible:ring-[#C7E196] uppercase"
          maxLength={6}
          disabled={isLoading}
        />
        <Button 
          type="button" 
          onClick={handleVerify} 
          className="bg-[#C7E196] text-[#013936] hover:bg-[#C7E196]/90"
          disabled={isLoading || !userInput.trim()}
        >
          Verificar
        </Button>
      </div>
    </div>
  );
}