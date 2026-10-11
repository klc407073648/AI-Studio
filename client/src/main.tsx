import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'
import './index.css'

async function enableMocking() {
  const enabled =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false'

  if (!enabled) {
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
