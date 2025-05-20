import React, { useState, useEffect } from "react";
import { KeyManager, SupportedProvider } from "../core/KeyManager";

interface Props {
  provider: SupportedProvider;
  label?: string;
  className?: string;
}

const manager = new KeyManager();

export function KeyInput({ provider, label, className }: Props) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const stored = manager.getKey(provider);
    if (stored) setKey(stored);
  }, [provider]);

  const handleSave = () => {
    manager.setKey(provider, key);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClear = () => {
    manager.removeKey(provider);
    setKey("");
    setSaved(false);
  };

  return (
    <div className={className}>
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#0070f3",
            cursor: "pointer",
            fontSize: "0.9rem",
            textDecoration: "underline",
          }}
        >
          {key ? "🔒 Manage API Key" : "🔑 Set API Key"}
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#fafafa",
            maxWidth: "400px",
          }}
        >
          <label style={{ fontSize: "0.85rem" }}>
            {label || `Your ${provider} API Key:`}
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={`Enter ${provider} key`}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "0.85rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleSave}
              style={{
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Save
            </button>
            <button
              onClick={handleClear}
              style={{
                background: "#eaeaea",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "0.4rem 0.8rem",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Clear
            </button>
            <button
              onClick={() => setShowInput(false)}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "none",
                color: "#999",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ✖
            </button>
          </div>
          {saved && (
            <span style={{ color: "green", fontSize: "0.8rem" }}>Saved!</span>
          )}
        </div>
      )}
    </div>
  );
}
