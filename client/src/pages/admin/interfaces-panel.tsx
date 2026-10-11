import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'

import { InterfaceFormDialog } from '@/features/interfaces/components/interface-form-dialog'
import { InterfaceStatusBadge } from '@/features/interfaces/components/interface-status-badge'
import {
  useDeleteInterfaceMutation,
  useInterfacesQuery,
  useOfflineInterfaceMutation,
  useOnlineInterfaceMutation,
} from '@/features/interfaces/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'
import type {
  HttpMethod,
  InterfaceInfo,
  InterfaceStatus,
} from '@/types/interface'

export function AdminInterfacesPanel() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const name = searchParams.get('name') ?? ''
  const statusParam = searchParams.get('status')
  const methodParam = searchParams.get('method') as HttpMethod | null

  const [keyword, setKeyword] = useState(name)
  const [prevName, setPrevName] = useState(name)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<InterfaceInfo | null>(null)
  const [deleting, setDeleting] = useState<InterfaceInfo | null>(null)

  if (name !== prevName) {
    setPrevName(name)
    setKeyword(name)
  }

  const status: InterfaceStatus | undefined =
    statusParam === '0' ? 0 : statusParam === '1' ? 1 : undefined

  const query = useMemo(
    () => ({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: 10,
      name: name || undefined,
      status,
      method: methodParam || undefined,
    }),
    [page, name, status, methodParam],
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useInterfacesQuery(query)
  const onlineMutation = useOnlineInterfaceMutation()
  const offlineMutation = useOfflineInterfaceMutation()
  const deleteMutation = useDeleteInterfaceMutation()

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1
  const busy =
    onlineMutation.isPending ||
    offlineMutation.isPending ||
    deleteMutation.isPending

  function applySearch(event: FormEvent) {
    event.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (keyword.trim()) next.set('name', keyword.trim())
    else next.delete('name')
    next.set('page', '1')
    setSearchParams(next)
  }

  function setFilter(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  async function handleOnline(item: InterfaceInfo) {
    try {
      await onlineMutation.mutateAsync(item.id)
      toast.success(t('iface.onlineToast'))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.actionFailed'))
    }
  }

  async function handleOffline(item: InterfaceInfo) {
    try {
      await offlineMutation.mutateAsync(item.id)
      toast.success(t('iface.offlineToast'))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.actionFailed'))
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      toast.success(t('iface.deleted'))
      setDeleting(null)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.actionFailed'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          {t('iface.create')}
        </Button>
      </div>

      <form onSubmit={applySearch} className="flex flex-col gap-2 lg:flex-row">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t('iface.searchPlaceholder')}
          className="lg:max-w-sm"
        />
        <Select
          value={statusParam ?? 'all'}
          onValueChange={(value) =>
            setFilter('status', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full lg:w-40" aria-label={t('iface.filterStatus')}>
            <SelectValue placeholder={t('iface.allStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('iface.allStatus')}</SelectItem>
            <SelectItem value="1">{t('iface.statusOnline')}</SelectItem>
            <SelectItem value="0">{t('iface.statusOffline')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={methodParam ?? 'all'}
          onValueChange={(value) =>
            setFilter('method', value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full lg:w-40" aria-label={t('iface.filterMethod')}>
            <SelectValue placeholder={t('iface.allMethods')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('iface.allMethods')}</SelectItem>
            {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const).map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary">
          {t('iface.search')}
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
          <p className="text-destructive text-sm">
            {(error as Error)?.message ?? t('common.loadFailed')}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
          {t('iface.empty')}
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('iface.name')}</TableHead>
                  <TableHead>{t('iface.method')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('iface.url')}</TableHead>
                  <TableHead>{t('iface.status')}</TableHead>
                  <TableHead className="text-right">{t('iface.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.method}</Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-[220px] truncate font-mono text-xs md:table-cell">
                      {item.url}
                    </TableCell>
                    <TableCell>
                      <InterfaceStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="space-x-1 text-right whitespace-nowrap">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/interfaces/${item.id}`}>{t('iface.view')}</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditing(item)
                          setDialogOpen(true)
                        }}
                      >
                        {t('iface.edit')}
                      </Button>
                      {item.status === 0 ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={busy}
                          onClick={() => void handleOnline(item)}
                        >
                          {t('iface.online')}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => void handleOffline(item)}
                        >
                          {t('iface.offline')}
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busy}
                        onClick={() => setDeleting(item)}
                      >
                        {t('iface.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {t('iface.total', { total: data?.total ?? 0 })}
              {isFetching ? ` · ${t('common.refreshing')}` : ''}
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
                {t('common.prev')}
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
                {t('common.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      <InterfaceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        iface={editing}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('iface.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('iface.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleDelete()}>
              {t('iface.confirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
