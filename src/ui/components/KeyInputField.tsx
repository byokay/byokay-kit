// src/ui/components/KeyInputField.tsx
import React, { useState } from "react";

interface KeyInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean; // For actual invalid keys (e.g., 401 response)
  isUnverified?: boolean; // For CORS unverified keys - field should look normal
  feedbackMessage?: string; // For specific error/info messages (mainly for isInvalid tooltip)
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
  const [showLockTooltip, setShowLockTooltip] = useState(false); // For the lock icon
  const [showKey, setShowKey] = useState(false);

  const toggleShowKey = () => setShowKey((prev) => !prev);

  let borderColor = "border-gray-300 focus:border-blue-500";
  let ringColor = "focus:ring-blue-500";
  let errorStateIcon: React.ReactNode = null; // Changed name for clarity
  let errorStateTooltipText = feedbackMessage;

  if (isInvalid) {
    // This is for a hard invalid state (e.g. API returned 401)
    borderColor = "border-red-400 focus:border-red-500";
    ringColor = "focus:ring-red-500";
    errorStateIcon = (
      <svg // Red X Circle Icon
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
    if (!errorStateTooltipText) errorStateTooltipText = "Invalid API Key.";
  }
  // For 'isUnverified' (CORS case), we decided the info icon appears next to the
  // provider name in ProviderStatus.tsx, so KeyInputField itself remains neutral.

  const hasErrorStateIcon = !!errorStateIcon;
  const hasValue = !!value;

  // Adjust padding for icons:
  // Left padding: Default 'px-3'. If lock icon is shown (hasValue), increase left padding.
  // Right padding: Default 'px-3'. If eye icon (hasValue) or error icon is shown, increase right padding.

  let currentPl = "pl-3"; // Default left padding (0.75rem)
  if (hasValue) {
    // Lock icon is present
    // Target: Small space (0.5rem/pl-2) + Lock icon (1rem/w-4) + Small space (0.25rem/px-1 approx) before text
    // Total padding needed: 0.5rem + 1rem + 0.25rem = 1.75rem. Tailwind `pl-7` is 1.75rem.
    currentPl = "pl-7";
  }

  let currentPr = "pr-3"; // Default right padding
  if (hasValue && hasErrorStateIcon) {
    // Both eye and error icon
    currentPr = "pr-14"; // Approx 2 * (icon_width + spacing) -> (1.25rem + 0.25) * 2 = 3.5rem
  } else if (hasValue || hasErrorStateIcon) {
    // Only one of eye or error icon
    currentPr = "pr-10"; // Approx 1.25rem (icon) + 0.75rem (padding) = 2.5rem
  }

  return (
    <div className="relative w-full">
      {" "}
      {/* Removed flex items-center from outer for simplicity */}
      {/* Lock Icon & Tooltip */}
      {hasValue && (
        <div
          className="absolute inset-y-0 left-0 pl-2 flex items-center" // Icon starts 0.5rem from border
          onMouseEnter={() => setShowLockTooltip(true)} // Hover works on this div
          onMouseLeave={() => setShowLockTooltip(false)}
          style={{ zIndex: 10 }} // Ensure tooltip container can be hovered
        >
          <svg // Lock SVG
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 pointer-events-none" // SVG itself ignores pointer events for click-through
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
              <div className="absolute left-2 top-full w-2 h-2 bg-gray-700 transform rotate-45 -translate-y-1"></div>{" "}
              {/* Arrow a bit to the left */}
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
      {/* Container for right-side icons */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
        {/* Error State Icon (only for isInvalid) */}
        {isInvalid && errorStateIcon && (
          <div
            className="flex items-center cursor-help"
            onMouseEnter={() => setShowErrorTooltip(true)}
            onMouseLeave={() => setShowErrorTooltip(false)}
          >
            {errorStateIcon}
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
            className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
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
