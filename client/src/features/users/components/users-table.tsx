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
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'
import type { User } from '@/types/user'

type UsersTableProps = {
  users: User[]
  onEdit: (user: User) => void
}

export function UsersTable({ users, onEdit }: UsersTableProps) {
  const { t } = useI18n()
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
      toast.success(
        nextStatus === 'active'
          ? t('users.enabledToast')
          : t('users.disabledToast'),
      )
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('common.actionFailed')
      toast.error(message)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        {t('users.empty')}
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('users.name')}</TableHead>
            <TableHead>{t('users.email')}</TableHead>
            <TableHead>{t('users.role')}</TableHead>
            <TableHead>{t('users.status')}</TableHead>
            <TableHead className="text-right">{t('users.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === 'admin' ? t('role.admin') : t('role.user')}
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active'
                    ? t('status.active')
                    : t('status.disabled')}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2 text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                  {t('users.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={updateMutation.isPending}
                  onClick={() => void toggleStatus(user)}
                >
                  {user.status === 'active'
                    ? t('users.disable')
                    : t('users.enable')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
