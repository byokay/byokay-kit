import React, { useState } from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager";
import { ProviderList } from "./ProviderList";
import { ClearAllSection } from "./ClearAllSection";

interface KeyManagerContentProps {
  providers: SupportedProvider[];
  providerNames: Record<SupportedProvider, string>;
  keys: Record<SupportedProvider, string>;
  saved: Record<SupportedProvider, boolean>;
  validating: Record<SupportedProvider, boolean>;
  validated: Record<SupportedProvider, boolean>;
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
  onKeyChange,
  onValidate,
  onClear,
  onClearAll,
}: KeyManagerContentProps) {
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  const hasKeys = Object.values(keys).some((key) => Boolean(key));

  const handleStartClearAll = () => setConfirmingClearAll(true);
  const handleCancelClearAll = () => setConfirmingClearAll(false);
  const handleConfirmClearAll = () => {
    onClearAll();
    setConfirmingClearAll(false);
  };

  return (
    <div>
      <ProviderList
        providers={providers}
        providerNames={providerNames}
        keys={keys}
        saved={saved}
        validating={validating}
        validated={validated}
        onKeyChange={onKeyChange}
        onValidate={onValidate}
        onClear={onClear}
      />

      <ClearAllSection
        hasKeys={hasKeys}
        isConfirming={confirmingClearAll}
        onStartClear={handleStartClearAll}
        onConfirmClear={handleConfirmClearAll}
        onCancelClear={handleCancelClearAll}
      />
    </div>
  );
}
