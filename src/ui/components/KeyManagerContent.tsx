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
}: KeyManagerContentProps) {
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);
  const hasAnyEnteredKeys = Object.values(keys).some((key) => Boolean(key));

  const handleStartClearAll = () => setConfirmingClearAll(true);
  const handleCancelClearAll = () => setConfirmingClearAll(false);
  const handleConfirmClearAllAndReset = () => {
    onClearAll();
    setConfirmingClearAll(false);
  };

  return (
    <div className="flex flex-col h-full text-gray-800">
      {/* ProviderList area with padding and scrolling */}
      <div className="flex-grow overflow-y-auto p-4">
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

      {/* Footer Actions Bar */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <ClearAllSection
              hasKeys={hasAnyEnteredKeys}
              isConfirming={confirmingClearAll}
              onStartClear={handleStartClearAll}
              onConfirmClear={handleConfirmClearAllAndReset}
              onCancelClear={handleCancelClearAll}
            />
          </div>
          <div className="text-xs text-gray-400">
            <a
              href="https://github.com/byokay/byokay-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Powered by Byokay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
