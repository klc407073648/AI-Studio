export function BilibiliBox({ bvid }: { bvid: string }) {
  return (
    <iframe
      title={`bilibili-${bvid}`}
      frameBorder={0}
      allowFullScreen
      src={`https://player.bilibili.com/player.html?bvid=${bvid}`}
      className="my-2 h-64 w-full max-w-xl"
    />
  )
}
