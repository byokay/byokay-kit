// src/ui/components/Modal.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: ModalProps) {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = document.createElement("div");
    document.body.appendChild(el);
    setTarget(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [isOpen]);

  if (!isOpen || !target) return null;

  return createPortal(
    <div
      className="
        fixed inset-0 z-50 bg-black/50
        flex justify-center md:items-center
        items-start pt-10
        animate-fade-in
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white shadow-lg border border-gray-200 transition-all
          w-full h-full grow max-w-none rounded-none
          md:h-auto md:grow-0 md:max-w-md md:rounded-xl
          overflow-hidden flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-50 px-4 py-3 flex justify-between border-b border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-600 mt-1 max-w-sm">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors flex-shrink-0"
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

        {/* Body */}
        <div className="p-4 flex-grow overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-gray-100">{footer}</div>
        )}
      </div>
    </div>,
    target
  );
}
