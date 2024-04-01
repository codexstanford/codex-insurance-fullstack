import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import router from "./router";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <div>
          <Toaster />
        </div>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};


// Init React app

function main() {
  const container = document.getElementById("root");

  if (!container) return console.error("No root element found");

  const root = createRoot(container);

  root.render(<App />);
}

main();
