import React, { Suspense, lazy } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../context/NavigationContext';
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
// const UserForm = lazy(() => import('../modules/users/pages/UserForm'));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { currentPage } = useNavigation();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Public routes
  if (!isAuthenticated || currentPage === 'login') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    );
  }

  // Protected routes
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Home />;
      case 'products':
        return <ProductList />;
      case 'product-form':
        return <ProductForm />;
      case 'marketing':
        return <Marketing />;
      case 'marketing-form':
        return <MarketingForm />;
      case 'sales':
        return <Sales />;
      case 'sales-form':
        return <SalesForm />;
      case 'reports':
        return <Reports />;
      case 'personal':
        return <Personal />;
      case 'learning':
        return <Learning />;
      case 'users':
        return <Users />;
      // case 'user-form':
      //   return <UserForm />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardLayout>{renderPage()}</DashboardLayout>
    </Suspense>
  );
};

export default AppRoutes;