
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  duration?: number
}

export type ActionType = typeof actionTypes

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

export interface State {
  toasts: ToasterToast[]
}

// Extend the base toast function with shorthand methods
export interface ToastFunction {
  (props: Omit<ToasterToast, "id">): {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  error: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description" | "variant">) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  success: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description" | "variant">) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  info: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description" | "variant">) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
}
