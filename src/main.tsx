import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./contexts/auth";
import App from "./App";
import "@radix-ui/themes/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Theme>
  </React.StrictMode>
);
