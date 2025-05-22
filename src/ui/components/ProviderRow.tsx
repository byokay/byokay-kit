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
  const hasKey = Boolean(currentKey);

  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-3 py-2 border-b border-gray-200 last:border-b-0 last:mb-0">
      {/* Provider name with connection status */}
      <div className="col-span-3 flex items-center">
        <ProviderStatus
          name={providerDisplayName}
          isValidated={isValidated}
          hasKey={hasKey}
        />
      </div>

      {/* Input field with lock icon */}
      <div className="col-span-7 relative">
        <KeyInputField value={currentKey} onChange={onKeyChange} />
      </div>

      {/* Action buttons */}
      <div className="col-span-2 flex items-center justify-end space-x-1">
        <ProviderActions
          hasKey={hasKey}
          isValidated={isValidated}
          isSaved={isSaved}
          isValidating={isValidating}
          onValidate={onValidate}
          onClear={onClear}
        />
      </div>
    </div>
  );
}
