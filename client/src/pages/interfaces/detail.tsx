import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

import { InterfaceStatusBadge } from '@/features/interfaces/components/interface-status-badge'
import {
  useInterfaceQuery,
  useInvokeInterfaceMutation,
} from '@/features/interfaces/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'

export function InterfaceDetailPage() {
  const { id = '' } = useParams()
  const { t } = useI18n()
  const { data, isLoading, isError, error, refetch } = useInterfaceQuery(id)
  const invokeMutation = useInvokeInterfaceMutation()
  const [paramsText, setParamsText] = useState<string | null>(null)
  const [resultText, setResultText] = useState('')

  const requestParams =
    paramsText ?? data?.requestParams ?? '{\n  \n}'

  async function handleInvoke() {
    try {
      const result = await invokeMutation.mutateAsync({
        id,
        payload: { userRequestParams: requestParams },
      })
      setResultText(result.raw)
      toast.success(t('iface.invokeSuccess'))
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : t('common.actionFailed')
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-destructive text-sm">
          {(error as Error)?.message ?? t('common.loadFailed')}
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => void refetch()}>
            {t('common.retry')}
          </Button>
          <Button asChild variant="secondary">
            <Link to="/interfaces">{t('iface.backToList')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {data.description || t('iface.detailTitle')}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/interfaces">{t('iface.backToList')}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('iface.docs')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{t('iface.method')}</p>
            <Badge variant="outline" className="mt-1">
              {data.method}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">{t('iface.status')}</p>
            <div className="mt-1">
              <InterfaceStatusBadge status={data.status} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">{t('iface.url')}</p>
            <p className="mt-1 break-all font-mono text-xs">{data.url}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('iface.requestHeader')}</p>
            <pre className="bg-muted mt-1 overflow-x-auto rounded-md p-2 font-mono text-xs">
              {data.requestHeader || '—'}
            </pre>
          </div>
          <div>
            <p className="text-muted-foreground">{t('iface.responseHeader')}</p>
            <pre className="bg-muted mt-1 overflow-x-auto rounded-md p-2 font-mono text-xs">
              {data.responseHeader || '—'}
            </pre>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground">{t('iface.requestParams')}</p>
            <pre className="bg-muted mt-1 overflow-x-auto rounded-md p-2 font-mono text-xs">
              {data.requestParams || '—'}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('iface.invokeTitle')}</CardTitle>
          <CardDescription>{t('iface.invokeDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={8}
            className="font-mono text-xs"
            value={requestParams}
            onChange={(event) => setParamsText(event.target.value)}
            disabled={data.status !== 1}
          />
          <Button
            onClick={() => void handleInvoke()}
            disabled={data.status !== 1 || invokeMutation.isPending}
          >
            {invokeMutation.isPending ? t('iface.invoking') : t('iface.invoke')}
          </Button>
          {resultText ? (
            <div>
              <p className="mb-2 text-sm font-medium">{t('iface.invokeResult')}</p>
              <pre className="bg-muted max-h-80 overflow-auto rounded-md p-3 font-mono text-xs">
                {resultText}
              </pre>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
