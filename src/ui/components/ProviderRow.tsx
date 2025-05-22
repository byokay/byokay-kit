// src/ui/components/ProviderRow.tsx
import React from "react";
import { SupportedProvider } from "../../core/KeyManager";

interface ProviderRowProps {
  provider: SupportedProvider;
  providerDisplayName: string;
  currentKey: string;
  isSaved: boolean;
  isValidating: boolean;
  isValidated: boolean;
  onKeyChange: (value: string) => void;
  onValidate: () => void;
  onClear: () => void;
}

export function ProviderRow({
  providerDisplayName,
  currentKey,
  isSaved,
  isValidating,
  isValidated,
  onKeyChange,
  onValidate,
  onClear,
}: ProviderRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-3 py-2 border-b border-gray-100 last:border-b-0 last:mb-0">
      {/* Provider name with connection status */}
      <div className="col-span-3 flex items-center">
        <div
          className={`text-sm font-medium ${
            currentKey && isValidated ? "text-green-700" : "text-gray-700"
          }`}
        >
          {providerDisplayName}
          {currentKey && isValidated && (
            <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </div>
      </div>

      {/* Input field */}
      <div className="col-span-7 flex">
        <input
          type="password"
          value={currentKey || ""}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="Enter API key"
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Action buttons */}
      <div className="col-span-2 flex items-center justify-end space-x-1">
        {isSaved ? (
          <span className="text-green-600 text-xs bg-green-50 py-1 px-2 rounded-full">
            Saved!
          </span>
        ) : isValidating ? (
          <span className="text-blue-600 text-xs bg-blue-50 py-1 px-2 rounded-full w-16 text-center animate-pulse">
            Validating
          </span>
        ) : (
          <>
            <button
              onClick={onValidate}
              disabled={!currentKey}
              className={`p-1.5 rounded ${
                isValidated
                  ? "text-green-600 bg-green-50"
                  : currentKey
                  ? "text-gray-400 hover:text-green-600 hover:bg-green-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title={isValidated ? "Validated" : "Validate key"}
            >
              <span
                className={`text-lg ${
                  isValidated ? "font-bold" : "opacity-60"
                }`}
              >
                ✓
              </span>
            </button>

            {currentKey && (
              <button
                onClick={onClear}
                className="p-1.5 rounded text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                title="Remove key"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
