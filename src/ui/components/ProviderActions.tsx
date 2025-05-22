import React, { useState } from "react";

interface ProviderActionsProps {
  hasKey: boolean;
  isValidated: boolean;
  isSaved: boolean;
  isValidating: boolean;
  onValidate: () => void;
  onClear: () => void;
}

export function ProviderActions({
  hasKey,
  isValidated,
  isSaved,
  isValidating,
  onValidate,
  onClear,
}: ProviderActionsProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleStartDelete = () => setIsConfirmingDelete(true);
  const handleCancelDelete = () => setIsConfirmingDelete(false);
  const handleConfirmDelete = () => {
    onClear();
    setIsConfirmingDelete(false);
  };

  if (isSaved) {
    return (
      <span className="text-green-700 text-xs bg-green-50 py-1 px-2 rounded-full font-medium">
        Saved!
      </span>
    );
  }

  if (isValidating) {
    return (
      <span className="text-blue-700 text-xs bg-blue-50 py-1 px-2 rounded-full w-16 text-center animate-pulse font-medium">
        Validating
      </span>
    );
  }

  if (isConfirmingDelete) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={handleConfirmDelete}
          className="p-1 rounded text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 transition-all"
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
          className="p-1 rounded text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-all"
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
    );
  }

  return (
    <>
      <button
        onClick={onValidate}
        disabled={!hasKey}
        className={`p-1.5 rounded transition-all ${
          isValidated
            ? "text-green-700 bg-green-50"
            : hasKey
            ? "text-gray-600 hover:text-green-700 hover:bg-green-50 hover:scale-110 hover:shadow-sm"
            : "text-gray-400 cursor-not-allowed"
        }`}
        title={
          isValidated ? "Key validated and saved" : "Validate and save key"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            isValidated ? "stroke-green-600 stroke-[2.5]" : "stroke-2"
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

      {hasKey && (
        <button
          onClick={handleStartDelete}
          className="p-1.5 rounded text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 transition-all hover:scale-110 hover:shadow-sm"
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
  );
}
