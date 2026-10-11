import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.04_230),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.93_0.03_250),transparent_40%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold tracking-tight">Admin Console</p>
          <p className="text-muted-foreground mt-1 text-sm">
            管理系统登录与注册
          </p>
        </div>
        <div className="rounded-xl border bg-card/90 p-6 shadow-sm backdrop-blur">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
