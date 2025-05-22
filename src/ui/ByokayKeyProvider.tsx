// src/ui/ByokayKeyProvider.tsx
import React, { useState, useCallback } from "react";
import { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure path
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { KeyManagerContent } from "./components/KeyManagerContent"; // Assuming this component exists

export type { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure path

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
  // confirmingClearAll state is now managed within KeyManagerContent or its footer

  const {
    keys,
    saved,
    validating,
    validated,
    validationMessages, // Get this from the hook
    handleKeyChange,
    handleClear,
    handleClearAll, // This will be passed to KeyManagerContent
    handleValidate,
    handleSaveAllAndClose, // This will be passed to KeyManagerContent
    hasAnyKey,
    providerNames,
  } = useMultiApiKeys(providers);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      {children(openModal, hasAnyKey)}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Connect AI Providers"
        // The footer is now part of KeyManagerContent, or handleSaveAllAndClose is passed differently
      >
        <KeyManagerContent
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          validationMessages={validationMessages} // Pass this down
          onKeyChange={handleKeyChange}
          onValidate={handleValidate}
          onClear={handleClear}
          onClearAll={handleClearAll} // Pass this down for the footer in KeyManagerContent
          onSaveAllAndClose={() => handleSaveAllAndClose(closeModal)} // Pass this down
          onCancel={closeModal} // Pass closeModal for the cancel button in KeyManagerContent's footer
        />
      </Modal>
    </>
  );
}
