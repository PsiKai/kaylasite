import { useContext } from "react"
import { AlertContext } from "../context/AlertContext"

export default function useAlerts(alertDuration = 7_000) {
  const { dispatch, alerts } = useContext(AlertContext)

  function setAlert({ message, type }) {
    const id = crypto.randomUUID()

    dispatch({ type: "NEW_ALERT", payload: { id, message, type } })

    setTimeout(() => {
      requestAnimationFrame(() => dismissAlert(id))
    }, alertDuration)
  }

  function dismissAlert(id) {
    const alert = document.querySelector(`[data-alertid="${id}"]`)
    if (!alert) return

    const { height } = alert.getBoundingClientRect()
    const slideFrames = new KeyframeEffect(alert, [{ translate: "200% 0" }], {
      duration: 200,
      easing: "ease",
      fill: "forwards",
    })

    const collapseFrames = new KeyframeEffect(
      alert,
      [{ maxHeight: `${height}px` }, { maxHeight: "0" }],
      {
        duration: 100,
        easing: "ease-in",
        fill: "forwards",
      }
    )
    const slideAnimation = new Animation(slideFrames, document.timeline)
    const collapseAnimation = new Animation(collapseFrames, document.timeline)
    slideAnimation.play()
    slideAnimation.onfinish = () => {
      collapseAnimation.play()
    }
    collapseAnimation.onfinish = () => {
      dispatch({ type: "REMOVE_ALERT", payload: { id } })
    }
  }

  return { setAlert, dismissAlert, alerts }
}
