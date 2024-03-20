import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import React from "react";

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
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
