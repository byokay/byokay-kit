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
        padding: "2rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <KeyInput providers={["openai", "claude", "gemini"]} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
