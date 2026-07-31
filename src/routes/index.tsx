import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },

  {
    element: <ProtectedRoute />,

    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);
