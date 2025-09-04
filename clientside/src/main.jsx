import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);
