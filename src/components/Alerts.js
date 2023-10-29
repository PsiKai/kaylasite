import useAlerts from "../hooks/useAlerts.js"

export default function Alerts() {
  const { alerts } = useAlerts()

  return (
    <div className="alerts-container">
      {alerts.map(alert => (
        <div key={alert.id} className="alert-toast" role="alert">
          <p className="alert-message">{alert.message}</p>
        </div>
      ))}
    </div>
  )
}
