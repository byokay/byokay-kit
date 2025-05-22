import React, { useState } from "react";

interface ProviderStatusProps {
  name: string;
  isValidated: boolean;
  hasKey: boolean;
  isUnverified?: boolean;
}

export function ProviderStatus({
  name,
  isValidated,
  hasKey,
  isUnverified,
}: ProviderStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Determine text color and status dot based on state
  let textColorClass = "text-gray-800";
  let statusDot = null;
  let tooltipText = "";

  if (hasKey && isValidated) {
    textColorClass = "text-green-600";
    tooltipText = "Connected";
    statusDot = (
      <span className="ml-1 inline-block w-2 h-2 bg-green-600 rounded-full"></span>
    );
  } else if (hasKey && isUnverified) {
    textColorClass = "text-yellow-700";
    tooltipText = "Key saved but not validated due to CORS restrictions";
    statusDot = (
      <span className="ml-1 inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
    );
  }

  return (
    <div className={`text-sm font-medium ${textColorClass}`}>
      {name}
      {statusDot && (
        <div className="inline-block relative">
          <span
            className="ml-1 inline-block w-2 h-2 rounded-full cursor-help"
            style={{
              backgroundColor:
                hasKey && isValidated
                  ? "#16a34a"
                  : hasKey && isUnverified
                  ? "#eab308"
                  : "transparent",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label={tooltipText}
          ></span>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-sm whitespace-nowrap">
                {tooltipText}
              </div>
              <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
