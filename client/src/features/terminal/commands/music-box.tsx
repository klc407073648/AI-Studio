import { useEffect, useState } from 'react'

import { getSingleMusic } from '@/features/terminal/api/terminal-api'

export function MusicBox({ name }: { name: string }) {
  const [musicPath, setMusicPath] = useState('')
  const [errorHint, setErrorHint] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await getSingleMusic(name)
      if (cancelled) return
      if (res?.code === 0 && res.data?.id) {
        setMusicPath(
          `https://music.163.com/outchain/player?type=2&id=${res.data.id}&auto=1&height=66`,
        )
      } else {
        setErrorHint('未找到音乐')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [name])

  if (errorHint) return <div className="text-red-300">{errorHint}</div>
  if (!musicPath) return <div className="text-white/70">加载中...</div>

  return (
    <iframe
      title={`music-${name}`}
      frameBorder={0}
      width={330}
      height={86}
      src={musicPath}
      className="my-2"
    />
  )
}
