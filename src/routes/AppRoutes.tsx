import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layouts/DashboardLayout';

// Lazy load pages
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ProductList = lazy(() => import('../modules/product/pages/ProductList'));
const ProductForm = lazy(() => import('../modules/product/pages/ProductoForm'));
const Marketing = lazy(() => import('../modules/marketing/pages/Leads'));
const MarketingForm = lazy(() => import('../modules/marketing/pages/LeadForm'));
const Sales = lazy(() => import('../modules/sales/pages/Opportunities'));
const SalesForm = lazy(() => import('../modules/sales/pages/OpportunitiesForm'));
const Reports = lazy(() => import('../modules/reporting/pages/DashboardReports'));
const Personal = lazy(() => import('../modules/personal/pages/Performance'));
const Learning = lazy(() => import('../modules/learning/pages/Courses'));
const Users = lazy(() => import('../modules/users/pages/UserList'));

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
        
        {/* Protected routes - Dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/jefe" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/ejecutiva" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard/cliente" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Product routes */}
        <Route path="/products" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductList />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products/new" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/products/edit/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProductForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Marketing routes */}
        <Route path="/marketing" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Marketing />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/marketing/new" element={
          <ProtectedRoute>
            <DashboardLayout>
              <MarketingForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/marketing/edit/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <MarketingForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Sales routes */}
        <Route path="/sales" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Sales />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/sales/new" element={
          <ProtectedRoute>
            <DashboardLayout>
              <SalesForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/sales/edit/:id" element={
          <ProtectedRoute>
            <DashboardLayout>
              <SalesForm />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Reports routes */}
        <Route path="/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Performance routes */}
        <Route path="/performance" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Personal />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Learning routes */}
        <Route path="/learning" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Learning />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Users routes */}
        <Route path="/users" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;