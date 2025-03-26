
import { ToasterToast, State, Action, actionTypes } from "./types";

// Initial state
export const memoryState: State = { toasts: [] };

// A list of states to update
export const listeners: ((state: State) => void)[] = [];

// Dispatch function to update state
export const dispatch = (action: Action) => {
  memoryState.toasts = reducer(memoryState.toasts, action);
  listeners.forEach((listener) => {
    listener({ ...memoryState });
  });
};

// Generate a unique ID for each toast
export const genId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Add to auto-dismiss queue
export const addToAutoDismissQueue = (toast: ToasterToast) => {
  if (toast.duration) {
    setTimeout(() => {
      dispatch({
        type: 'DISMISS_TOAST',
        toastId: toast.id,
      });
    }, toast.duration);
  }
};

// Reducer
export const reducer = (state: ToasterToast[], action: Action): ToasterToast[] => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return [action.toast, ...state];

    case actionTypes.UPDATE_TOAST:
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // If no id, dismiss all
      if (toastId === undefined) {
        return state.map((t) => ({
          ...t,
          open: false,
        }));
      }

      // Find the toast to dismiss
      return state.map((t) =>
        t.id === toastId ? { ...t, open: false } : t
      );
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      // If no id, remove all closed toasts
      if (toastId === undefined) {
        return state.filter((t) => t.open !== false);
      }

      // Remove specific toast
      return state.filter((t) => t.id !== toastId);
    }
  }
};

// Auto-dismiss removed toasts after animation
// This allows for exit animations to complete
export const autoRemoveToast = () => {
  setTimeout(() => {
    dispatch({
      type: 'REMOVE_TOAST',
    });
  }, 1000);
};
