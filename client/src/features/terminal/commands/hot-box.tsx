import { useEffect, useState } from 'react'

import { listHotMusics } from '@/features/terminal/api/terminal-api'

type HotSong = {
  id: number
  al: { name: string; picUrl: string }
}

export function HotBox() {
  const [songList, setSongList] = useState<HotSong[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await listHotMusics()
      if (cancelled) return
      if (res?.code === 0 && Array.isArray(res.data)) {
        setSongList(res.data.slice(0, 10))
      } else {
        setError('加载失败')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <div className="text-red-300">{error}</div>
  if (songList.length === 0) {
    return <div className="text-white/70">加载热榜中...</div>
  }

  return (
    <div className="my-2 space-y-2 text-white">
      {songList.map((song) => (
        <div key={song.id} className="flex items-center gap-2">
          <a
            href={`https://music.163.com/#/song?id=${song.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-sky-300 underline underline-offset-2"
          >
            {song.al.name}
          </a>
          {song.al.picUrl ? (
            <img
              src={song.al.picUrl}
              alt={song.al.name}
              height={25}
              width={25}
              className="h-6 w-6 rounded object-cover"
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}
