import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

import Attributes from '../pages/Attributes/Attributes';
import Brands from '../pages/Brands/Brands';
import Categories from '../pages/Categories/Categories';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Login/Login';
import Media from '../pages/Media/Media';
import Permissions from '../pages/Permissions/Permissions';
import Products from '../pages/Products/Products';
import Roles from '../pages/Roles/Roles';
import Users from '../pages/Users/Users';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: '/',
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: 'permissions',
            Component: Permissions,
          },
          {
            path: 'roles',
            Component: Roles,
          },
          {
            path: 'users',
            Component: Users,
          },
          {
            path: 'media',
            Component: Media,
          },
          {
            path: 'categories',
            Component: Categories,
          },
          {
            path: 'brands',
            Component: Brands,
          },
          {
            path: 'attributes',
            Component: Attributes,
          },
          {
            path: 'products',
            Component: Products,
          },
        ],
      },
    ],
  },
]);
