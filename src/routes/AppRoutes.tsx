import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Lazy load pages - SOLO RUTAS DEL JEFE
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AuditoriaPage = lazy(() => import('../pages/jefe/auditoria/AuditoriaPage'));
const JefeDashboard = lazy(() => import('../pages/jefe/JefeDashboard'));
const EjecutivaPage = lazy(() => import('../pages/jefe/ejecutivas/EjecutivaPage'));
const ClientesPage = lazy(() => import('../pages/jefe/clientes/ClientesPage'));
const EmpresasPage = lazy(() => import('../pages/jefe/empresas/EmpresasPage'));
const TrazabilidadPage = lazy(() => import('../pages/jefe/trazabilidad/TrazabilidadPage'));
const PerfilPage = lazy(() => import('../pages/jefe/perfil/PerfilPage'));

const ClienteDashboard = lazy(() => import('../pages/cliente/DashboardCliente'));
const ClienteEjecutivaPage = lazy(() => import('../pages/cliente/ClienteEjecutivaPage'));
const ClienteActividadesPage = lazy(() => import('../pages/cliente/ClienteActividadesPage'));

const EjecutivaDashboard = lazy(() => import('../pages/ejecutiva/EjecutivaDashboard'));
const EmpresasPageEjecutiva = lazy(() => import('../pages/ejecutiva/EmpresasPage'));
const ClientesPageEjecutiva = lazy(() => import('../pages/ejecutiva/ClientesPage'));
const TrazabilidadPageEjecutiva = lazy(() => import('../pages/ejecutiva/TrazabilidadPage'));


// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  //   console.log('🔐 AppRoutes - isAuthenticated:', isAuthenticated);
  // console.log('🔐 AppRoutes - user:', user);
  // console.log('🔐 AppRoutes - token:', sessionStorage.getItem('token'));
  return children;
};



const AppRoutes: React.FC = () => {
  

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes - Dashboard Principal */}
        <Route path="/" element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        } />

        {/* Rutas específicas del Jefe */}
        <Route path="/dashboard/jefe" element={
          <ProtectedRoute>
            <JefeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/jefe/auditoria" element={
          <ProtectedRoute>
            <AuditoriaPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/jefe/ejecutivas" element={
          <ProtectedRoute>
            <EjecutivaPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/jefe/clientes" element={
          <ProtectedRoute>
            <ClientesPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/jefe/empresas" element={
          <ProtectedRoute>
            <EmpresasPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/jefe/trazabilidad" element={
          <ProtectedRoute>
            <TrazabilidadPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/jefe/perfil" element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        } />

        {/* ✅ NUEVAS RUTAS DEL CLIENTE */}
        <Route path="/dashboard/empresa" element={
          <ProtectedRoute>
            <ClienteDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/empresa/ejecutiva" element={
          <ProtectedRoute >
            <ClienteEjecutivaPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/empresa/actividades" element={
          <ProtectedRoute>
            <ClienteActividadesPage />
          </ProtectedRoute>
        } />

        {/* ✅ NUEVAS RUTAS DE EJECUTIVA */}
        <Route path="/dashboard/ejecutiva" element={
          <ProtectedRoute>
            <EjecutivaDashboard />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/ejecutiva/empresas" element={
          <ProtectedRoute>
            <EmpresasPageEjecutiva />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/ejecutiva/clientes" element={
          <ProtectedRoute >
            <ClientesPageEjecutiva />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/ejecutiva/trazabilidad" element={
          <ProtectedRoute >
            <TrazabilidadPageEjecutiva />
          </ProtectedRoute>
        } />

        {/* Ruta para no autorizado */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">No autorizado</h1>
              <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
            </div>
          </div>
        } />


        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard/jefe" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;