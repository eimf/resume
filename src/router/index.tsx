import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminProjects,
  AdminExperience,
  AdminSkills,
  AdminProfile,
} from '../pages/admin';

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
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'projects', element: <AdminProjects /> },
      { path: 'experience', element: <AdminExperience /> },
      { path: 'skills', element: <AdminSkills /> },
      { path: 'profile', element: <AdminProfile /> },
    ],
  },
]);
