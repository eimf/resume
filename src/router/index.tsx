import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout';
import { HomePage } from '../pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      // Admin routes will be added in Phase 5
    ],
  },
]);
