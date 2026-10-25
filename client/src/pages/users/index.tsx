import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'

import { UserFormDialog } from '@/features/users/components/user-form-dialog'
import { UsersTable } from '@/features/users/components/users-table'
import { useUsersQuery } from '@/features/users/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/hooks/use-i18n'
import type { User } from '@/types/user'

export function UsersPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const q = searchParams.get('q') ?? ''
  const [keyword, setKeyword] = useState(q)
  const [prevQ, setPrevQ] = useState(q)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  if (q !== prevQ) {
    setPrevQ(q)
    setKeyword(q)
  }

  const query = useMemo(
    () => ({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: 10,
      q: q || undefined,
    }),
    [page, q],
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useUsersQuery(query)

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1

  function applySearch(event: FormEvent) {
    event.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (keyword.trim()) next.set('q', keyword.trim())
    else next.delete('q')
    next.set('page', '1')
    setSearchParams(next)
  }

  function openCreate() {
    setEditingUser(null)
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>{t('users.create')}</Button>
      </div>

      <form onSubmit={applySearch} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t('users.searchPlaceholder')}
          className="sm:max-w-sm"
        />
        <Button type="submit" variant="secondary">
          {t('users.search')}
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-destructive">
            {(error as Error)?.message ?? t('users.loadFailed')}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => void refetch()}>
            {t('users.retry')}
          </Button>
        </div>
      ) : (
        <>
          <UsersTable users={data?.items ?? []} onEdit={openEdit} />
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('users.total', { total: data?.total ?? 0 })}
              {isFetching ? ` · ${t('users.refreshing')}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={query.page <= 1}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', String(query.page - 1))
                  setSearchParams(next)
                }}
              >
                {t('users.prev')}
              </Button>
              <span className="text-sm">
                {query.page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={query.page >= totalPages}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', String(query.page + 1))
                  setSearchParams(next)
                }}
              >
                {t('users.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
      />
    </div>
  )
}
