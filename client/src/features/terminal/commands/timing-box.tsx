import { useEffect, useRef, useState } from 'react'

export function TimingBox({ seconds }: { seconds: string | number }) {
  const total = Math.max(0, Number(seconds) || 0)
  const [leftTime, setLeftTime] = useState(total)
  const [running, setRunning] = useState(true)
  const runningRef = useRef(running)

  useEffect(() => {
    runningRef.current = running
  }, [running])

  useEffect(() => {
    if (!total) return
    const timer = window.setInterval(() => {
      if (!runningRef.current) return
      setLeftTime((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          window.alert(`${total} 秒倒计时结束`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [total])

  return (
    <div className="space-y-1 text-white">
      <div>倒计时：{total} 秒</div>
      <div className="flex items-center gap-2">
        <span>剩余：{leftTime} 秒</span>
        {leftTime > 0 ? (
          <button
            type="button"
            className="rounded border border-white/30 px-2 py-0.5 text-xs hover:bg-white/10"
            onClick={() => setRunning((value) => !value)}
          >
            {running ? '暂停' : '继续'}
          </button>
        ) : null}
      </div>
    </div>
  )
}
