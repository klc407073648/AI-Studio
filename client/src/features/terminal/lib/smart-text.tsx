import type { ReactNode } from 'react'

const URL_RE = /(https?:\/\/[^\s<]+)/g
const HTML_LINK_RE = /<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi
const BR_RE = /<br\s*\/?>/gi

/**
 * 轻量文本增强：支持简单 <a>/<br> 与裸 URL（阶段 0～1 欢迎语用）
 */
export function smartText(text: string): ReactNode {
  if (!text) return null

  const withBreaks = text.replace(BR_RE, '\n')
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const linkRe = new RegExp(HTML_LINK_RE.source, 'gi')

  while ((match = linkRe.exec(withBreaks)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...linkifyPlain(withBreaks.slice(lastIndex, match.index)))
    }
    parts.push(
      <a
        key={`a-${match.index}`}
        href={match[1]}
        target="_blank"
        rel="noreferrer"
        className="text-sky-300 underline underline-offset-2"
      >
        {match[2]}
      </a>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < withBreaks.length) {
    parts.push(...linkifyPlain(withBreaks.slice(lastIndex)))
  }

  return parts.length === 1 ? parts[0] : parts
}

function linkifyPlain(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const chunks = text.split('\n')
  chunks.forEach((chunk, lineIndex) => {
    if (lineIndex > 0) nodes.push(<br key={`br-${lineIndex}`} />)
    let last = 0
    const urlRe = new RegExp(URL_RE.source, 'g')
    let m: RegExpExecArray | null
    while ((m = urlRe.exec(chunk)) !== null) {
      if (m.index > last) nodes.push(chunk.slice(last, m.index))
      nodes.push(
        <a
          key={`u-${lineIndex}-${m.index}`}
          href={m[1]}
          target="_blank"
          rel="noreferrer"
          className="text-sky-300 underline underline-offset-2"
        >
          {m[1]}
        </a>,
      )
      last = m.index + m[0].length
    }
    if (last < chunk.length) nodes.push(chunk.slice(last))
  })
  return nodes
}
