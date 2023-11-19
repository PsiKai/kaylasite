import useAlerts from "../hooks/useAlerts.js"

const icons = type => {
  switch (type) {
    case "success":
      return "check-circle"
    case "warning":
      return "exclamation-triangle"
    case "danger":
      return "ban"
    case "info":
      return "info-circle"
    default:
      return "bell-o"
  }
}

export default function Alerts() {
  const { alerts, dismissAlert } = useAlerts()

  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <div key={alert.id} data-alertid={alert.id}>
          <div
            className="alert-toast colored"
            role="alert"
            style={{ "--alert-type": `var(--${alert.type || "primary"})` }}
          >
            <i className={`fa fa-${icons(alert.type)}`} aria-hidden="true"></i>

            <span className="alert-message">{alert.message}</span>
            <button className="alert-dismiss" onClick={() => dismissAlert(alert.id)}>
              <i className="fa fa-times-circle"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
