import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuthStore } from '@/stores/auth-store'

export function RequireAuth() {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
