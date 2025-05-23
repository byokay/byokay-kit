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
  const isTrulyInvalid =
    !!validationMessage &&
    !isUnverifiedDueToCors &&
    !isValidated &&
    !isValidating;

  return (
    <div className="grid grid-cols-12 gap-x-2 gap-y-1 items-start py-3 px-1 md:px-2 rounded-md transition-colors hover:bg-gray-50/70">
      <div className="col-span-full md:col-span-3 flex items-center min-h-[40px]">
        <ProviderStatus
          name={providerDisplayName}
          isValidated={isValidated}
          hasKey={hasKey}
          isUnverified={isUnverifiedDueToCors}
          unverifiedMessage={isUnverifiedDueToCors ? validationMessage : null}
        />
      </div>

      <div className="col-span-full md:col-span-7 relative">
        <KeyInputField
          value={currentKey}
          onChange={onKeyChange}
          isInvalid={isTrulyInvalid} // Only pass true for hard invalid
          isUnverified={isUnverifiedDueToCors} // Pass this, KeyInputField won't add aggressive styles
          feedbackMessage={validationMessage || undefined} // Tooltip for hard invalid icon
        />
        {/* Textual message: Only show for hard invalid, not for CORS unverified (as ProviderStatus handles that) */}
        {isTrulyInvalid && validationMessage && (
          <p className="text-xs text-red-600 mt-1 px-1">{validationMessage}</p>
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
