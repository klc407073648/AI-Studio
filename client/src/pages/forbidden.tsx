import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function ForbiddenPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">403 无权限</h1>
      <p className="text-muted-foreground text-sm">
        你没有访问该页面的权限。
      </p>
      <Button asChild>
        <Link to="/">返回仪表盘</Link>
      </Button>
    </div>
  )
}
