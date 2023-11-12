import { useContext } from "react"
import { AlertContext } from "../context/AlertContext"

export default function useAlerts(alertDuration = 7_000) {
  const { dispatch, alerts } = useContext(AlertContext)

  function setAlert({ message, type }) {
    const id = crypto.randomUUID()

    dispatch({ type: "NEW_ALERT", payload: { id, message, type } })

    setTimeout(() => {
      dismissAlert(id)
    }, alertDuration)
  }

  function dismissAlert(id) {
    const alert = document.querySelector(`[data-alertid="${id}"]`)
    const slide = new KeyframeEffect(alert, [{ translate: "200% 0" }], {
      duration: 200,
      easing: "ease",
      direction: "normal",
      fill: "forwards",
    })

    const animation = new Animation(slide, document.timeline)
    animation.play()
    animation.onfinish = () => {
      dispatch({ type: "REMOVE_ALERT", payload: { id } })
    }
  }

  return { setAlert, dismissAlert, alerts }
}
