import React from "react";

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
  return (
    <div
      className={`text-sm font-medium ${
        hasKey && isValidated ? "text-green-700" : "text-gray-700"
      }`}
    >
      {name}
      {hasKey && isValidated && (
        <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
      )}
    </div>
  );
}
