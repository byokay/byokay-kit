// src/ui/components/ProviderStatus.tsx
import React, { useState } from "react";

interface ProviderStatusProps {
  name: string;
  isValidated: boolean;
  hasKey: boolean;
  isUnverified?: boolean;
  unverifiedMessage?: string | null; // Tooltip message for unverified state
}

export function ProviderStatus({
  name,
  isValidated,
  hasKey,
  isUnverified,
  unverifiedMessage,
}: ProviderStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  let statusIndicator: React.ReactNode = null;
  let tooltipContent: string | null = null;
  let nameColorClass = "text-gray-800";

  if (hasKey && isValidated) {
    nameColorClass = "text-green-600";
    statusIndicator = (
      <span className="ml-1.5 inline-block w-2 h-2 bg-green-600 rounded-full" />
    );
    tooltipContent = "Connected and validated";
  } else if (hasKey && isUnverified) {
    // Key is present and saved, but couldn't be verified from browser (CORS)
    nameColorClass = "text-gray-700"; // Keep name color neutral or slightly different
    statusIndicator = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1.5 h-4 w-4 text-blue-500 flex-shrink-0"
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
    tooltipContent =
      unverifiedMessage || "Saved. Browser verification may be limited.";
  }

  return (
    <div
      className={`text-sm font-medium flex items-start ${nameColorClass} relative`}
      onMouseEnter={() => statusIndicator && setShowTooltip(true)}
      onMouseLeave={() => statusIndicator && setShowTooltip(false)}
    >
      <span className="whitespace-normal break-words">{name}</span>
      {statusIndicator}
      {showTooltip && tooltipContent && (
        <div className="absolute bottom-full left-0 transform -translate-y-1 mb-1 w-max max-w-xs px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-30">
          {tooltipContent}
          <div className="absolute left-3 top-full w-2 h-2 bg-gray-800 transform rotate-45 -translate-y-1"></div>
        </div>
      )}
    </div>
  );
}
