// src/ui/ByokayKeyProvider.tsx
import React, { useState, useCallback } from "react";
// Ensure this path reflects the renamed core file (e.g., ByokayKey.ts)
import { SupportedProvider } from "../core/ByokayKeyManager";
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { KeyManagerContent } from "./components/KeyManagerContent";

// Re-export SupportedProvider from the correct path
export type { SupportedProvider } from "../core/ByokayKeyManager";

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
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    hasAnyKey,
    providerNames,
  } = useMultiApiKeys(providers);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      {/* Call the children function, passing it the tools to render the trigger */}
      {children(openModal, hasAnyKey)}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Connect AI Providers"
      >
        <KeyManagerContent
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          onKeyChange={handleKeyChange}
          onValidate={handleValidate}
          onClear={handleClear}
          onClearAll={handleClearAll}
        />
      </Modal>
    </>
  );
}
