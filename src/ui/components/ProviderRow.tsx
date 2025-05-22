// src/ui/components/ProviderRow.tsx
import React from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager"; // Ensure path is correct
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
  validationMessage?: string | null; // New prop for specific error message
  onKeyChange: (value: string) => void;
  onValidate: () => void;
  onClear: () => void;
}

export function ProviderRow({
  provider,
  providerDisplayName,
  currentKey,
  isSaved,
  isValidating,
  isValidated,
  validationMessage,
  onKeyChange,
  onValidate,
  onClear,
}: ProviderRowProps) {
  const hasKey = Boolean(currentKey);
  // Determine if in an invalid state after validation attempt
  const isExplicitlyInvalid =
    !isValidated && !!validationMessage && !isValidating;

  return (
    <div className="grid grid-cols-12 gap-2 items-center py-3 px-2 rounded-md transition-colors hover:bg-gray-50">
      <div className="col-span-3 flex items-center">
        <ProviderStatus
          name={providerDisplayName}
          isValidated={isValidated}
          hasKey={hasKey}
        />
      </div>

      <div className="col-span-7 relative">
        <KeyInputField
          value={currentKey}
          onChange={onKeyChange}
          isInvalid={isExplicitlyInvalid}
          invalidTooltipMessage={validationMessage || undefined}
        />
        {isExplicitlyInvalid && validationMessage && (
          <p className="text-xs text-red-600 mt-1">{validationMessage}</p>
        )}
      </div>

      <div className="col-span-2 flex items-center justify-end space-x-1">
        <ProviderActions
          hasKey={hasKey}
          isValidated={isValidated}
          isSaved={isSaved}
          isValidating={isValidating}
          isExplicitlyInvalid={isExplicitlyInvalid}
          onValidate={onValidate}
          onClear={onClear}
        />
      </div>
    </div>
  );
}
