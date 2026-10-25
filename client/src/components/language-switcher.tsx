import { Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/hooks/use-i18n'
import type { Locale } from '@/i18n'

const options: { value: Locale; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useI18n()
  const currentLabel =
    options.find((option) => option.value === locale)?.label ?? options[0].label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-1.5 px-2"
          aria-label={t('header.language')}
        >
          <Globe className="size-4 shrink-0" />
          <span className="text-sm font-normal">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLocale(option.value)}
            className={locale === option.value ? 'bg-accent' : undefined}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
