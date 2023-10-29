import { createContext, useReducer } from "react"

export const AlertContext = createContext()

export function AlertProvider(props) {
  const [alerts, dispatch] = useReducer(AlertsReducer, [])

  return <AlertContext.Provider value={{ alerts, dispatch }} {...props} />
}

function AlertsReducer(state, action) {
  switch (action.type) {
    case "NEW_ALERT":
      return [...state, action.payload]
    case "REMOVE_ALERT":
      return state.filter(alert => alert.id !== action.payload.id)
    default:
      return state
  }
}
