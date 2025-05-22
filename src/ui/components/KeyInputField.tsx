// src/ui/components/KeyInputField.tsx
import React, { useState } from "react";

interface KeyInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  invalidTooltipMessage?: string; // Tooltip message for the icon when invalid
}

export function KeyInputField({
  value,
  onChange,
  placeholder = "Enter API key",
  isInvalid,
  invalidTooltipMessage = "Invalid API key. Please check and try again.",
}: KeyInputFieldProps) {
  const [showInvalidTooltip, setShowInvalidTooltip] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const toggleShowKey = () => setShowKey((prev) => !prev);

  return (
    <div className="relative flex items-center w-full">
      <input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:outline-none transition-all 
          ${
            isInvalid
              ? "border-red-400 focus:ring-red-400 focus:border-red-400 pr-10" // Add more pr for icon
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }
          ${
            value ? "pr-10" : ""
          } // Add padding when there's a value for the eye icon
        `}
        aria-invalid={isInvalid}
      />

      {/* Show/hide password toggle */}
      {value && (
        <button
          type="button"
          onClick={toggleShowKey}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          title={showKey ? "Hide API key" : "Show API key"}
        >
          {showKey ? (
            // Eye open icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            // Eye crossed icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          )}
        </button>
      )}

      {/* Invalid key icon and tooltip */}
      {isInvalid && (
        <div
          className={`absolute inset-y-0 ${
            value ? "right-8" : "right-0"
          } pr-3 flex items-center cursor-help`}
          onMouseEnter={() => setShowInvalidTooltip(true)}
          onMouseLeave={() => setShowInvalidTooltip(false)}
        >
          {/* Heroicon: exclamation-triangle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.216 3.031-1.742 3.031H4.42c-1.526 0-2.493-1.697-1.743-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-4.5a1.75 1.75 0 00-3.5 0v.25a1.75 1.75 0 003.5 0v-.25z"
              clipRule="evenodd"
            />
          </svg>
          {showInvalidTooltip && (
            <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg z-20">
              {invalidTooltipMessage}
              <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
