import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/hooks/use-i18n'
import type { InterfaceStatus } from '@/types/interface'

export function InterfaceStatusBadge({ status }: { status: InterfaceStatus }) {
  const { t } = useI18n()
  const online = status === 1

  return (
    <Badge variant={online ? 'default' : 'secondary'}>
      {online ? t('iface.statusOnline') : t('iface.statusOffline')}
    </Badge>
  )
}
