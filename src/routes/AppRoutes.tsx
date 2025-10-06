import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const ProductModule = lazy(() => import('../../src/modules/product/pages/ProductList'));
const MarketingModule = lazy(() => import('../../src/modules/marketing/pages/MarketingOverview'));
const SalesModule = lazy(() => import('../../src/modules/sales/pages/SalesOverview'));
const ReportingModule = lazy(() => import('../../src/modules/reporting/pages/ReportingOverview'));
const UsersModule = lazy(() => import('../../src/modules/users/pages/UserList'));
const PersonalModule = lazy(() => import('../../src/modules/personal/pages/PersonalOverview'));
const LearningModule = lazy(() => import('../../src/modules/learning/pages/LearningOverview'));

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductModule />
                </PrivateRoute>
              }
            />

            <Route
              path="/marketing"
              element={
                <PrivateRoute>
                  <MarketingModule />
                </PrivateRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <PrivateRoute>
                  <SalesModule />
                </PrivateRoute>
              }
            />

            <Route
              path="/reporting"
              element={
                <PrivateRoute>
                  <ReportingModule />
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UsersModule />
                </PrivateRoute>
              }
            />

            <Route
              path="/personal"
              element={
                <PrivateRoute>
                  <PersonalModule />
                </PrivateRoute>
              }
            />

            <Route
              path="/learning"
              element={
                <PrivateRoute>
                  <LearningModule />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
