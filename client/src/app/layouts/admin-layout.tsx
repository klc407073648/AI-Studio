import {
  Bot,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  Search,
  Settings,
  Settings2,
  SquareTerminal,
  Terminal,
  Users,
  Waypoints,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'

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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useI18n } from '@/hooks/use-i18n'
import { usePageHeading } from '@/hooks/use-page-heading'
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
  collapsed,
}: {
  item: NavLinkItem
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70',
        )
      }
    >
      <item.icon className="size-4 shrink-0" />
      {!collapsed ? item.label : <span className="sr-only">{item.label}</span>}
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

function NavGroupFlyout({
  entry,
  onNavigate,
  collapsed,
}: {
  entry: NavGroupItem
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { pathname } = useLocation()
  const childActive = entry.children.some(
    (child) =>
      pathname === child.to ||
      (!child.end && pathname.startsWith(`${child.to}/`)),
  )
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  useLayoutEffect(() => {
    if (!flyoutOpen || !triggerRef.current) return

    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      setCoords({
        top: rect.top,
        left: rect.right + 8,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [flyoutOpen])

  function clearCloseTimer() {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function showFlyout() {
    clearCloseTimer()
    setFlyoutOpen(true)
  }

  function hideFlyout() {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      setFlyoutOpen(false)
      closeTimer.current = null
    }, 150)
  }

  return (
    <div
      className="relative mt-1"
      onMouseEnter={showFlyout}
      onMouseLeave={hideFlyout}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          collapsed && 'justify-center px-2',
          (childActive || flyoutOpen) &&
            'bg-sidebar-accent text-sidebar-foreground font-medium',
        )}
        aria-expanded={flyoutOpen}
        aria-haspopup="menu"
        onFocus={showFlyout}
        onBlur={(event) => {
          const next = event.relatedTarget
          if (
            next instanceof Node &&
            (triggerRef.current?.contains(next) ||
              document.getElementById(`nav-flyout-${entry.label}`)?.contains(next))
          ) {
            return
          }
          hideFlyout()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setFlyoutOpen(false)
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setFlyoutOpen((value) => !value)
          }
        }}
      >
        <entry.icon className="size-4 shrink-0" />
        {!collapsed ? (
          <>
            <span className="flex-1 text-left">{entry.label}</span>
            <ChevronDown className="text-muted-foreground size-4 shrink-0 -rotate-90" />
          </>
        ) : (
          <span className="sr-only">{entry.label}</span>
        )}
      </button>
      {flyoutOpen
        ? createPortal(
            <div
              id={`nav-flyout-${entry.label}`}
              role="menu"
              style={{ top: coords.top, left: coords.left }}
              className="border-border bg-popover text-popover-foreground fixed z-50 min-w-44 rounded-md border p-1 shadow-md"
              onMouseEnter={showFlyout}
              onMouseLeave={hideFlyout}
            >
              <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                {entry.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {entry.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.end}
                    role="menuitem"
                    onClick={() => {
                      setFlyoutOpen(false)
                      onNavigate?.()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-accent/70',
                      )
                    }
                  >
                    <child.icon className="size-4 shrink-0" />
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

function NavGroupInline({
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
        <div className="border-border/70 ml-5 border-l py-0.5 pl-3">
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
  collapsed = false,
  submenuMode = 'flyout',
}: {
  entries: NavEntry[]
  onNavigate?: () => void
  collapsed?: boolean
  /** Desktop sidebar uses hover flyout; mobile sheet keeps inline accordion. */
  submenuMode?: 'flyout' | 'inline'
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
              collapsed={collapsed}
            />
          )
        }

        if (entry.adminOnly && !isAdmin) return null

        if (submenuMode === 'inline') {
          return (
            <NavGroupInline
              key={entry.label}
              entry={entry}
              onNavigate={onNavigate}
            />
          )
        }

        return (
          <NavGroupFlyout
            key={entry.label}
            entry={entry}
            onNavigate={onNavigate}
            collapsed={collapsed}
          />
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
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebarCollapsed = useUiStore(
    (state) => state.toggleSidebarCollapsed,
  )
  const pageHeading = usePageHeading()
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
        to: '/models',
        label: t('nav.models'),
        icon: Bot,
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
    <TooltipProvider delayDuration={0}>
      <div className="bg-background flex min-h-screen">
        <aside
          className={cn(
            'border-sidebar-border bg-sidebar hidden shrink-0 border-r transition-[width] duration-200 ease-in-out md:flex md:flex-col',
            sidebarCollapsed ? 'w-14' : 'w-60',
          )}
        >
          <div
            className={cn(
              'flex items-center px-3 py-4',
              sidebarCollapsed ? 'justify-center px-2' : 'justify-between gap-2',
            )}
          >
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="hover:bg-sidebar-accent/70 flex size-9 items-center justify-center rounded-md"
                    onClick={() => toggleSidebarCollapsed()}
                    aria-expanded={false}
                    aria-label={t('header.toggleSidebar')}
                  >
                    <img
                      src="/favicon.svg"
                      alt=""
                      className="size-4 shrink-0"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {t('header.toggleSidebar')}
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src="/favicon.svg"
                    alt=""
                    className="size-4 shrink-0"
                  />
                  <span className="truncate text-lg font-semibold tracking-tight">
                    {t('app.name')}
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent/70 shrink-0"
                      onClick={() => toggleSidebarCollapsed()}
                      aria-expanded
                      aria-label={t('header.toggleSidebar')}
                    >
                      <PanelLeftClose className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {t('header.toggleSidebar')}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavItems entries={navEntries} collapsed={sidebarCollapsed} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-card/80 sticky top-0 z-10 flex h-[4.5rem] items-center justify-between gap-3 border-b px-4 backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="size-4" />
                    <span className="sr-only">{t('header.openMenu')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex items-center gap-2 px-4 py-5">
                    <img src="/favicon.svg" alt="" className="size-4 shrink-0" />
                    <p className="text-lg font-semibold">{t('app.name')}</p>
                  </div>
                  <NavItems entries={navEntries} submenuMode="inline" />
                </SheetContent>
              </Sheet>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="truncate text-xl leading-tight font-semibold tracking-tight">
                  {pageHeading.title}
                </p>
                {pageHeading.subtitle ? (
                  <p className="text-muted-foreground truncate text-sm leading-tight">
                    {pageHeading.subtitle}
                  </p>
                ) : null}
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
              <ThemeToggle />
              <LanguageSwitcher />
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
            <Outlet />
          </main>
        </div>

        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </TooltipProvider>
  )
}
