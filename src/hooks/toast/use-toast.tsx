
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

function toast({ ...props }: Toast) {
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
