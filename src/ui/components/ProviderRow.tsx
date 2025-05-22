// src/ui/components/ProviderRow.tsx
import React, { useState } from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager";

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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleStartDelete = () => setIsConfirmingDelete(true);
  const handleCancelDelete = () => setIsConfirmingDelete(false);
  const handleConfirmDelete = () => {
    onClear();
    setIsConfirmingDelete(false);
  };

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

      {/* Input field with lock icon */}
      <div className="col-span-7 relative">
        <div className="relative">
          {/* Lock icon positioned inside the input */}
          {currentKey && (
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
          )}
          <input
            type="password"
            value={currentKey || ""}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder="Enter API key"
            className={`w-full px-2 ${
              currentKey ? "pl-7" : "pl-2"
            } py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono ${
              !currentKey && "placeholder:text-gray-300 placeholder:opacity-50"
            }`}
          />
        </div>
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
        ) : isConfirmingDelete ? (
          <div className="flex items-center space-x-1">
            <button
              onClick={handleConfirmDelete}
              className="p-1 rounded text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all"
              title="Confirm delete"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              onClick={handleCancelDelete}
              className="p-1 rounded text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all"
              title="Cancel"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onValidate}
              disabled={!currentKey}
              className={`p-1.5 rounded transition-all ${
                isValidated
                  ? "text-green-600 bg-green-50"
                  : currentKey
                  ? "text-gray-400 hover:text-green-600 hover:bg-green-50 hover:scale-110 hover:shadow-sm"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title={
                isValidated
                  ? "Key validated and saved"
                  : "Validate and save key"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  isValidated ? "stroke-[2.5]" : "stroke-2"
                } transition-all`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>

            {currentKey && (
              <button
                onClick={handleStartDelete}
                className="p-1.5 rounded text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 transition-all hover:scale-110 hover:shadow-sm"
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
