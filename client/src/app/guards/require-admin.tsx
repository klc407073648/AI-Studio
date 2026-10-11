import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '@/stores/auth-store'

export function RequireAdmin() {
  const user = useAuthStore((state) => state.user)

  if (user?.role !== 'admin') {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
