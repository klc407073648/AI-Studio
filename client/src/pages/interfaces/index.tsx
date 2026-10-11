import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { InterfaceStatusBadge } from '@/features/interfaces/components/interface-status-badge'
import { useInterfacesQuery } from '@/features/interfaces/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { InterfaceStatus } from '@/types/interface'

export function InterfacesPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const name = searchParams.get('name') ?? ''
  const [keyword, setKeyword] = useState(name)
  const [prevName, setPrevName] = useState(name)

  if (name !== prevName) {
    setPrevName(name)
    setKeyword(name)
  }

  const query = useMemo(
    () => ({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: 10,
      name: name || undefined,
      // 广场默认只展示已发布；可通过 ?status= 覆盖
      status: (searchParams.get('status') === '0'
        ? 0
        : searchParams.get('status') === 'all'
          ? undefined
          : 1) as InterfaceStatus | undefined,
    }),
    [page, name, searchParams],
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useInterfacesQuery(query)

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1

  function applySearch(event: FormEvent) {
    event.preventDefault()
    const next = new URLSearchParams(searchParams)
    if (keyword.trim()) next.set('name', keyword.trim())
    else next.delete('name')
    next.set('page', '1')
    setSearchParams(next)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('iface.plazaTitle')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('iface.plazaSubtitle')}
        </p>
      </div>

      <form onSubmit={applySearch} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t('iface.searchPlaceholder')}
          className="sm:max-w-sm"
        />
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
                  <TableHead className="hidden md:table-cell">
                    {t('iface.description')}
                  </TableHead>
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
                    <TableCell className="text-muted-foreground hidden max-w-xs truncate md:table-cell">
                      {item.description || '—'}
                    </TableCell>
                    <TableCell>
                      <InterfaceStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/interfaces/${item.id}`}>{t('iface.view')}</Link>
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
    </div>
  )
}
