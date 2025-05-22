// src/ui/components/ProviderList.tsx
import React from "react";
import { SupportedProvider } from "../../core/ByokayKeyManager";
import { ProviderRow } from "./ProviderRow";

interface ProviderListProps {
  providers: SupportedProvider[];
  providerNames: Record<SupportedProvider, string>;
  keys: Record<SupportedProvider, string>;
  saved: Record<SupportedProvider, boolean>;
  validating: Record<SupportedProvider, boolean>;
  validated: Record<SupportedProvider, boolean>;
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
  onKeyChange,
  onValidate,
  onClear,
}: ProviderListProps) {
  return (
    <div className="w-full">
      {/* Header row */}
      <div className="grid grid-cols-12 gap-2 mb-3 text-xs text-gray-600 font-medium px-3 py-2 border-b border-gray-100">
        <div className="col-span-3">Provider</div>
        <div className="col-span-7">API Key</div>
        <div className="col-span-2 text-right pr-2">Actions</div>
      </div>

      {/* Provider rows container with spacing */}
      <div className="space-y-0.5">
        {/* Provider rows */}
        {providers.map((provider) => (
          <ProviderRow
            key={provider}
            provider={provider}
            providerDisplayName={providerNames[provider]}
            currentKey={keys[provider] || ""}
            isSaved={saved[provider] || false}
            isValidating={validating[provider] || false}
            isValidated={validated[provider] || false}
            onKeyChange={(value) => onKeyChange(provider, value)}
            onValidate={() => onValidate(provider, keys[provider] || "")}
            onClear={() => onClear(provider)}
          />
        ))}
      </div>
    </div>
  );
}
