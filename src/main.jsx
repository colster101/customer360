import React from "react";
import { createRoot } from "react-dom/client";
import CustomerSingleView from "./CustomerSingleView.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomerSingleView />
  </React.StrictMode>
);
