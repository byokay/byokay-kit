// playground/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { KeyInput } from "../src/ui/KeyInput"; // Alias to src for dev

// Ensure this path correctly points to your compiled CSS for KeyInput
// Assuming your build script output is to 'dist/ui/styles.css'
import "../dist/styles.css";

const App = () => {
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <KeyInput provider="openai" label="OpenAI API Key" />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
