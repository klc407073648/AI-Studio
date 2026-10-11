import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { login } from '@/features/auth/api'
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export function LoginForm() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const setSession = useAuthStore((state) => state.setSession)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'admin123',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true)
    try {
      const session = await login(values)
      setSession(session)
      toast.success(t('auth.loginSuccess'))
      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('common.actionFailed')
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
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
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? t('auth.loggingIn') : t('auth.login')}
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary underline-offset-4 hover:underline">
            {t('auth.goRegister')}
          </Link>
        </p>
      </form>
    </Form>
  )
}
