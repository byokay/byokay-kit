// src/ui/ByokayKeyProvider.tsx
import React, { useState, useCallback } from "react";
import { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure path is correct
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { KeyManagerContent } from "./components/KeyManagerContent";

export type { SupportedProvider } from "../core/ByokayKeyManager"; // Ensure path is correct

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

  const {
    keys,
    saved,
    validating,
    validated,
    validationMessages,
    isUnverifiedDueToCors,
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    hasAnyKey,
    providerNames,
  } = useMultiApiKeys(providers);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      {children(openModal, hasAnyKey)}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Link your AI accounts"
        subtitle="Keys are stored only in your browser. For your security, avoid using shared devices or clear keys after."
      >
        <KeyManagerContent
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          validationMessages={validationMessages || {}}
          isUnverifiedDueToCors={isUnverifiedDueToCors || {}}
          onKeyChange={handleKeyChange}
          onValidate={handleValidate}
          onClear={handleClear}
          onClearAll={handleClearAll}
        />
      </Modal>
    </>
  );
}
