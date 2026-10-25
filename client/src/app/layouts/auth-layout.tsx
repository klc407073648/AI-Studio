import { Outlet } from 'react-router'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { useI18n } from '@/hooks/use-i18n'

export function AuthLayout() {
  const { t } = useI18n()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.92_0.04_230),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.93_0.03_250),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(0.28_0.05_240),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.24_0.04_255),transparent_40%)]" />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <img src="/favicon.svg" alt="" className="size-8 shrink-0" />
            <p className="text-2xl font-semibold tracking-tight">
              {t('app.name')}
            </p>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('auth.authSubtitle')}
          </p>
        </div>
        <div className="rounded-xl border bg-card/90 p-6 shadow-sm backdrop-blur">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
