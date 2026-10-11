import { smartText } from '@/features/terminal/lib/smart-text'
import type { OutputStatus, TerminalOutput } from '@/features/terminal/types'
import { cn } from '@/lib/utils'

const statusColor: Record<OutputStatus, string> = {
  info: 'bg-[dodgerblue]',
  success: 'bg-[limegreen]',
  warning: 'bg-[darkorange]',
  error: 'bg-[#c0300f]',
  system: 'bg-[#bfc4c9] text-black',
}

export function ContentOutput({ output }: { output: TerminalOutput }) {
  if (output.type === 'component') {
    return <div className="content-output">{output.node}</div>
  }

  if (output.type !== 'text') return null

  return (
    <div className="content-output inline-flex flex-wrap items-center gap-2">
      {output.status ? (
        <span
          className={cn(
            'rounded-none px-1.5 py-0.5 text-[16px] leading-none text-white',
            statusColor[output.status],
          )}
        >
          {output.status}
        </span>
      ) : null}
      <span className="whitespace-pre-wrap">{smartText(output.text)}</span>
    </div>
  )
}
