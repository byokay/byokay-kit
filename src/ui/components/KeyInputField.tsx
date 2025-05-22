import React from "react";

interface KeyInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function KeyInputField({ value, onChange }: KeyInputFieldProps) {
  const hasValue = Boolean(value);

  return (
    <div className="relative">
      {/* Lock icon positioned inside the input */}
      {hasValue && (
        <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
      )}
      <input
        type="password"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter API key"
        className={`w-full px-2 ${
          hasValue ? "pl-7" : "pl-2"
        } py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none font-mono ${
          !hasValue && "placeholder:text-gray-300 placeholder:opacity-50"
        }`}
      />
    </div>
  );
}
