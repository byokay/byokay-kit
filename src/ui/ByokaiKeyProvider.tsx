// src/ui/ByokaiKeyProvider.tsx
import React, { useState } from "react";
import { SupportedProvider } from "../core/KeyManager";
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { ProviderList } from "./components/ProviderList";

interface Props {
  providers?: SupportedProvider[];
  className?: string; // For styling the root trigger button container
}

const defaultProviders: SupportedProvider[] = ["openai"];

export function ByokaiKeyProvider({
  providers = defaultProviders,
  className,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const {
    keys,
    saved,
    validating,
    validated,
    // isLoading, // You can use isLoading for a loading state on the trigger button if needed
    handleKeyChange,
    handleClear,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  } = useMultiApiKeys(providers);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => handleSaveAllAndClose(closeModal)}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save
      </button>
    </div>
  );

  return (
    <div className={className || "inline-block"}>
      {" "}
      {/* Default to inline-block for easier placement */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full text-sm font-medium transition-colors"
      >
        {hasAnyKey ? "Connected" : "Connect AI"}
      </button>
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Connect AI Providers"
        footer={modalFooter}
      >
        <ProviderList
          providers={providers}
          providerNames={providerNames}
          keys={keys}
          saved={saved}
          validating={validating}
          validated={validated}
          onKeyChange={handleKeyChange}
          onValidate={handleValidate}
          onClear={handleClear}
        />
      </Modal>
    </div>
  );
}
