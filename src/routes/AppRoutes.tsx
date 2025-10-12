// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { DashboardLayout } from '../components/layout/DashboardLayout';

// // Lazy load pages
// const Login = lazy(() => import('../pages/Login'));
// const Home = lazy(() => import('../pages/Home'));
// const NotFound = lazy(() => import('../pages/NotFound'));
// const ProductList = lazy(() => import('../modules/product/pages/ProductList'));
// const ProductForm = lazy(() => import('../modules/product/pages/ProductoForm'));
// const Marketing = lazy(() => import('../modules/marketing/pages/Leads'));
// const MarketingForm = lazy(() => import('../modules/marketing/pages/LeadForm'));
// const Sales = lazy(() => import('../modules/sales/pages/Opportunities'));
// const SalesForm = lazy(() => import('../modules/sales/pages/OpportunitiesForm'));
// const Reports = lazy(() => import('../modules/reporting/pages/DashboardReports'));
// const Personal = lazy(() => import('../modules/personal/pages/Performance'));
// const Learning = lazy(() => import('../modules/learning/pages/Courses'));
// const Users = lazy(() => import('../modules/users/pages/UserList'));
// const AuditoriaPage = lazy(() => import('../pages/jefe/auditoria/AuditoriaPage'));
// const JefeDashboard = lazy(() => import('../pages/jefe/JefeDashboard'));
// const EjecutivaPage = lazy(() => import('../pages/jefe/ejecutivas/EjecutivaPage'));
// const ClientesPage = lazy(() => import('../pages/jefe/clientes/ClientesPage'));
// const EmpresasPage = lazy(() => import('../pages/jefe/empresas/EmpresasPage'));
// //const PerfilPage = lazy(() => import('../pages/jefe/perfil/PerfilPage'));
// const TrazabilidadPage = lazy(() => import('../pages/jefe/trazabilidad/TrazabilidadPage'));


// // Loading component
// const LoadingSpinner: React.FC = () => (
//   <div className="flex items-center justify-center h-screen bg-gray-50">
//     <div className="text-center">
//       <div className="spinner mx-auto mb-4"></div>
//       <p className="text-gray-600">Cargando...</p>
//     </div>
//   </div>
// );

// // Protected Route component
// const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// const AppRoutes: React.FC = () => {
//   return (
//     <Suspense fallback={<LoadingSpinner />}>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/login" element={<Login />} />
        
//         {/* Protected routes - Dashboard */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Inicio">
//               <Home />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <Home />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}
        

//         <Route path="/dashboard/jefe" element={
//           <ProtectedRoute>
//               <JefeDashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="/dashboard/ejecutiva" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <Home />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}
        
//         {/* <Route path="/dashboard/cliente" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <Home />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}

//         {/* Product routes */}
//         <Route path="/products" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Productos">
//               <ProductList />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/products/new" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Producto">
//               <ProductForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="/products/edit/:id" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <ProductForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}

//         {/* Marketing routes */}
//         <Route path="/marketing" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Marketing">
//               <Marketing />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/marketing/new" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Marketing Form">
//               <MarketingForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="/marketing/edit/:id" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <MarketingForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}

//         {/* Sales routes */}
//         <Route path="/sales" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Ventas">
//               <Sales />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/sales/new" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Ventas Form">
//               <SalesForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />
        
//         {/* <Route path="/sales/edit/:id" element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <SalesForm />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } /> */}

//         {/* Reports routes */}
//         <Route path="/reports" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Reportes">
//               <Reports />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />

//         {/* Performance routes */}
//         <Route path="/performance" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Desempeño">
//               <Personal />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />

//         {/* Learning routes */}
//         <Route path="/learning" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Aprendizaje">
//               <Learning />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />

//         {/* Users routes */}
//         <Route path="/users" element={
//           <ProtectedRoute>
//             <DashboardLayout navItems={[]} title="Usuarios">
//               <Users />
//             </DashboardLayout>
//           </ProtectedRoute>
//         } />

//         <Route path="/dashboard/jefe/auditoria" element={
//           <ProtectedRoute>
//               <AuditoriaPage />
//           </ProtectedRoute>
//         } />

//         {/* Fallback routes */}
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// };

// export default AppRoutes;

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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
              <Home />
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

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard/jefe" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;