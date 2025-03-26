import { Action, State, actionTypes } from "./types"

// Constants
const TOAST_REMOVE_DELAY = 5000

// Map to store toast timeouts
export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Function to add a toast to the remove queue
export const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Initialize state
export let memoryState: State = { toasts: [] }

// Listeners array
export const listeners: Array<(state: State) => void> = []

// Dispatch function
export function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Reducer function
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Side effects - This could be extracted into a dismissToast() action,
      // but keeping it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Constants
export const TOAST_LIMIT = 5
export const AUTO_DISMISS_DELAY = 2500 // 2.5 seconds for auto-dismissal

// Helper for auto-dismissing non-destructive toasts
export const addToAutoDismissQueue = (toast: { id: string, variant?: string }) => {
  // Don't auto-dismiss destructive (error) toasts
  if (toast.variant === "destructive") {
    return
  }
  
  const timeout = setTimeout(() => {
    dispatch({
      type: "DISMISS_TOAST",
      toastId: toast.id,
    })
  }, AUTO_DISMISS_DELAY)

  // Return timeout for cleanup
  return timeout;
}

// Helper for generating IDs
let count = 0
export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}
