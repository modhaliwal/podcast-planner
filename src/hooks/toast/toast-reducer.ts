
import { ToasterToast, State, Action, actionTypes } from "./types"

// In-memory state that stores toasts between re-renders
export const memoryState: State = { toasts: [] }

// Listeners that update component state when store changes
export const listeners: Array<(state: State) => void> = []

// Toast ID generator
export const genId = () => Math.random().toString(36).substring(2, 9)

// Track auto-dismiss timeouts
let dismissTimeouts: Map<string, NodeJS.Timeout> = new Map()

// Add toast to auto-dismiss queue
export function addToAutoDismissQueue(toast: ToasterToast) {
  if (!toast.id) return
  
  // Clear any existing timeout
  if (dismissTimeouts.has(toast.id)) {
    clearTimeout(dismissTimeouts.get(toast.id))
  }
  
  // Set default duration if not specified
  const duration = toast.duration || 5000
  
  // Set timeout to auto-dismiss
  const timeout = setTimeout(() => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id })
  }, duration)
  
  // Store timeout reference
  dismissTimeouts.set(toast.id, timeout)
}

// Update all listeners with new state
function updateListeners(newState: State) {
  memoryState.toasts = newState.toasts
  listeners.forEach(listener => {
    listener(newState)
  })
}

// Dispatch actions to update state
export function dispatch(action: Action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      updateListeners({
        toasts: [action.toast, ...memoryState.toasts]
      })
      break
      
    case actionTypes.UPDATE_TOAST:
      updateListeners({
        toasts: memoryState.toasts.map(t => 
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      })
      break
      
    case actionTypes.DISMISS_TOAST: {
      // Remove any dismiss timeout
      if (action.toastId && dismissTimeouts.has(action.toastId)) {
        clearTimeout(dismissTimeouts.get(action.toastId))
        dismissTimeouts.delete(action.toastId)
      }
      
      // If no ID, dismiss all
      const toastId = action.toastId
      
      updateListeners({
        toasts: memoryState.toasts.map(t => 
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        )
      })
      break
    }
      
    case actionTypes.REMOVE_TOAST:
      // If no ID, remove all closed toasts
      if (action.toastId === undefined) {
        updateListeners({
          toasts: memoryState.toasts.filter(t => t.open)
        })
        return
      }
      
      // Remove toast by ID
      updateListeners({
        toasts: memoryState.toasts.filter(t => t.id !== action.toastId)
      })
      break
  }
}
