// src/ui/ByokayKeyProvider.tsx
import React, { useState, useCallback } from "react";
import { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure this path is correct
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { KeyManagerContent } from "./components/KeyManagerContent";

export type { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure this path is correct

interface Props {
  providers?: SupportedProvider[];
  children: (openModal: () => void, hasAnyKey: boolean) => React.ReactNode;
}

const defaultProviders: SupportedProvider[] = ["openai"];

export function ByokayKeyProvider({
  providers = defaultProviders,
  children,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  // confirmingClearAll state is now managed within KeyManagerContent

  const {
    keys,
    saved,
    validating,
    validated,
    validationMessages, // Make sure this is from your hook if you added it
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  } = useMultiApiKeys(providers);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => {
    setShowModal(false);
    // If confirmingClearAll was managed here, it would be reset here too.
    // Since it's in KeyManagerContent, it will reset when KeyManagerContent unmounts or remounts, or internally.
  }, []);

  // modalFooter is no longer defined here, as KeyManagerContent will handle its own action buttons.

  return (
    <>
      {children(openModal, hasAnyKey)}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Connect AI Providers"
        // footer prop is removed, as KeyManagerContent now includes the footer actions.
        // The Modal's main children area will contain KeyManagerContent,
        // which in turn has the ProviderList and the action buttons at its bottom.
      >
        <KeyManagerContent
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          validationMessages={validationMessages || {}} // Pass down, ensure default if not in hook yet
          onKeyChange={handleKeyChange}
          onValidate={handleValidate}
          onClear={handleClear}
          onClearAll={handleClearAll}
          onSaveAllAndClose={() => handleSaveAllAndClose(closeModal)}
          onCancel={closeModal}
        />
      </Modal>
    </>
  );
}
