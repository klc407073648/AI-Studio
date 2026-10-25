import { useSearchParams } from 'react-router'

import { AdminAnalysisPanel } from '@/pages/admin/analysis-panel'
import { AdminInterfacesPanel } from '@/pages/admin/interfaces-panel'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { cn } from '@/lib/utils'

type ApisTab = 'list' | 'analysis'

export function AdminApisPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: ApisTab =
    searchParams.get('tab') === 'analysis' ? 'analysis' : 'list'

  function setTab(next: ApisTab) {
    const params = new URLSearchParams(searchParams)
    if (next === 'analysis') {
      params.set('tab', 'analysis')
      params.delete('page')
      params.delete('name')
      params.delete('status')
      params.delete('method')
    } else {
      params.delete('tab')
    }
    setSearchParams(params)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'rounded-none border-b-2 border-transparent px-3 pb-2',
            tab === 'list' && 'border-primary text-foreground',
          )}
          onClick={() => setTab('list')}
        >
          {t('iface.tabList')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'rounded-none border-b-2 border-transparent px-3 pb-2',
            tab === 'analysis' && 'border-primary text-foreground',
          )}
          onClick={() => setTab('analysis')}
        >
          {t('iface.tabAnalysis')}
        </Button>
      </div>

      {tab === 'list' ? <AdminInterfacesPanel /> : <AdminAnalysisPanel />}
    </div>
  )
}
