import { createBrowserRouter } from 'react-router'

import { RequireAdmin } from '@/app/guards/require-admin'
import { RequireAuth } from '@/app/guards/require-auth'
import { RequireGuest } from '@/app/guards/require-guest'
import { AdminLayout } from '@/app/layouts/admin-layout'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { DashboardPage } from '@/pages/dashboard'
import { ForbiddenPage } from '@/pages/forbidden'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { SettingsPage } from '@/pages/settings'
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
      {
        element: <AdminLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/403', element: <ForbiddenPage /> },
          {
            element: <RequireAdmin />,
            children: [{ path: '/users', element: <UsersPage /> }],
          },
        ],
      },
    ],
  },
])
