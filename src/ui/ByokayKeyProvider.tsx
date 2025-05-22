// src/ui/ByokayKeyProvider.tsx
import React, { useState, useCallback } from "react";
// Ensure this path reflects the renamed core file (e.g., ByokayKey.ts)
import { SupportedProvider } from "../core/ByokayKeyManager";
import { useMultiApiKeys } from "../hooks/useMultiApiKeys";
import { Modal } from "./components/Modal";
import { ProviderList } from "./components/ProviderList";

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
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  const {
    keys,
    saved,
    validating,
    validated,
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
    setConfirmingClearAll(false); // Reset confirmation state when modal closes
  }, []);

  const hasKeysToClearCurrently = Object.values(keys).some((key) => !!key);

  const startClearAll = () => setConfirmingClearAll(true);
  const cancelClearAll = () => setConfirmingClearAll(false);
  const confirmAndClearAll = () => {
    handleClearAll();
    setConfirmingClearAll(false);
  };

  // Using the exact modalFooter structure and classes you provided for correct styling
  const modalFooter = (
    <div className="flex justify-between items-center">
      {/* Clear All button section */}
      <div>
        {hasKeysToClearCurrently && !confirmingClearAll && (
          <button
            onClick={startClearAll}
            className="text-gray-500 hover:text-red-600 text-xs flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
            title="Clear all API keys"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </button>
        )}
        {confirmingClearAll && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-red-600">Are you sure?</span>
            <button
              onClick={confirmAndClearAll}
              className="text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1 px-2 rounded transition-colors"
            >
              Yes, clear all
            </button>
            <button
              onClick={cancelClearAll}
              className="text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 py-1 px-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Save and Cancel buttons on the right */}
      <div className="flex space-x-3">
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
    </div>
  );

  return (
    <>
      {/* Call the children function, passing it the tools to render the trigger */}
      {children(openModal, hasAnyKey)}

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
    </>
  );
}
