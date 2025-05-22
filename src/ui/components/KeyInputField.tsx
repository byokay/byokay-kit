// src/ui/components/KeyInputField.tsx
import React, { useState } from "react";

interface KeyInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean; // For actual invalid keys (not CORS)
  isUnverified?: boolean; // For CORS unverified keys
  feedbackMessage?: string; // General message (could be error or CORS info)
}

export function KeyInputField({
  value,
  onChange,
  placeholder = "Enter API key",
  isInvalid,
  isUnverified,
  feedbackMessage,
}: KeyInputFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const toggleShowKey = () => setShowKey((prev) => !prev);

  let borderColor = "border-gray-300 focus:border-blue-500";
  let ringColor = "focus:ring-blue-500";
  let iconToShow: React.ReactNode = null;
  let tooltipText = feedbackMessage;

  if (isInvalid) {
    // Hard invalid
    borderColor = "border-red-400 focus:border-red-500";
    ringColor = "focus:ring-red-500";
    iconToShow = // Heroicon: x-circle
      (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    if (!tooltipText) tooltipText = "Invalid API Key.";
  } else if (isUnverified) {
    // CORS unverified
    borderColor = "border-yellow-400 focus:border-yellow-500"; // Amber/yellow for unverified
    ringColor = "focus:ring-yellow-500";
    iconToShow = // Heroicon: information-circle
      (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    // Tooltip text will be the CORS message passed via feedbackMessage
  }

  return (
    <div className="relative flex items-center w-full">
      <input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:outline-none transition-all 
          ${borderColor} ${ringColor}
          ${iconToShow || value ? "pr-10" : ""} 
        `}
        aria-invalid={isInvalid}
      />

      {/* Show/hide eye toggle */}
      {value && (
        <button
          type="button"
          onClick={toggleShowKey}
          className={`absolute inset-y-0 ${
            iconToShow ? "right-8" : "right-0"
          } pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none`}
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

      {/* Validation status icon with tooltip */}
      {iconToShow && (
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {iconToShow}
          {showTooltip && tooltipText && (
            <div className="absolute left-1/2 bottom-full transform -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg z-20">
              {tooltipText}
              <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
