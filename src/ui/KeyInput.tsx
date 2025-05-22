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
          className="bg-transparent border-none text-blue-600 cursor-pointer text-sm underline"
        >
          {key ? "🔒 Manage API Key" : "🔑 Set API Key"}
        </button>
      ) : (
        <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded-md bg-gray-50 max-w-[400px]">
          <label className="text-sm">
            {label || `Your ${provider} API Key:`}
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={`Enter ${provider} key`}
            className="p-2 border border-gray-300 rounded-md text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white border-none rounded-md py-1.5 px-3 cursor-pointer text-sm"
            >
              Save
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-200 border border-gray-300 rounded-md py-1.5 px-3 cursor-pointer text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="ml-auto bg-transparent border-none text-gray-500 cursor-pointer text-sm"
            >
              ✖
            </button>
          </div>
          {saved && <span className="text-green-600 text-xs">Saved!</span>}
        </div>
      )}
    </div>
  );
}
