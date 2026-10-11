import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  useCreateInterfaceMutation,
  useUpdateInterfaceMutation,
} from '@/features/interfaces/hooks'
import {
  interfaceFormSchema,
  type InterfaceFormValues,
} from '@/features/interfaces/schemas'
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
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/hooks/use-i18n'
import { ApiError } from '@/lib/api-client'
import type { HttpMethod, InterfaceInfo } from '@/types/interface'

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

type InterfaceFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  iface?: InterfaceInfo | null
}

export function InterfaceFormDialog({
  open,
  onOpenChange,
  iface,
}: InterfaceFormDialogProps) {
  const { t } = useI18n()
  const isEdit = Boolean(iface)
  const createMutation = useCreateInterfaceMutation()
  const updateMutation = useUpdateInterfaceMutation()

  const form = useForm<InterfaceFormValues>({
    resolver: zodResolver(interfaceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      method: 'GET',
      url: '',
      requestParams: '',
      requestHeader: '',
      responseHeader: '',
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      iface
        ? {
            name: iface.name,
            description: iface.description,
            method: iface.method,
            url: iface.url,
            requestParams: iface.requestParams,
            requestHeader: iface.requestHeader,
            responseHeader: iface.responseHeader,
          }
        : {
            name: '',
            description: '',
            method: 'GET',
            url: '',
            requestParams: '',
            requestHeader: '',
            responseHeader: '',
          },
    )
  }, [open, iface, form])

  async function onSubmit(values: InterfaceFormValues) {
    try {
      if (isEdit && iface) {
        await updateMutation.mutateAsync({
          id: iface.id,
          payload: values,
        })
        toast.success(t('iface.updated'))
      } else {
        await createMutation.mutateAsync(values)
        toast.success(t('iface.created'))
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('iface.editTitle') : t('iface.createTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iface.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iface.description')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('iface.method')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('iface.selectMethod')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {methods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('iface.url')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="requestParams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iface.requestParams')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} className="font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestHeader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iface.requestHeader')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} className="font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responseHeader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iface.responseHeader')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} className="font-mono text-xs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
