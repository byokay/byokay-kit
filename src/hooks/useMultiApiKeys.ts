// src/hooks/useMultiApiKeys.ts
import { useState, useEffect, useCallback } from "react";
import { ByokayKey, SupportedProvider } from "../core/ByokayKeyManager"; // Ensure path/name are correct
import { validateApiKey } from "../core/apiValidationService"; // Ensure path is correct

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
  const [isUnverifiedDueToCors, setIsUnverifiedDueToCors] = useState<
    Record<SupportedProvider, boolean>
  >({} as Record<SupportedProvider, boolean>); // New state
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
        initialValidated[provider] = true; // Assume stored is validated
      }
    });
    setKeys(storedKeys);
    setValidated(initialValidated);
    setValidationMessages({} as Record<SupportedProvider, string | null>);
    setIsUnverifiedDueToCors({} as Record<SupportedProvider, boolean>); // Initialize
    setIsLoading(false);
  }, [initialProviders]);

  const handleKeyChange = useCallback(
    (provider: SupportedProvider, value: string) => {
      setKeys((prev) => ({ ...prev, [provider]: value }));
      setValidated((prev) => ({ ...prev, [provider]: false })); // Always reset validation on change
      setSaved((prev) => ({ ...prev, [provider]: false }));
      setValidationMessages((prev) => ({ ...prev, [provider]: null }));
      setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: false })); // Reset CORS flag
    },
    [] // Removed dependencies that might cause stale closures if not careful, rely on current values
  );

  const handleSave = useCallback((provider: SupportedProvider, key: string) => {
    if (!key || !key.trim()) return;
    manager.setKey(provider, key);
    setKeys((prev) => ({ ...prev, [provider]: key })); // Ensure local state is also updated
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

      const result = await validateApiKey(provider, key); // from apiValidationService

      if (result.isValid) {
        handleSave(provider, key);
        setValidated((prev) => ({ ...prev, [provider]: true }));
      } else if (result.isCorsError) {
        handleSave(provider, key); // Save the key as per your requirement
        // validated remains false
        setIsUnverifiedDueToCors((prev) => ({ ...prev, [provider]: true })); // Set specific CORS flag
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: result.message,
        }));
      } else {
        // Genuinely invalid or other error (not CORS related)
        // validated remains false
        // isUnverifiedDueToCors remains false
        setValidationMessages((prev) => ({
          ...prev,
          [provider]: result.message || "Invalid API key.",
        }));
        // Do NOT save if confirmed invalid by API
      }
      setValidating((prev) => ({ ...prev, [provider]: false }));
    },
    [handleSave] // handleSave is stable due to its own useCallback
  );

  const handleSaveAllAndClose = useCallback(
    async (onClose: () => void) => {
      const validationTasks: Promise<void>[] = [];
      const providersToFinalSave: SupportedProvider[] = [];

      for (const provider of initialProviders) {
        const keyVal = keys[provider];
        if (keyVal && keyVal.trim()) {
          // If not validated AND not already flagged as CORS unverified (to avoid re-validating if user is okay with CORS message)
          // AND no other validation message exists.
          if (
            !validated[provider] &&
            !isUnverifiedDueToCors[provider] &&
            !validationMessages[provider]
          ) {
            validationTasks.push(handleValidate(provider, keyVal));
          } else if (validated[provider] || isUnverifiedDueToCors[provider]) {
            // If it was already validated, or if it's a CORS-unverified key the user wants to keep,
            // ensure it's saved if potentially edited.
            providersToFinalSave.push(provider);
          }
        }
      }

      if (validationTasks.length > 0) {
        await Promise.all(validationTasks);
      }

      providersToFinalSave.forEach((provider) => {
        if (keys[provider] && keys[provider].trim()) {
          // Ensure there's a key to save
          handleSave(provider, keys[provider]);
        }
      });

      // After all attempts, check if any "hard" validation errors remain (not CORS unverified messages)
      const hasHardErrors = initialProviders.some(
        (provider) =>
          validationMessages[provider] && !isUnverifiedDueToCors[provider]
      );

      if (!hasHardErrors) {
        // Allow closing if only CORS unverified messages or no messages
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

  const hasAnyKey = initialProviders.some(
    (provider) => Boolean(keys[provider] && validated[provider]) // "Connected" means validated
  );

  return {
    keys,
    saved,
    validating,
    validated,
    isLoading,
    validationMessages,
    isUnverifiedDueToCors, // Expose new state
    handleKeyChange,
    handleClear,
    handleClearAll,
    handleValidate,
    handleSaveAllAndClose,
    hasAnyKey,
    providerNames,
  };
}
