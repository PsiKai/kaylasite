import { useContext } from "react"
import { AlertContext } from "../context/AlertContext"

export default function useAlerts(alertDuration = 5_000) {
  const { dispatch, alerts } = useContext(AlertContext)

  function setAlert({ message, type }) {
    const id = crypto.randomUUID()

    dispatch({ type: "NEW_ALERT", payload: { id, message, type } })

    setTimeout(() => {
      dispatch({ type: "REMOVE_ALERT", payload: { id } })
    }, alertDuration)
  }

  function dismissAlert(id) {
    dispatch({ type: "REMOVE_ALERT", payload: { id } })
  }

  return { setAlert, dismissAlert, alerts }
}
