import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/features/users/hooks'
import {
  createUserFormSchema,
  type UserFormValues,
} from '@/features/users/schemas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'
import type { User } from '@/types/user'

type UserFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const { t } = useI18n()
  const isEdit = Boolean(user)
  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserFormSchema(isEdit)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      user
        ? {
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            status: user.status,
          }
        : {
            name: '',
            email: '',
            password: '',
            role: 'user',
            status: 'active',
          },
    )
  }, [open, user, form])

  async function onSubmit(values: UserFormValues) {
    try {
      if (isEdit && user) {
        await updateMutation.mutateAsync({
          id: user.id,
          payload: {
            name: values.name,
            email: values.email,
            role: values.role,
            status: values.status,
            password: values.password || undefined,
          },
        })
        toast.success(t('users.updated'))
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password ?? '',
          role: values.role,
          status: values.status,
        })
        toast.success(t('users.created'))
      }
      onOpenChange(false)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('common.saveFailed')
      toast.error(message)
    }
  }

  const busy = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('users.editTitle') : t('users.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('users.name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEdit
                      ? t('users.passwordOptional')
                      : t('users.passwordInitial')}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.role')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('users.selectRole')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t('role.admin')}</SelectItem>
                        <SelectItem value="user">{t('role.user')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('users.selectStatus')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t('status.active')}</SelectItem>
                        <SelectItem value="disabled">
                          {t('status.disabled')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                {t('users.cancel')}
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? t('users.saving') : t('users.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
