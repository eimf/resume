import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';

const AdminLogin = lazy(() => import('../pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProjects = lazy(() => import('../pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminExperience = lazy(() => import('../pages/admin/AdminExperience').then(m => ({ default: m.AdminExperience })));
const AdminSkills = lazy(() => import('../pages/admin/AdminSkills').then(m => ({ default: m.AdminSkills })));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile').then(m => ({ default: m.AdminProfile })));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <SuspenseWrapper>
        <AdminLogin />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AdminLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
      { path: 'projects', element: <SuspenseWrapper><AdminProjects /></SuspenseWrapper> },
      { path: 'experience', element: <SuspenseWrapper><AdminExperience /></SuspenseWrapper> },
      { path: 'skills', element: <SuspenseWrapper><AdminSkills /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><AdminProfile /></SuspenseWrapper> },
    ],
  },
]);
