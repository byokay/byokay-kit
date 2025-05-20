// playground/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { KeyInput } from "../src/ui/KeyInput";

const App = () => {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <KeyInput provider="openai" label="OpenAI API Key" />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
