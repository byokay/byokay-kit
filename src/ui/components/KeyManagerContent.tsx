// src/ui/components/KeyManagerContent.tsx
import React, { useState } from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager"; // Ensure this path is correct
import { ProviderList } from "./ProviderList";
import { ClearAllSection } from "./ClearAllSection";

interface KeyManagerContentProps {
  providers: SupportedProvider[];
  providerNames: Record<SupportedProvider, string>;
  keys: Record<SupportedProvider, string>;
  saved: Record<SupportedProvider, boolean>;
  validating: Record<SupportedProvider, boolean>;
  validated: Record<SupportedProvider, boolean>;
  validationMessages: Record<SupportedProvider, string | null>;
  isUnverifiedDueToCors: Record<SupportedProvider, boolean>;
  onKeyChange: (provider: SupportedProvider, value: string) => void;
  onValidate: (provider: SupportedProvider, key: string) => void;
  onClear: (provider: SupportedProvider) => void;
  onClearAll: () => void;
  onSaveAllAndClose: () => void; // For the main "Save" button
  onCancel: () => void; // For the main "Cancel" button
}

export function KeyManagerContent({
  providers,
  providerNames,
  keys,
  saved,
  validating,
  validated,
  validationMessages,
  isUnverifiedDueToCors,
  onKeyChange,
  onValidate,
  onClear,
  onClearAll,
  onSaveAllAndClose,
  onCancel,
}: KeyManagerContentProps) {
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  // Determine if there are any keys entered at all (for "Clear All" button visibility)
  const hasAnyEnteredKeys = Object.values(keys).some((key) => Boolean(key));

  const handleStartClearAll = () => setConfirmingClearAll(true);
  const handleCancelClearAll = () => setConfirmingClearAll(false);
  const handleConfirmClearAllAndReset = () => {
    onClearAll();
    setConfirmingClearAll(false);
  };

  return (
    <div className="text-gray-800 flex flex-col h-full">
      {" "}
      {/* Ensure content can fill height */}
      <div className="flex-grow overflow-y-auto">
        {" "}
        {/* Make ProviderList scrollable if content exceeds */}
        <ProviderList
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          validationMessages={validationMessages}
          isUnverifiedDueToCors={isUnverifiedDueToCors}
          onKeyChange={onKeyChange}
          onValidate={onValidate}
          onClear={onClear}
        />
      </div>
      {/* Footer with ClearAllSection - single line separator */}
      <div>
        <ClearAllSection
          hasKeys={hasAnyEnteredKeys}
          isConfirming={confirmingClearAll}
          onStartClear={handleStartClearAll}
          onConfirmClear={handleConfirmClearAllAndReset}
          onCancelClear={handleCancelClearAll}
        />
      </div>
    </div>
  );
}
