import React from "react"
import ReactDOM from "react-dom/client"

import App from "./app.jsx"

const container = document.getElementById("artwork-admin")
const artWorks = JSON.parse(container.getAttribute("data-state"))
const root = ReactDOM.createRoot(container)

root.render(React.createElement(App, { artWorks }))
