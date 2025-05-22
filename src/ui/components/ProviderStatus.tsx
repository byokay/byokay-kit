import React, { useState } from "react";

interface ProviderStatusProps {
  name: string;
  isValidated: boolean;
  hasKey: boolean;
  isUnverified?: boolean;
  unverifiedMessage?: string | null;
}

export function ProviderStatus({
  name,
  isValidated,
  hasKey,
  isUnverified,
  unverifiedMessage,
}: ProviderStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  let statusColor = "text-gray-800"; // Default color
  let dotElement: React.ReactNode = null;
  let mainTooltipText = "";

  if (hasKey && isValidated) {
    statusColor = "text-green-600";
    dotElement = (
      <span
        className="ml-1.5 inline-block w-2 h-2 bg-green-600 rounded-full cursor-help"
        aria-label="API key connected and validated"
      />
    );
    mainTooltipText = "Connected and validated";
  } else if (hasKey && isUnverified) {
    // Key is present and saved, but couldn't be verified from browser (CORS)
    // Keep name color neutral, but add an info icon with specific tooltip
    statusColor = "text-gray-800"; // Neutral color for the name
    dotElement = (
      // Heroicon: information-circle
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1.5 h-4 w-4 text-gray-500 inline-block cursor-help"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-label="Key saved, verification information"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
    mainTooltipText =
      unverifiedMessage ||
      "Key saved. This provider doesn't support automatic validation - verification will happen during your first API call.";
  }
  // If !hasKey, or hasKey but !isValidated and !isUnverified, no special dot/icon.

  return (
    <div className={`text-sm font-medium flex items-center ${statusColor}`}>
      <span>{name}</span>
      {dotElement && (
        <div
          className="inline-block relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {dotElement}
          {showTooltip && mainTooltipText && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max max-w-xs px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-20">
              {mainTooltipText}
              <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
