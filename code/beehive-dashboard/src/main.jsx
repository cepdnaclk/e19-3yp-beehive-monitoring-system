import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
// Global reset. This was never imported, so the body margin was only being
// zeroed as a side effect of page stylesheets each declaring their own
// `body { margin: 0 }`; removing those brought the default 8px gutter back.
import "./index.scss";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
