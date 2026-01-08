/**
 * Entry point for the React application.
 *
 * Wraps the App component with:
 * - React.StrictMode for highlighting potential problems
 * - BrowserRouter for client-side routing
 * - QueryClientProvider for react-query state management
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// Create a single react-query client instance
const queryClient = new QueryClient();

// Mount the React app to the #root element
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
