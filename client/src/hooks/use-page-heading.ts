import { useLocation, useParams } from 'react-router'

import { useI18n } from '@/hooks/use-i18n'

export type PageHeading = {
  title: string
  subtitle?: string
}

export function usePageHeading(): PageHeading {
  const { pathname } = useLocation()
  const { id } = useParams()
  const { t } = useI18n()

  if (pathname.startsWith('/interfaces/') && id) {
    return {
      title: t('iface.plazaTitle'),
      subtitle: t('iface.detailTitle'),
    }
  }

  if (pathname === '/models/playground') {
    return {
      title: t('models.playgroundTitle'),
      subtitle: t('models.playgroundSubtitle'),
    }
  }

  if (pathname === '/' || pathname === '') {
    return {
      title: t('dashboard.title'),
      subtitle: t('dashboard.subtitle'),
    }
  }

  if (pathname === '/interfaces') {
    return {
      title: t('iface.plazaTitle'),
      subtitle: t('iface.plazaSubtitle'),
    }
  }

  if (pathname === '/models') {
    return {
      title: t('nav.models'),
      subtitle: t('models.subtitle'),
    }
  }

  if (pathname === '/terminal') {
    return {
      title: t('nav.terminal'),
      subtitle: t('terminal.subtitle'),
    }
  }

  if (pathname === '/users') {
    return {
      title: t('users.title'),
      subtitle: t('users.subtitle'),
    }
  }

  if (pathname === '/admin/apis') {
    return {
      title: t('iface.openApiTitle'),
      subtitle: t('iface.openApiSubtitle'),
    }
  }

  if (pathname === '/settings') {
    return {
      title: t('settings.title'),
      subtitle: t('settings.subtitle'),
    }
  }

  if (pathname === '/403') {
    return {
      title: t('forbidden.title'),
      subtitle: t('forbidden.desc'),
    }
  }

  return { title: t('app.name') }
}
