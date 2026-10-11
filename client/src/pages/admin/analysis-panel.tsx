import { Link } from 'react-router'

import { InterfaceStatusBadge } from '@/features/interfaces/components/interface-status-badge'
import { useTopInterfacesQuery } from '@/features/interfaces/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export function AdminAnalysisPanel() {
  const { t } = useI18n()
  const { data, isLoading, isError, error, refetch } = useTopInterfacesQuery(10)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-destructive text-sm">
          {(error as Error)?.message ?? t('common.loadFailed')}
        </p>
        <Button className="mt-3" variant="outline" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        {t('iface.empty')}
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{t('iface.rank')}</TableHead>
            <TableHead>{t('iface.name')}</TableHead>
            <TableHead>{t('iface.method')}</TableHead>
            <TableHead>{t('iface.status')}</TableHead>
            <TableHead className="text-right">{t('iface.totalNum')}</TableHead>
            <TableHead className="text-right">{t('iface.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.method}</Badge>
              </TableCell>
              <TableCell>
                <InterfaceStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {item.totalNum}
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
  )
}
