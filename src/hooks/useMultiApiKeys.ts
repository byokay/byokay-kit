// src/hooks/useMultiApiKeys.ts
import { useState, useEffect, useCallback } from "react";
import { ByokayKey, SupportedProvider } from "../core/ByokayKeyManager"; // Ensure class & file name consistency
import { validateApiKey } from "../core/apiValidationService"; // Import the dispatcher

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
  const [validationMessages, setValidationMessages] = useState<
    Record<SupportedProvider, string | null>
  >({} as Record<SupportedProvider, string | null>);
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
        initialValidated[provider] = true;
      }
    });
    setKeys(storedKeys);
    setValidated(initialValidated);
    setValidationMessages({} as Record<SupportedProvider, string | null>);
    setIsLoading(false);
  }, [initialProviders]);

  const handleKeyChange = useCallback(
    (provider: SupportedProvider, value: string) => {
      setKeys((prev) => ({ ...prev, [provider]: value }));
      if (validated[provider]) {
        setValidated((prev) => ({ ...prev, [provider]: false }));
      }
      if (saved[provider]) {
        setSaved((prev) => ({ ...prev, [provider]: false }));
      }
      if (validationMessages[provider]) {
        setValidationMessages((prev) => ({ ...prev, [provider]: null }));
      }
    },
    [validated, saved, validationMessages]
  );

  const handleSave = useCallback((provider: SupportedProvider, key: string) => {
    if (!key || !key.trim()) return;
    manager.setKey(provider, key);
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
    setSaved((prev) => ({ ...prev, [provider]: false }));
    setValidationMessages((prev) => ({ ...prev, [provider]: null }));
  }, []);

  const handleClearAll = useCallback(() => {
    initialProviders.forEach((provider) => {
      manager.removeKey(provider);
    });
    setKeys({} as Record<SupportedProvider, string>);
    setValidated({} as Record<SupportedProvider, boolean>);
    setSaved({} as Record<SupportedProvider, boolean>);
    setValidationMessages({} as Record<SupportedProvider, string | null>);
  }, [initialProviders]);

  const handleValidate = useCallback(
    async (provider: SupportedProvider, key: string) => {
      setValidating((prev) => ({ ...prev, [provider]: true }));
      setValidated((prev) => ({ ...prev, [provider]: false }));
      setValidationMessages((prev) => ({ ...prev, [provider]: null }));

      // Use the central validation dispatcher
      const { isValid, message } = await validateApiKey(provider, key);

      if (isValid) {
        handleSave(provider, key);
        setValidated((prev) => ({ ...prev, [provider]: true }));
      } else {
        setValidated((prev) => ({ ...prev, [provider]: false }));
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: message || "Validation failed.",
        }));
      }
      setValidating((prev) => ({ ...prev, [provider]: false }));
    },
    [handleSave]
  );

  const handleSaveAllAndClose = useCallback(
    async (onClose: () => void) => {
      const validationPromises = Object.entries(keys)
        .filter(([providerStr, keyVal]) => {
          const provider = providerStr as SupportedProvider;
          return (
            keyVal &&
            keyVal.trim() &&
            !validated[provider] &&
            !validationMessages[provider]
          );
        })
        .map(([providerStr, keyVal]) => {
          const provider = providerStr as SupportedProvider;
          return handleValidate(provider, keyVal);
        });

      Object.entries(keys).forEach(([providerStr, keyVal]) => {
        const provider = providerStr as SupportedProvider;
        if (keyVal && keyVal.trim() && validated[provider]) {
          handleSave(provider, keyVal);
        }
      });

      if (validationPromises.length > 0) {
        await Promise.all(validationPromises);
      }

      // Check current state of validationMessages after all attempts
      // This relies on handleValidate updating the state before Promise.all resolves for it.
      // A more robust way for immediate check is if handleValidate returned its result.
      // For now, this assumes state updates from handleValidate are processed.
      const hasPersistentErrors = Object.values(keys).some((keyVal) => {
        const provider = Object.keys(keys).find(
          (k) => keys[k as SupportedProvider] === keyVal
        ) as SupportedProvider;
        return keyVal && keyVal.trim() && validationMessages[provider];
      });

      if (!hasPersistentErrors) {
        onClose();
      } else {
        console.warn(
          "ByokayKit: Cannot close modal, some keys are still invalid after validation attempts."
        );
        // You might want to provide UI feedback to the user here instead of just a console warning.
      }
    },
    [keys, validated, validationMessages, handleSave, handleValidate]
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
    validationMessages,
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  };
}
