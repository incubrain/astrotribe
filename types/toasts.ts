import { z } from 'zod'

export const ToastActionSchema = z.object({
  variant: z.string(),
  color: z.string(),
  label: z.string()
})

export const ToastSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  timeout: z.number().optional(),
  ui: z.unknown().optional(),
  avatar: z.unknown().optional(),
  closeButton: z.unknown().optional(),
  actions: z.array(ToastActionSchema).optional(),
  callback: z.function().optional()
})

export const ToastStateSchema = z.object({
  toasts: z.array(ToastSchema)
})

export type ToastType = z.infer<typeof ToastSchema>
export type ToastActionType = z.infer<typeof ToastActionSchema>
export type ToastStateType = z.infer<typeof ToastStateSchema>
