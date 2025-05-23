// src/hooks/useMultiApiKeys.ts
import { useState, useEffect, useCallback } from "react";
import { ByokayKey, SupportedProvider } from "../core/ByokayKeyManager"; // Ensure filename matches class ByokayKey
import { validateApiKey } from "../core/apiValidationService";

const manager = new ByokayKey();

export const providerNames: Record<SupportedProvider, string> = {
  openai: "OpenAI",
  claude: "Anthropic Claude",
  gemini: "Google Gemini",
  grok: "xAI Grok",
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
  const [validationMessages, setValidationMessages] = useState<
    Record<SupportedProvider, string | null>
  >({} as Record<SupportedProvider, string | null>);
  const [isUnverifiedDueToCors, setIsUnverifiedDueToCors] = useState<
    Record<SupportedProvider, boolean>
  >({} as Record<SupportedProvider, boolean>); // Crucial state
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
    setIsUnverifiedDueToCors({} as Record<SupportedProvider, boolean>);
    setIsLoading(false);
  }, [initialProviders]);

  const handleKeyChange = useCallback(
    (provider: SupportedProvider, value: string) => {
      setKeys((prev) => ({ ...prev, [provider]: value }));
      setValidated((prev) => ({ ...prev, [provider]: false }));
      setSaved((prev) => ({ ...prev, [provider]: false }));
      setValidationMessages((prev) => ({ ...prev, [provider]: null }));
      setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: false }));
    },
    []
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
    setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: false }));
  }, []);

  const handleClearAll = useCallback(() => {
    initialProviders.forEach((provider) => manager.removeKey(provider));
    setKeys({} as Record<SupportedProvider, string>);
    setValidated({} as Record<SupportedProvider, boolean>);
    setSaved({} as Record<SupportedProvider, boolean>);
    setValidationMessages({} as Record<SupportedProvider, string | null>);
    setIsUnverifiedDueToCors({} as Record<SupportedProvider, boolean>);
  }, [initialProviders]);

  const handleValidate = useCallback(
    async (provider: SupportedProvider, key: string) => {
      if (!key || !key.trim()) {
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: "API key cannot be empty.",
        }));
        setValidating((prev) => ({ ...prev, [provider]: false }));
        return;
      }
      setValidating((prev) => ({ ...prev, [provider]: true }));
      setValidated((prev) => ({ ...prev, [provider]: false }));
      setValidationMessages((prev) => ({ ...prev, [provider]: null }));
      setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: false }));

      const result = await validateApiKey(provider, key);

      if (result.isValid) {
        handleSave(provider, key);
        setValidated((prev) => ({ ...prev, [provider]: true }));
      } else if (result.isCorsError) {
        handleSave(provider, key); // Save the key
        // validated remains false
        setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: true })); // Set CORS flag
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: result.message,
        }));
      } else {
        setValidated((prev) => ({ ...prev, [provider]: false }));
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: result.message || "Invalid API key.",
        }));
      }
      setValidating((prev) => ({ ...prev, [provider]: false }));
    },
    [handleSave]
  );

  const handleSaveAllAndClose = useCallback(
    async (onClose: () => void) => {
      const validationTasks: Promise<void>[] = [];
      const providersToFinalSave: SupportedProvider[] = [];

      for (const currentProvider of initialProviders) {
        const keyVal = keys[currentProvider];
        if (keyVal && keyVal.trim()) {
          if (
            !validated[currentProvider] &&
            !isUnverifiedDueToCors[currentProvider] &&
            !validationMessages[currentProvider]
          ) {
            validationTasks.push(handleValidate(currentProvider, keyVal));
          } else if (
            validated[currentProvider] ||
            isUnverifiedDueToCors[currentProvider]
          ) {
            providersToFinalSave.push(currentProvider);
          }
        }
      }

      if (validationTasks.length > 0) {
        await Promise.all(validationTasks);
      }

      providersToFinalSave.forEach((p) => {
        if (keys[p] && keys[p].trim()) {
          handleSave(p, keys[p]);
        }
      });

      const hasHardErrors = initialProviders.some(
        (p) => validationMessages[p] && !isUnverifiedDueToCors[p]
      );

      if (!hasHardErrors) {
        onClose();
      } else {
        console.warn(
          "ByokayKit: Modal not closed, some keys have hard validation errors."
        );
      }
    },
    [
      keys,
      validated,
      validationMessages,
      isUnverifiedDueToCors,
      handleSave,
      handleValidate,
      initialProviders,
    ]
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
    isUnverifiedDueToCors,
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  };
}
