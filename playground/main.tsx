// playground/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
// Assuming SupportedProvider might be needed by consumer for defining the providers array type explicitly
import {
  ByokayKeyProvider,
  SupportedProvider,
} from "../src/ui/ByokayKeyProvider";

// Ensure this path correctly points to your compiled CSS for the modal and its contents
// Your tree shows dist/styles.css. If your build outputs to dist/ui/styles.css, use that.
import "../dist/styles.css"; // CSS for Modal, ProviderList, ProviderRow internals

const App = () => {
  const myProviders: SupportedProvider[] = [
    "openai",
    "claude",
    "gemini",
    "grok",
    "deepseek",
  ];

  // Styles for the custom button
  const buttonBaseStyle: React.CSSProperties = {
    display: "inline-flex", // for flex items-center gap-2
    alignItems: "center",
    gap: "0.5rem", // Tailwind's gap-2
    color: "#2563EB", // Tailwind's text-blue-600
    backgroundColor: "#EFF6FF", // Tailwind's bg-blue-50
    padding: "0.5rem 0.75rem", // Tailwind's px-3 py-2
    borderRadius: "9999px", // Tailwind's rounded-full
    fontSize: "0.875rem", // Tailwind's text-sm
    lineHeight: "1.25rem",
    fontWeight: 500, // Tailwind's font-medium
    cursor: "pointer",
    border: "none",
    transitionProperty:
      "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "150ms",
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <ByokayKeyProvider providers={myProviders}>
        {(openModal, hasAnyKey) => (
          <button
            onClick={openModal}
            style={buttonBaseStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#DBEAFE")
            } // Simulating hover:bg-blue-100
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#EFF6FF")
            } // Revert to bg-blue-50
            title={
              hasAnyKey ? "Manage your AI API keys" : "Connect your AI API keys"
            }
          >
            <span
              style={{ fontSize: "1rem" /* Tailwind's text-base */ }}
            ></span>
            {hasAnyKey ? "AI Connected" : "Connect AI"}
          </button>
        )}
      </ByokayKeyProvider>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
