import React, { useState } from "react";

interface ProviderStatusProps {
  name: string;
  isValidated: boolean;
  hasKey: boolean;
}

export function ProviderStatus({
  name,
  isValidated,
  hasKey,
}: ProviderStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`text-sm font-medium ${
        hasKey && isValidated ? "text-green-600" : "text-gray-800"
      }`}
    >
      {name}
      {hasKey && isValidated && (
        <div className="inline-block relative">
          <span
            className="ml-1 inline-block w-2 h-2 bg-green-600 rounded-full cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="API key connected and validated"
          ></span>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-sm whitespace-nowrap">
                Connected
              </div>
              <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
