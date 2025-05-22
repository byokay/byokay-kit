// src/hooks/useMultiApiKeys.ts
import { useState, useEffect, useCallback } from "react";
import { KeyManager, SupportedProvider } from "../core/KeyManager";

// Instantiate KeyManager here or pass it as an argument if it needs to be a shared singleton
const manager = new KeyManager();

export const providerNames: Record<SupportedProvider, string> = {
  openai: "OpenAI",
  claude: "Anthropic Claude",
  gemini: "Google Gemini",
  grok: "Grok",
  deepseek: "DeepSeek",
};

export function useMultiApiKeys(initialProviders: SupportedProvider[]) {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedKeys: Record<SupportedProvider, string> = {} as Record<
      SupportedProvider,
      string
    >;
    const initialValidated: Record<SupportedProvider, boolean> = {} as Record<
      SupportedProvider,
      boolean
    >;
    setIsLoading(true);

    initialProviders.forEach((provider) => {
      const stored = manager.getKey(provider);
      if (stored) {
        storedKeys[provider] = stored;
        initialValidated[provider] = true; // Assume stored keys are validated
      }
    });

    setKeys(storedKeys);
    setValidated(initialValidated);
    setIsLoading(false);
  }, [initialProviders]);

  const handleKeyChange = useCallback(
    (provider: SupportedProvider, value: string) => {
      setKeys((prev) => ({
        ...prev,
        [provider]: value,
      }));
      // Reset validation state when input changes if it was previously validated
      if (validated[provider]) {
        setValidated((prev) => ({
          ...prev,
          [provider]: false,
        }));
      }
      // Also reset saved status
      if (saved[provider]) {
        setSaved((prev) => ({
          ...prev,
          [provider]: false,
        }));
      }
    },
    [validated, saved]
  );

  const handleSave = useCallback((provider: SupportedProvider, key: string) => {
    if (!key || !key.trim()) return;

    manager.setKey(provider, key);
    // No need to setKeys here if handleKeyChange already did,
    // but if called directly (e.g. from validate or saveAll), ensure key is in state
    setKeys((prev) => ({ ...prev, [provider]: key }));

    setSaved((prev) => ({ ...prev, [provider]: true }));
    setTimeout(() => {
      setSaved((prev) => ({ ...prev, [provider]: false }));
    }, 1500);
  }, []);

  const handleClear = useCallback((provider: SupportedProvider) => {
    manager.removeKey(provider);
    setKeys((prev) => {
      const newKeys = { ...prev };
      delete newKeys[provider];
      return newKeys;
    });
    setValidated((prev) => ({ ...prev, [provider]: false }));
    setSaved((prev) => ({ ...prev, [provider]: false })); // Clear saved status too
  }, []);

  const handleClearAll = useCallback(() => {
    initialProviders.forEach((provider) => {
      manager.removeKey(provider);
    });
    setKeys({} as Record<SupportedProvider, string>);
    setValidated({} as Record<SupportedProvider, boolean>);
    setSaved({} as Record<SupportedProvider, boolean>);
  }, [initialProviders]);

  const handleValidate = useCallback(
    (provider: SupportedProvider, key: string) => {
      if (!key || !key.trim()) return;

      setValidating((prev) => ({ ...prev, [provider]: true }));

      setTimeout(() => {
        // Simulate validation
        // In real scenario, an API call would happen here.
        // If successful:
        handleSave(provider, key); // Save also marks as 'saved' temporarily
        setValidated((prev) => ({ ...prev, [provider]: true }));
        setValidating((prev) => ({ ...prev, [provider]: false }));
        // If failed, you would set an error state and not validated.
      }, 1000);
    },
    [handleSave]
  );

  const handleSaveAllAndClose = useCallback(
    (onClose: () => void) => {
      Object.entries(keys).forEach(([providerStr, keyVal]) => {
        const provider = providerStr as SupportedProvider;
        if (keyVal && keyVal.trim()) {
          // If there's a key to save
          if (!validated[provider]) {
            // If not validated, validate (which includes save)
            handleValidate(provider, keyVal);
          } else {
            // If already validated, but maybe changed and not re-validated, just save
            handleSave(provider, keyVal);
          }
        }
      });
      onClose();
    },
    [keys, validated, handleSave, handleValidate]
  );

  const hasAnyKey = initialProviders.some((provider) =>
    Boolean(keys[provider] && validated[provider])
  );

  return {
    keys,
    saved,
    validating,
    validated,
    isLoading,
    handleKeyChange,
    // handleSave, // Expose if direct save without validate is needed, currently validate calls save
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames, // Exporting this for convenience
  };
}
