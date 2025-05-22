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
          onKeyChange={onKeyChange}
          onValidate={onValidate}
          onClear={onClear}
        />
      </div>
      {/* Footer section containing all actions */}
      <div className="mt-auto px-0 pt-3 border-t border-gray-100">
        {/* This actions bar will be the new "footer" content provided by KeyManagerContent */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <ClearAllSection
            hasKeys={hasAnyEnteredKeys}
            isConfirming={confirmingClearAll}
            onStartClear={handleStartClearAll}
            onConfirmClear={handleConfirmClearAllAndReset}
            onCancelClear={handleCancelClearAll}
          />
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSaveAllAndClose}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
