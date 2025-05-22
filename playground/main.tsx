// playground/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { KeyInput } from "../src/ui/KeyInput";
import "./styles.css";

const App = () => {
  return (
    <div className="p-8 font-sans">
      <KeyInput provider="openai" label="OpenAI API Key" />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
