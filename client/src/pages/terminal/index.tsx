import { useCallback, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import {
  CmdTerminal,
  type CmdTerminalHandle,
} from '@/features/terminal/components/cmd-terminal'
import { doCommandExecute } from '@/features/terminal/core/command-executor'
import type { TerminalApi } from '@/features/terminal/types'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/hooks/use-i18n'
import { useAuthStore } from '@/stores/auth-store'

export function TerminalPage() {
  const { t } = useI18n()
  const userName = useAuthStore((state) => state.user?.name ?? 'local')
  const terminalRef = useRef<CmdTerminalHandle>(null)

  const onSubmitCommand = useCallback(
    async (inputText: string, terminal: TerminalApi) => {
      if (!inputText.trim()) return
      await doCommandExecute(inputText, terminal)
    },
    [],
  )

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="bg-white/10 text-white hover:bg-white/20"
        >
          <Link to="/">
            <ArrowLeft className="size-4" />
            {t('terminal.back')}
          </Link>
        </Button>
      </div>
      <CmdTerminal
        ref={terminalRef}
        fullScreen
        userName={userName}
        onSubmitCommand={onSubmitCommand}
      />
    </div>
  )
}
