import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Settings2,
  SquareTerminal,
  Terminal,
  Users,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'

import { AppBreadcrumb } from '@/components/app-breadcrumb'
import { CommandMenu } from '@/components/command-menu'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useI18n } from '@/hooks/use-i18n'
import { queryClient } from '@/lib/query-client'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { useUiStore } from '@/stores/ui-store'

type NavLinkItem = {
  type: 'link'
  to: string
  label: string
  icon: LucideIcon
  end: boolean
  adminOnly?: boolean
}

type NavGroupItem = {
  type: 'group'
  label: string
  icon: LucideIcon
  adminOnly?: boolean
  children: NavLinkItem[]
}

type NavEntry = NavLinkItem | NavGroupItem

function NavLinkButton({
  item,
  onNavigate,
}: {
  item: NavLinkItem
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70',
        )
      }
    >
      <item.icon className="size-4" />
      {item.label}
    </NavLink>
  )
}

function NavGroup({
  entry,
  onNavigate,
}: {
  entry: NavGroupItem
  onNavigate?: () => void
}) {
  const { pathname } = useLocation()
  const childActive = entry.children.some(
    (child) =>
      pathname === child.to ||
      (!child.end && pathname.startsWith(`${child.to}/`)),
  )
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive])

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          childActive && 'text-sidebar-foreground font-medium',
        )}
        aria-expanded={open}
      >
        <entry.icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{entry.label}</span>
        <ChevronDown
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            !open && '-rotate-90',
          )}
        />
      </button>
      {open ? (
        <div className="ml-5 border-l border-border/70 py-0.5 pl-3">
          <div className="flex flex-col gap-0.5">
            {entry.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                end={child.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70',
                  )
                }
              >
                <child.icon className="size-4 shrink-0" />
                {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function NavItems({
  entries,
  onNavigate,
}: {
  entries: NavEntry[]
  onNavigate?: () => void
}) {
  const role = useAuthStore((state) => state.user?.role)
  const isAdmin = role === 'admin'

  return (
    <nav className="flex flex-col gap-1 p-3">
      {entries.map((entry) => {
        if (entry.type === 'link') {
          if (entry.adminOnly && !isAdmin) return null
          return (
            <NavLinkButton
              key={entry.to}
              item={entry}
              onNavigate={onNavigate}
            />
          )
        }

        if (entry.adminOnly && !isAdmin) return null

        return (
          <NavGroup key={entry.label} entry={entry} onNavigate={onNavigate} />
        )
      })}
    </nav>
  )
}

export function AdminLayout() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  const [commandOpen, setCommandOpen] = useState(false)

  const navEntries = useMemo<NavEntry[]>(
    () => [
      {
        type: 'link',
        to: '/',
        label: t('nav.dashboard'),
        icon: LayoutDashboard,
        end: true,
      },
      {
        type: 'link',
        to: '/interfaces',
        label: t('nav.interfaces'),
        icon: Waypoints,
        end: false,
      },
      {
        type: 'link',
        to: '/terminal',
        label: t('nav.terminal'),
        icon: Terminal,
        end: false,
      },
      {
        type: 'group',
        label: t('nav.systemGroup'),
        icon: Settings2,
        adminOnly: true,
        children: [
          {
            type: 'link',
            to: '/users',
            label: t('nav.usersShort'),
            icon: Users,
            end: false,
          },
          {
            type: 'link',
            to: '/admin/apis',
            label: t('nav.openApi'),
            icon: SquareTerminal,
            end: false,
          },
        ],
      },
      {
        type: 'link',
        to: '/settings',
        label: t('nav.settings'),
        icon: Settings,
        end: false,
      },
    ],
    [t],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleLogout() {
    clearSession()
    void queryClient.clear()
    navigate('/login', { replace: true })
  }

  const initials = (user?.name ?? 'U').slice(0, 1).toUpperCase()
  const searchHint =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      ? '⌘K'
      : 'Ctrl K'

  return (
    <div className="bg-background flex min-h-screen">
      <aside
        className={cn(
          'border-sidebar-border bg-sidebar hidden w-60 shrink-0 border-r md:flex md:flex-col',
          !sidebarOpen && 'md:hidden',
        )}
      >
        <div className="px-4 py-5">
          <p className="text-lg font-semibold tracking-tight">{t('app.name')}</p>
          <p className="text-muted-foreground text-xs">{t('app.subtitle')}</p>
        </div>
        <Separator />
        <NavItems entries={navEntries} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-card/80 sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-4" />
                  <span className="sr-only">{t('header.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="px-4 py-5">
                  <p className="text-lg font-semibold">{t('app.name')}</p>
                </div>
                <Separator />
                <NavItems entries={navEntries} />
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="size-4" />
              <span className="sr-only">{t('header.toggleSidebar')}</span>
            </Button>
            <div className="min-w-0">
              <p className="text-sm font-medium">{t('app.backend')}</p>
              <div className="hidden sm:block">
                <AppBreadcrumb />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              className="text-muted-foreground hidden h-9 w-48 justify-start gap-2 px-3 font-normal lg:inline-flex"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4" />
              <span className="flex-1 text-left">{t('header.search')}</span>
              <kbd className="bg-muted pointer-events-none rounded border px-1.5 py-0.5 text-[10px] font-medium">
                {searchHint}
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setCommandOpen(true)}
              aria-label={t('header.search')}
            >
              <Search className="size-4" />
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="size-7">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="size-4" />
                  {t('nav.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" />
                  {t('header.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 sm:hidden">
            <AppBreadcrumb />
          </div>
          <Outlet />
        </main>
      </div>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}
