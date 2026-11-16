import React from "react";
import ReactDOM from "react-dom/client";
import ManagerPortal from "./ManagerPortal";

import "./admin.css";
import "./brand.css";
import "./field-report.css";
import "./portal.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ManagerPortal />
  </React.StrictMode>
);
