// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthProvider.tsx";
import { LoadingProvider } from "./Context/LoadingProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </BrowserRouter>
);
