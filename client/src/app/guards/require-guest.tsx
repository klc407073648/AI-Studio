import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '@/stores/auth-store'

export function RequireGuest() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
