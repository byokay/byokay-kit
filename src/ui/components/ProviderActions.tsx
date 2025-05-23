import React, { useState } from "react";

interface ProviderActionsProps {
  hasKey: boolean;
  isValidated: boolean;
  isSaved: boolean;
  isValidating: boolean;
  isUnverified?: boolean;
  onValidate: () => void;
  onClear: () => void;
}

export function ProviderActions({
  hasKey,
  isValidated,
  isSaved,
  isValidating,
  isUnverified,
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

  let validateButtonTitle = "Validate and save key";
  let validateButtonIcon: React.ReactNode = // Default checkmark
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 stroke-2 text-gray-500 group-hover:text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  let validateButtonClasses =
    "text-gray-600 hover:text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500";

  if (isValidated) {
    validateButtonClasses =
      "text-green-700 bg-green-50 hover:bg-green-100 focus-visible:ring-green-500";
    validateButtonIcon = (
      /* Green Check */
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 stroke-green-600 stroke-[2.5]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
    validateButtonTitle = "Key is validated and saved";

    /* Key saved but unverified (CORS)  → grey, disabled check */
    validateButtonClasses = "text-gray-400 cursor-default";
    validateButtonIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 stroke-[2]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
    validateButtonTitle = "Key saved. Browser verification not possible.";
  } else if (!hasKey) {
    validateButtonClasses = "text-gray-400 cursor-not-allowed";
    validateButtonTitle = "Enter a key to validate";
  }
  // If there's a validationMessage and it's not a CORS issue, it's a hard fail.
  // The button might show an X, or revert to the default check to allow re-try.
  // Current logic: if !isValidated and !isUnverified and hasKey, it's the default validate state.

  return (
    <>
      <button
        onClick={onValidate}
        disabled={!hasKey || isValidating || isUnverified} // prevent click if unverified
        className={`p-1.5 rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${validateButtonClasses}`}
        title={validateButtonTitle}
      >
        {validateButtonIcon}
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
