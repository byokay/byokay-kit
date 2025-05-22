// src/hooks/useMultiApiKeys.ts
import { useState, useEffect, useCallback } from "react";
// Updated import statement
import { ByokayKey, SupportedProvider } from "../core/ByokayKeyManager";

// Instantiate with the new class name
const manager = new ByokayKey();

export const providerNames: Record<SupportedProvider, string> = {
  openai: "OpenAI",
  claude: "Anthropic Claude",
  gemini: "Google Gemini",
  grok: "xAI Grok",
  deepseek: "DeepSeek",
  llama: "Meta Llama",
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
      const stored = manager.getKey(provider); // Uses the 'manager' instance (now ByokayKey)
      if (stored) {
        storedKeys[provider] = stored;
        initialValidated[provider] = true;
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
      if (validated[provider]) {
        setValidated((prev) => ({ ...prev, [provider]: false }));
      }
      if (saved[provider]) {
        setSaved((prev) => ({ ...prev, [provider]: false }));
      }
    },
    [validated, saved]
  );

  const handleSave = useCallback((provider: SupportedProvider, key: string) => {
    if (!key || !key.trim()) return;
    manager.setKey(provider, key); // Uses the 'manager' instance
    setKeys((prev) => ({ ...prev, [provider]: key }));
    setSaved((prev) => ({ ...prev, [provider]: true }));
    setTimeout(() => {
      setSaved((prev) => ({ ...prev, [provider]: false }));
    }, 1500);
  }, []);

  const handleClear = useCallback((provider: SupportedProvider) => {
    manager.removeKey(provider); // Uses the 'manager' instance
    setKeys((prev) => {
      const newKeys = { ...prev };
      delete newKeys[provider];
      return newKeys;
    });
    setValidated((prev) => ({ ...prev, [provider]: false }));
    setSaved((prev) => ({ ...prev, [provider]: false }));
  }, []);

  const handleClearAll = useCallback(() => {
    initialProviders.forEach((provider) => {
      manager.removeKey(provider); // Uses the 'manager' instance
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
        handleSave(provider, key);
        setValidated((prev) => ({ ...prev, [provider]: true }));
        setValidating((prev) => ({ ...prev, [provider]: false }));
      }, 1000);
    },
    [handleSave]
  );

  const handleSaveAllAndClose = useCallback(
    (onClose: () => void) => {
      Object.entries(keys).forEach(([providerStr, keyVal]) => {
        const provider = providerStr as SupportedProvider;
        if (keyVal && keyVal.trim()) {
          if (!validated[provider]) {
            handleValidate(provider, keyVal);
          } else {
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
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  };
}
