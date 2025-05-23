// src/ui/components/ProviderList.tsx
import React from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager"; // Ensure path is correct
import { ProviderRow } from "./ProviderRow";

interface ProviderListProps {
  providers: SupportedProvider[];
  providerNames: Record<SupportedProvider, string>;
  keys: Record<SupportedProvider, string>;
  saved: Record<SupportedProvider, boolean>;
  validating: Record<SupportedProvider, boolean>;
  validated: Record<SupportedProvider, boolean>;
  validationMessages: Record<SupportedProvider, string | null>;
  isUnverifiedDueToCors: Record<SupportedProvider, boolean>;
  onKeyChange: (provider: SupportedProvider, value: string) => void;
  onValidate: (provider: SupportedProvider, key: string) => void;
  onClear: (provider: SupportedProvider) => void;
}

export function ProviderList({
  providers,
  providerNames,
  keys,
  saved,
  validating,
  validated,
  validationMessages,
  isUnverifiedDueToCors,
  onKeyChange,
  onValidate,
  onClear,
}: ProviderListProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-x-2 gap-y-1 mb-2 text-xs text-gray-600 font-medium px-1 md:px-3 py-1.5 border-b border-gray-100">
        <div className="col-span-full md:col-span-3">Provider</div>
        <div className="col-span-full md:col-span-7"></div>
        <div className="col-span-full md:col-span-2"></div>
      </div>
      <div className="space-y-0.5 px-1 md:px-0">
        {providers.map((provider) => (
          <ProviderRow
            key={provider}
            provider={provider}
            providerDisplayName={providerNames[provider]}
            currentKey={keys[provider] || ""}
            isSaved={saved[provider] || false}
            isValidating={validating[provider] || false}
            isValidated={validated[provider] || false}
            isUnverifiedDueToCors={isUnverifiedDueToCors[provider] || false}
            validationMessage={validationMessages[provider]} // Pass down the message
            onKeyChange={(value) => onKeyChange(provider, value)}
            onValidate={() => onValidate(provider, keys[provider] || "")}
            onClear={() => onClear(provider)}
          />
        ))}
      </div>
    </div>
  );
}
