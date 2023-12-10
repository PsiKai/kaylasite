import { useContext } from "react"
import { AlertContext } from "../context/AlertContext"
import { v4 as uuidv4 } from "uuid"

export default function useAlerts(alertDuration = 7_000) {
  const { dispatch, alerts } = useContext(AlertContext)

  function setAlert({ message, type }) {
    const id = uuidv4()
    const timeout = setAlertTimeout(id)

    dispatch({ type: "NEW_ALERT", payload: { id, message, type, timeout } })
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
      },
    )
    const slideAnimation = new Animation(slideFrames, document.timeline)
    const collapseAnimation = new Animation(collapseFrames, document.timeline)
    slideAnimation.play()
    slideAnimation.onfinish = () => {
      collapseAnimation.play()
    }
    collapseAnimation.onfinish = () => {
      pauseDismissTimer(id)
      dispatch({ type: "REMOVE_ALERT", payload: { id } })
    }
  }

  function pauseDismissTimer(id) {
    const alert = alerts.find(alert => alert.id === id)
    clearTimeout(alert?.timeout)
  }

  function resumeAlertTimer(id, timer) {
    const timeout = setAlertTimeout(id, timer ?? 4000)
    dispatch({ type: "UPDATE_ALERT", payload: { id, timeout } })
  }

  function setAlertTimeout(id, timeout) {
    return setTimeout(() => {
      requestAnimationFrame(() => dismissAlert(id))
    }, timeout ?? alertDuration)
  }

  return { setAlert, dismissAlert, alerts, pauseDismissTimer, resumeAlertTimer }
}
