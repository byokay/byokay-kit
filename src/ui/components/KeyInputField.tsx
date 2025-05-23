// src/ui/components/KeyInputField.tsx
import React, { useState } from "react";

interface KeyInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  isUnverified?: boolean;
  feedbackMessage?: string;
}

export function KeyInputField({
  value,
  onChange,
  placeholder = "Enter API key",
  isInvalid,
  isUnverified,
  feedbackMessage,
}: KeyInputFieldProps) {
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const [showLockTooltip, setShowLockTooltip] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const toggleShowKey = () => setShowKey((prev) => !prev);

  let borderColor = "border-gray-300 focus:border-blue-500";
  let ringColor = "focus:ring-blue-500";
  let errorStateIconSvg: React.ReactNode = null; // Store only the SVG here
  let errorStateTooltipText = feedbackMessage;

  if (isInvalid) {
    borderColor = "border-red-400 focus:border-red-500";
    ringColor = "focus:ring-red-500";
    errorStateIconSvg = // This is just the SVG
      (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500 group-hover:text-red-700 transition-colors" // Added group-hover for button
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
    if (!errorStateTooltipText)
      errorStateTooltipText = "Invalid API Key. Click to clear."; // Updated tooltip
  }

  const hasErrorStateIcon = !!errorStateIconSvg;
  const hasValue = !!value;

  let currentPl = "pl-3";
  if (hasValue) {
    currentPl = "pl-7";
  }

  let currentPr = "pr-3";
  if (hasValue && hasErrorStateIcon) {
    currentPr = "pr-16";
  } else if (hasValue || hasErrorStateIcon) {
    currentPr = "pr-10";
  }

  return (
    <div className="relative w-full">
      {hasValue && (
        <div
          className="absolute inset-y-0 left-0 pl-2 flex items-center"
          onMouseEnter={() => setShowLockTooltip(true)}
          onMouseLeave={() => setShowLockTooltip(false)}
          style={{ zIndex: 10 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {showLockTooltip && (
            <div className="absolute left-0 bottom-full transform -translate-y-1 mb-1 w-max max-w-xs px-2 py-1 bg-gray-700 text-white text-xs rounded shadow-lg z-20">
              Stored locally only.
              <div className="absolute left-2 top-full w-2 h-2 bg-gray-700 transform rotate-45 -translate-y-1"></div>
            </div>
          )}
        </div>
      )}

      <input
        type={showKey ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full py-2 text-sm md:text-base border rounded-lg focus:ring-1 focus:outline-none transition-all 
          ${borderColor} ${ringColor}
          ${currentPl} ${currentPr}
        `}
        aria-invalid={isInvalid}
      />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1.5">
        {" "}
        {/* Adjusted space for icons */}
        {/* Error State Icon Button (only for isInvalid) */}
        {isInvalid && errorStateIconSvg && (
          <div className="relative flex items-center group">
            {" "}
            {/* Group for hover effect on SVG */}
            <button
              type="button"
              onClick={() => onChange("")} // ACTION: Clear the input
              onMouseEnter={() => setShowErrorTooltip(true)}
              onMouseLeave={() => setShowErrorTooltip(false)}
              className="p-1 -m-1 rounded-full hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-red-400"
              aria-label="Clear invalid key"
              title={errorStateTooltipText || "Clear invalid key"} // Use dynamic tooltip text here
            >
              {errorStateIconSvg} {/* The SVG */}
            </button>
            {showErrorTooltip && errorStateTooltipText && (
              <div className="absolute right-0 bottom-full transform translate-y-0 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md shadow-lg z-20">
                {errorStateTooltipText}
                <div className="absolute right-2 top-full transform -translate-x-0 w-2 h-2 bg-gray-800 rotate-45 -translate-y-1"></div>
              </div>
            )}
          </div>
        )}
        {/* Eye Icon */}
        {hasValue && (
          <button
            type="button"
            onClick={toggleShowKey}
            className="p-1 -m-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400"
            title={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? (
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
      </div>
    </div>
  );
}
