import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">仪表盘</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          欢迎回来，{user?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>当前账号</CardTitle>
            <CardDescription>会话信息来自 Zustand 持久化存储</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>邮箱：{user?.email}</p>
            <p>角色：{user?.role === 'admin' ? '管理员' : '普通用户'}</p>
            <p>状态：{user?.status === 'active' ? '启用' : '禁用'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快捷入口</CardTitle>
            <CardDescription>进入常用管理功能</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.role === 'admin' ? (
              <Button asChild>
                <Link to="/users">用户管理</Link>
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                普通用户暂无管理入口，请联系管理员提升权限。
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
