// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Esperar a que termine la carga antes de validar
//     if (!isLoading && !isAuthenticated) {
//       navigate("/login", { replace: true });
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   // Loader mientras se valida
//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#013936]">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C7E196] border-t-transparent" />
//       </div>
//     );
//   }

//   // Evita renderizar si no está autenticado
//   if (!isAuthenticated) return null;

//   return <>{children}</>;
// }
