import React, { useState, useEffect } from "react";
import { KeyManager, SupportedProvider } from "../core/KeyManager";

interface Props {
  providers?: SupportedProvider[];
  className?: string;
}

const manager = new KeyManager();

// Provider display names based on actual SupportedProvider type
const providerNames: Record<SupportedProvider, string> = {
  openai: "OpenAI",
  claude: "Anthropic Claude",
  gemini: "Google Gemini",
};

export function KeyInput({ providers = ["openai"], className }: Props) {
  const [keys, setKeys] = useState<Record<SupportedProvider, string>>(
    {} as Record<SupportedProvider, string>
  );
  const [saved, setSaved] = useState<Record<SupportedProvider, boolean>>(
    {} as Record<SupportedProvider, boolean>
  );
  const [validating, setValidating] = useState<
    Record<SupportedProvider, boolean>
  >({} as Record<SupportedProvider, boolean>);
  const [validated, setValidated] = useState<
    Record<SupportedProvider, boolean>
  >({} as Record<SupportedProvider, boolean>);
  const [showInput, setShowInput] = useState(false);

  const hasAnyKey = providers.some((provider) => Boolean(keys[provider]));

  useEffect(() => {
    const storedKeys: Record<SupportedProvider, string> = {} as Record<
      SupportedProvider,
      string
    >;

    providers.forEach((provider) => {
      const stored = manager.getKey(provider);
      if (stored) {
        storedKeys[provider] = stored;
        setValidated((prev) => ({
          ...prev,
          [provider]: true,
        }));
      }
    });

    setKeys(storedKeys);
  }, [providers]);

  const handleSave = (provider: SupportedProvider, key: string) => {
    if (!key.trim()) return;

    manager.setKey(provider, key);
    setKeys((prev) => ({
      ...prev,
      [provider]: key,
    }));

    setSaved((prev) => ({
      ...prev,
      [provider]: true,
    }));

    setTimeout(() => {
      setSaved((prev) => ({
        ...prev,
        [provider]: false,
      }));
    }, 1500);
  };

  const handleClear = (provider: SupportedProvider) => {
    manager.removeKey(provider);
    setKeys((prev) => {
      const newKeys = { ...prev };
      delete newKeys[provider];
      return newKeys;
    });
    setValidated((prev) => ({
      ...prev,
      [provider]: false,
    }));
  };

  // Simulates validating the API key
  const handleValidate = (provider: SupportedProvider, key: string) => {
    if (!key.trim()) return;

    setValidating((prev) => ({
      ...prev,
      [provider]: true,
    }));

    // Simulate validation process
    setTimeout(() => {
      // Here we would actually validate with the API
      // For now we just simulate success
      handleSave(provider, key);

      setValidated((prev) => ({
        ...prev,
        [provider]: true,
      }));

      setValidating((prev) => ({
        ...prev,
        [provider]: false,
      }));
    }, 1000);
  };

  return (
    <div className={className}>
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full text-sm font-medium transition-colors"
        >
          {hasAnyKey ? "Connected" : "Connect AI"}
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 animate-fade-in transition-all w-full max-w-md">
            {/* Header */}
            <div className="bg-blue-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
              <h3 className="font-medium text-gray-800">
                Connect AI Providers
              </h3>
              <button
                onClick={() => setShowInput(false)}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              {/* Table layout for better alignment */}
              <div className="w-full">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-500 font-medium px-1">
                  <div className="col-span-3">Provider</div>
                  <div className="col-span-7">API Key</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Provider rows */}
                {providers.map((provider) => (
                  <div
                    key={provider}
                    className="grid grid-cols-12 gap-2 items-center mb-3 py-2 border-b border-gray-100"
                  >
                    {/* Provider name with connection status */}
                    <div className="col-span-3 flex items-center">
                      <div
                        className={`text-sm font-medium ${
                          keys[provider] && validated[provider]
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {providerNames[provider]}
                        {keys[provider] && validated[provider] && (
                          <span className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                    </div>

                    {/* Input field */}
                    <div className="col-span-7 flex">
                      <input
                        type="password"
                        value={keys[provider] || ""}
                        onChange={(e) => {
                          setKeys((prev) => ({
                            ...prev,
                            [provider]: e.target.value,
                          }));
                          // Reset validation state when input changes
                          if (validated[provider]) {
                            setValidated((prev) => ({
                              ...prev,
                              [provider]: false,
                            }));
                          }
                        }}
                        placeholder="Enter API key"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="col-span-2 flex items-center justify-end space-x-1">
                      {saved[provider] ? (
                        <span className="text-green-600 text-xs bg-green-50 py-1 px-2 rounded-full">
                          Saved!
                        </span>
                      ) : validating[provider] ? (
                        <span className="text-blue-600 text-xs bg-blue-50 py-1 px-2 rounded-full animate-pulse">
                          Validating...
                        </span>
                      ) : (
                        <>
                          {/* Validate button with checkmark that becomes bold when validated */}
                          <button
                            onClick={() =>
                              handleValidate(provider, keys[provider] || "")
                            }
                            disabled={!keys[provider]}
                            className={`p-1.5 rounded ${
                              validated[provider]
                                ? "text-green-600 bg-green-50"
                                : keys[provider]
                                ? "text-gray-400 hover:text-green-600 hover:bg-green-50"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              validated[provider] ? "Validated" : "Validate key"
                            }
                          >
                            <span
                              className={`text-lg ${
                                validated[provider] ? "font-bold" : "opacity-60"
                              }`}
                            >
                              ✓
                            </span>
                          </button>

                          {/* Delete button - only show if we have a key */}
                          {keys[provider] && (
                            <button
                              onClick={() => handleClear(provider)}
                              className="p-1.5 rounded text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100"
                              title="Remove key"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <button
                  onClick={() => setShowInput(false)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
