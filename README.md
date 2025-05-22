# Byokay Kit 🔑

A lightweight toolkit for your users to bring their own API keys (OpenAI, Claude, Gemini, etc.) and use them directly in your client-side application.

---

## Core Idea

1.  **User Provides Keys:** Your users input their API keys through a UI provided by this kit.
2.  **Client-Side Storage:** Keys are stored directly in the user's browser **`localStorage`**.
3.  **Direct Usage:** Your frontend application can then retrieve and use these keys for making API calls from the client-side.

---

## Installation

```bash
npm install byokay-kit
# or
yarn add byokay-kit
```

---

## Quick Frontend Implementation

**1. Import Necessary Parts:**

```tsx
// In your React component (e.g., App.tsx or a settings page)
import React from "react";
import { ByokayKeyProvider, SupportedProvider } from "byokay-kit";
// Make sure this path points to the CSS file from the package
import "byokay-kit/dist/styles.css";
```

**2. Use `ByokayKeyProvider`:**

`ByokayKeyProvider` uses a "children as a function" pattern, so you provide your own button or UI element to trigger the key management modal.

```tsx
const App = () => {
  const myAppProviders: SupportedProvider[] = ["openai", "claude", "gemini"];

  return (
    <div
      style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}
    >
      <ByokayKeyProvider providers={myAppProviders}>
        {(openModal, hasAnyKey) => (
          // This is YOUR custom button
          <button
            onClick={openModal}
            style={{
              // Example: style with plain CSS or your preferred method
              padding: "8px 15px",
              border: "1px solid #007bff",
              borderRadius: "20px",
              cursor: "pointer",
              backgroundColor: hasAnyKey ? "#cfe2ff" : "#007bff",
              color: hasAnyKey ? "#0056b3" : "white",
            }}
          >
            {hasAnyKey ? "Manage API Keys" : "Connect API Keys"}
          </button>
        )}
      </ByokayKeyProvider>
    </div>
  );
};

export default App;
```

---

## How It Works (Briefly)

- **`ByokayKeyProvider`**: The main React component. It doesn't render a button itself but provides a function (via `children` prop) for you to render your own trigger. It handles showing the key management modal.
- **`useMultiApiKeys`**: A React hook that manages the state and logic for fetching, validating (simulated), and saving API keys. Used internally by `ByokayKeyProvider`.
- **`KeyManager`**: A class that handles the actual storage of keys in the browser's **`localStorage`**.

---

## ⚠️ IMPORTANT: Security & Usage Guidelines

**Please read this carefully.**

- **Keys are Stored in `localStorage`:**

  - This means API keys are stored directly in the user's web browser.
  - `localStorage` is specific to your website's domain (origin).

- **XSS (Cross-Site Scripting) Risk:**

  - If **YOUR application** has an XSS vulnerability, malicious scripts injected into your site can **access `localStorage` and steal these API keys.**
  - Byokay Kit itself does not prevent XSS flaws in the application that uses it.

- **Your Responsibilities (as the Application Developer):**

  - **Prevent XSS in YOUR application:** This is critical. Sanitize all user inputs, encode output correctly, and use a strong Content Security Policy (CSP).
  - **Educate YOUR users:** Inform them that their API keys are stored in their browser and the associated risks if their system or browser is compromised.

- **Advise YOUR End-Users:**

  - **Use Least Privilege:** Instruct users to create API keys with the minimum permissions necessary for your application's features.
  - **Awareness:** Users should understand keys are stored in their browser.
  - **Clear Keys:** Encourage users to clear keys via the "Clear All" or individual "Clear" buttons in the modal, especially on shared or public computers, or when they no longer use the feature.

- **What NOT To Do / Key Limitations:**
  - **Do NOT assume Byokay Kit makes key storage XSS-proof.** The security of `localStorage` depends on the security of your entire application.
  - **Keys are NOT encrypted in `localStorage` by this kit.** They are stored as plain text (though they are typically opaque strings).
  - **This kit is for CLIENT-SIDE key usage.** If you need to use API keys on your backend, store and manage them on your server, not in the client's browser.
  - **Do NOT use this kit if your application handles highly sensitive operations** with the API keys where even a small risk of client-side exposure is unacceptable. Consider a backend proxy model in such cases.

---

## `ByokayKeyProvider` Props

- `providers?: SupportedProvider[]`: (Optional) Array of provider IDs to support.
  - Default: `["openai"]`
  - Type: `("openai" | "claude" | "gemini" | "grok" | "deepseek")[]`
- `children: (openModal: () => void, hasAnyKey: boolean) => React.ReactNode;`: (**Required**) A function that receives:
  - `openModal: () => void`: Call this to open the key management modal.
  - `hasAnyKey: boolean`: True if any configured provider has a validated key stored.

---

## Advanced Usage

- **`useMultiApiKeys` hook:** Import and use this hook directly if you need to build a completely custom UI or integrate key status deeply into your application logic.
- **`KeyManager` class:** Import and use for direct, non-React interaction with `localStorage` for the keys.

---

## License

MIT
