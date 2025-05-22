import React from "react";

interface ClearAllSectionProps {
  hasKeys: boolean;
  isConfirming: boolean;
  onStartClear: () => void;
  onConfirmClear: () => void;
  onCancelClear: () => void;
}

export function ClearAllSection({
  hasKeys,
  isConfirming,
  onStartClear,
  onConfirmClear,
  onCancelClear,
}: ClearAllSectionProps) {
  if (!hasKeys) return null;

  return (
    <div className="mt-12 pt-4 border-t border-gray-200">
      {!isConfirming && (
        <button
          onClick={onStartClear}
          className="text-gray-600 hover:text-red-700 text-xs flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-100 transition-colors font-medium"
          title="Clear all API keys"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
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
          Clear All Keys
        </button>
      )}
      {isConfirming && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-red-700 font-medium">
            Are you sure?
          </span>
          <button
            onClick={onConfirmClear}
            className="text-xs bg-red-50 text-red-700 hover:bg-red-100 py-1 px-2 rounded transition-colors font-medium"
          >
            Yes, clear all keys
          </button>
          <button
            onClick={onCancelClear}
            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 py-1 px-2 rounded transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
