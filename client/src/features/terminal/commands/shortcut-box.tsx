import { shortcutList } from '@/features/terminal/core/shortcuts'

export function ShortcutBox() {
  return (
    <div className="space-y-1 text-white">
      <div>快捷键：</div>
      {shortcutList
        .filter((item) => item.desc)
        .map((shortcut) => (
          <div
            key={shortcut.code}
            className="grid grid-cols-[120px_1fr] gap-3"
          >
            <span>{shortcut.keyDesc ?? shortcut.code}</span>
            <span>{shortcut.desc}</span>
          </div>
        ))}
    </div>
  )
}
