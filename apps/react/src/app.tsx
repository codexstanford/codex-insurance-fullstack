import * as React from "react";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  return <>Hello World!</>;
};

// Init React app

function main() {
  const container = document.getElementById("root");

  if (!container) return console.error("No root element found");

  const root = createRoot(container);

  root.render(<App />);
}

main();
