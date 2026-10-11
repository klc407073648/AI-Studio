import { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, Settings, Users } from 'lucide-react'
import { useNavigate } from 'react-router'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { fetchUsers } from '@/features/users/api'
import { useI18n } from '@/hooks/use-i18n'
import { useAuthStore } from '@/stores/auth-store'
import type { User } from '@/types/user'

type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const role = useAuthStore((state) => state.user?.role)
  const isAdmin = role === 'admin'
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!open || !isAdmin) return

    const keyword = query.trim()
    if (!keyword) return

    let cancelled = false
    const timer = window.setTimeout(() => {
      setSearching(true)
      void fetchUsers({ page: 1, pageSize: 8, q: keyword })
        .then((result) => {
          if (!cancelled) setUsers(result.items)
        })
        .catch(() => {
          if (!cancelled) setUsers([])
        })
        .finally(() => {
          if (!cancelled) setSearching(false)
        })
    }, 220)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, open, isAdmin])

  const matchedUsers = query.trim() ? users : []

  const navItems = useMemo(
    () =>
      [
        {
          to: '/',
          label: t('nav.dashboard'),
          icon: LayoutDashboard,
        },
        ...(isAdmin
          ? [
              {
                to: '/users',
                label: t('nav.users'),
                icon: Users,
              },
            ]
          : []),
        {
          to: '/settings',
          label: t('nav.settings'),
          icon: Settings,
        },
      ] as const,
    [isAdmin, t],
  )

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setQuery('')
      setUsers([])
      setSearching(false)
    }
    onOpenChange(nextOpen)
  }

  function runCommand(action: () => void) {
    handleOpenChange(false)
    action()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t('command.title')}
      description={t('command.placeholder')}
    >
      <CommandInput
        placeholder={t('command.placeholder')}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? t('users.refreshing') : t('command.noResults')}
        </CommandEmpty>
        <CommandGroup heading={t('command.navigation')}>
          {navItems.map((item) => (
            <CommandItem
              key={item.to}
              value={`${item.label} ${item.to}`}
              onSelect={() => runCommand(() => navigate(item.to))}
            >
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {isAdmin ? (
          <>
            <CommandSeparator />
            <CommandGroup heading={t('command.users')}>
              <CommandItem
                value={`${t('command.viewUsers')} users`}
                onSelect={() =>
                  runCommand(() => {
                    const q = query.trim()
                    navigate(q ? `/users?q=${encodeURIComponent(q)}` : '/users')
                  })
                }
              >
                <Users />
                {t('command.viewUsers')}
              </CommandItem>
              {matchedUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email}`}
                  onSelect={() =>
                    runCommand(() =>
                      navigate(`/users?q=${encodeURIComponent(user.email)}`),
                    )
                  }
                >
                  <Users />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}
