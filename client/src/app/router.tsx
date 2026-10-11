import { createBrowserRouter, Navigate } from 'react-router'

import { RequireAdmin } from '@/app/guards/require-admin'
import { RequireAuth } from '@/app/guards/require-auth'
import { RequireGuest } from '@/app/guards/require-guest'
import { AdminLayout } from '@/app/layouts/admin-layout'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { AdminApisPage } from '@/pages/admin/apis'
import { DashboardPage } from '@/pages/dashboard'
import { ForbiddenPage } from '@/pages/forbidden'
import { InterfaceDetailPage } from '@/pages/interfaces/detail'
import { InterfacesPage } from '@/pages/interfaces'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { SettingsPage } from '@/pages/settings'
import { TerminalPage } from '@/pages/terminal'
import { UsersPage } from '@/pages/users'

export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: '/terminal', element: <TerminalPage /> },
      {
        element: <AdminLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/interfaces', element: <InterfacesPage /> },
          { path: '/interfaces/:id', element: <InterfaceDetailPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/403', element: <ForbiddenPage /> },
          {
            element: <RequireAdmin />,
            children: [
              { path: '/users', element: <UsersPage /> },
              { path: '/admin/apis', element: <AdminApisPage /> },
              {
                path: '/admin/interfaces',
                element: <Navigate to="/admin/apis" replace />,
              },
              {
                path: '/admin/analysis',
                element: <Navigate to="/admin/apis?tab=analysis" replace />,
              },
            ],
          },
        ],
      },
    ],
  },
])
