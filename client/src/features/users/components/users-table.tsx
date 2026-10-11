import { toast } from 'sonner'

import { useUpdateUserMutation } from '@/features/users/hooks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ApiError } from '@/lib/api-client'
import type { User } from '@/types/user'

type UsersTableProps = {
  users: User[]
  onEdit: (user: User) => void
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  const updateMutation = useUpdateUserMutation()

  async function toggleStatus(user: User) {
    const nextStatus = user.status === 'active' ? 'disabled' : 'active'
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        payload: {
          name: user.name,
          email: user.email,
          role: user.role,
          status: nextStatus,
        },
      })
      toast.success(nextStatus === 'active' ? '已启用用户' : '已禁用用户')
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '操作失败，请稍后重试'
      toast.error(message)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        暂无用户数据
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === 'admin' ? '管理员' : '普通用户'}
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? '启用' : '禁用'}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={updateMutation.isPending}
                  onClick={() => void toggleStatus(user)}
                >
                  {user.status === 'active' ? '禁用' : '启用'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
