// src/ui/components/ProviderRow.tsx
import React from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager";
import { ProviderStatus } from "./ProviderStatus";
import { KeyInputField } from "./KeyInputField";
import { ProviderActions } from "./ProviderActions";

interface ProviderRowProps {
  provider: SupportedProvider;
  providerDisplayName: string;
  currentKey: string;
  isSaved: boolean;
  isValidating: boolean;
  isValidated: boolean;
  isUnverifiedDueToCors?: boolean;
  validationMessage?: string | null;
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
  isUnverifiedDueToCors,
  validationMessage,
  onKeyChange,
  onValidate,
  onClear,
}: ProviderRowProps) {
  const hasKey = Boolean(currentKey);
  // isTrulyInvalid: there's a validation message, it's NOT a CORS issue, and it's not validated/validating
  const isTrulyInvalid =
    !!validationMessage &&
    !isUnverifiedDueToCors &&
    !isValidated &&
    !isValidating;

  return (
    <div className="grid grid-cols-12 gap-x-2 gap-y-1 items-start py-3 px-1 md:px-2 rounded-md transition-colors hover:bg-gray-50/70">
      <div className="col-span-full md:col-span-3 flex items-center min-h-[40px]">
        {" "}
        {/* Adjusted min-height for consistency */}
        <ProviderStatus
          name={providerDisplayName}
          isValidated={isValidated}
          hasKey={hasKey}
          isUnverified={isUnverifiedDueToCors}
          unverifiedMessage={isUnverifiedDueToCors ? validationMessage : null} // Pass message for tooltip
        />
      </div>

      <div className="col-span-full md:col-span-7 relative">
        <KeyInputField
          value={currentKey}
          onChange={onKeyChange}
          isInvalid={isTrulyInvalid} // Only red border for true invalid
          isUnverified={isUnverifiedDueToCors} // Pass this, but KeyInputField won't style border/icon aggressively for it
          feedbackMessage={validationMessage || undefined} // For tooltip on actual error icon
        />
        {/* Only display validation message for actual errors, not for CORS issues */}
        {validationMessage &&
          !isValidated &&
          !isValidating &&
          !isUnverifiedDueToCors && (
            <p className="text-xs mt-1 px-1 text-red-600">
              {validationMessage}
            </p>
          )}
      </div>

      <div className="col-span-full md:col-span-2 flex items-center justify-end space-x-1 min-h-[40px]">
        <ProviderActions
          hasKey={hasKey}
          isValidated={isValidated}
          isSaved={isSaved}
          isValidating={isValidating}
          isUnverified={isUnverifiedDueToCors}
          onValidate={onValidate}
          onClear={onClear}
        />
      </div>
    </div>
  );
}
