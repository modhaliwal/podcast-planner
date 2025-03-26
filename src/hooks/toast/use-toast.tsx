
import * as React from "react"
import { ToasterToast, State } from "./types"
import { 
  dispatch, 
  memoryState, 
  listeners, 
  genId, 
  addToAutoDismissQueue 
} from "./toast-reducer"

type Toast = Omit<ToasterToast, "id">

// Helper functions for common toast types
function createToastMethod(variant?: "default" | "destructive") {
  return (message: string, options: Omit<Toast, "title" | "description"> = {}) => {
    return toast({
      title: variant === "destructive" ? "Error" : variant === "default" ? "Info" : "Success",
      description: message,
      variant,
      ...options,
    })
  }
}

// Main toast function
function toast(props: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  const toastToAdd = {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss()
    },
  } as ToasterToast;

  dispatch({
    type: "ADD_TOAST",
    toast: toastToAdd,
  })

  // Add auto-dismiss for non-destructive toasts
  if (props.variant !== "destructive") {
    addToAutoDismissQueue(toastToAdd);
  }

  return {
    id: id,
    dismiss,
    update,
  }
}

// Add shorthand methods to toast
toast.error = createToastMethod("destructive")
toast.success = createToastMethod(undefined)
toast.info = createToastMethod("default")

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
