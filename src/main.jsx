import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DesignProvider } from "./context/DesignContext";
import App from "./App";
import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <DesignProvider>
      <App />
    </DesignProvider>
  </BrowserRouter>
);
