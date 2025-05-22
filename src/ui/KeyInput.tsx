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
          className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <span className="text-base"></span>
          {key ? "Manage API Key" : "Connect AI"}
        </button>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 max-w-md animate-fade-in transition-all">
          {/* Header */}
          <div className="bg-blue-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-medium text-gray-800">
              {label ||
                `${
                  provider.charAt(0).toUpperCase() + provider.slice(1)
                } API Key`}
            </h3>
            <button
              onClick={() => setShowInput(false)}
              className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="api-key-input"
                className="block text-sm text-gray-700"
              >
                Enter your {provider} API key
              </label>
              <div className="relative">
                <input
                  id="api-key-input"
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={`Enter ${provider} key`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* Saved message */}
            {saved && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                API key saved successfully
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
              >
                Save
              </button>
              <button
                onClick={handleClear}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
