# Byokay Kit

Byokay Kit helps frontend applications **delegate AI API key management** to users, simplifying integrations with services like OpenAI, Claude, and Gemini.

Currently, it enables users to **securely store and manage their own API keys locally** in the browser, in a "bring your own key - BYOK" manner, eliminating the need for backend infrastructure to handle AI service credentials.

---

## Core Idea

1. **User-managed keys**: Users connect and manage their own AI service API keys via a simple UI.
2. **Client-side storage**: Keys are stored **locally** in the user's browser (`localStorage`), scoped to your domain.
3. **Frontend-first**: Simplifies your application — no need to proxy or store API keys on your backend.
4. **Customizable integration**: Add a “Connect AI” button with your preferred design.

---

## Installation

```bash
npm install byokay-kit
# or
yarn add byokay-kit
```

---

## Quick Start

**1. Import Necessary Parts:**

```tsx
import React from "react";
import { ByokayKeyProvider, SupportedProvider, ByokayKey } from "byokay-kit";
```

**2. Use `ByokayKeyProvider` with Your Custom Trigger:**

`ByokayKeyProvider` lets you define your own button or UI element to open the key management modal.

```tsx
// ExampleComponent.tsx
// (Ensure you import React, ByokayKeyProvider, SupportedProvider from 'byokay-kit'

const ExampleComponent = () => {
  // Define which AI providers you want this instance to support
  const providersForThisInstance: SupportedProvider[] = ["openai", "claude"];

  return (
    // This div is part of your application's layout, positioning the trigger button
    <div style={{ padding: "1rem", textAlign: "right" }}>
      <ByokayKeyProvider providers={providersForThisInstance}>
        {(openModal, hasAnyKey) => (
          // This is YOUR custom button. Style it however you need.
          <button
            onClick={openModal}
            style={{
              // Example: style with plain CSS or your preferred method
              padding: "10px 15px",
              fontSize: "0.9rem",
              cursor: "pointer",
              border: "1px solid #007bff",
              borderRadius: "20px",
              backgroundColor: hasAnyKey
                ? "hsl(210, 100%, 95%)"
                : "hsl(210, 100%, 50%)",
              color: hasAnyKey ? "hsl(210, 100%, 40%)" : "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {hasAnyKey ? "AI Connected" : "Connect AI"}{" "}
          </button>
        )}
      </ByokayKeyProvider>
    </div>
  );
};

// You would then use <ExampleComponent /> somewhere in your application.
export default ExampleComponent;
```

**3. Using Stored Keys for an API Call:**

Once keys are stored, retrieve them using an instance of `ByokayKey`.

```tsx
// Example: Function to call AI providers
// Make sure ByokayKey is imported, as shown in "Step 1. Import Necessary Parts"
const byokayKey = new ByokayKey();

async function callAI(prompt: string) {
  // You can fetch multiple keys at once if needed
  const apiKeys = byokayKey.getKeys("openai", "deepseek");

  if (apiKeys.openai) {
    console.log("Attempting to use OpenAI key...");
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKeys.openai}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      if (!response.ok)
        throw new Error(`OpenAI API request failed: ${response.statusText}`);

      const data = await response.json();
      console.log("OpenAI Response:", data.choices[0].message.content);
      // return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
    }
  } else {
    alert('OpenAI key not set. Please use "Connect AI" to set it.');
  }

  // You could similarly use apiKeys.deepseek if present
}

// Example usage:
// callAI("What's the weather like today?");
```

---

## How It Works (Briefly)

- **`ByokayKeyProvider`**: Main React component. Uses its `children` prop (as a function) for your custom trigger. Manages and shows the key input modal.
- **`useMultiApiKeys`**: React hook handling API key logic. Used by `ByokayKeyProvider`.
- **`ByokayKey`**: Class for key storage in browser **`localStorage`**.

---

## ⚠️ IMPORTANT: Security & Usage Guidelines

**Please read this carefully.**

- **Keys are Stored in `localStorage`:**

  - API keys are stored in the user's web browser.
  - `localStorage` is specific to your website's domain.

- **XSS (Cross-Site Scripting) Risk:**

  - If **YOUR application** has an XSS vulnerability, malicious scripts on your site can **access `localStorage` and steal these API keys.**
  - Byokay Kit does not prevent XSS flaws in the application that uses it.

- **Your Responsibilities (as the Application Developer):**

  - **Prevent XSS in YOUR app:** Sanitize inputs, encode outputs, use Content Security Policy (CSP).
  - **Educate YOUR users:** Inform them about browser storage and risks.

- **Advise YOUR End-Users:**

  - **Use Least Privilege Keys:** Create API keys with only the minimum needed permissions.
  - **Browser Awareness:** Understand keys are stored in their browser.
  - **Clear Keys:** Use modal's "Clear All" or individual "Clear," especially on shared computers.

- **What NOT To Do / Key Limitations:**
  - **Do NOT rely on Byokay Kit for XSS protection.** Your app's security is vital.
  - **Keys are NOT encrypted in `localStorage` by this kit.**
  - **For CLIENT-SIDE key usage only.** For backend operations, keep keys on your server.
  - **Avoid for highly sensitive operations** if client-side key exposure is too risky. Consider a backend proxy.

---

## `ByokayKeyProvider` Props

- `providers?: SupportedProvider[]`: (Optional) Array of provider IDs.
  - **Default: `["openai"]` if omitted.**
  - Available types: `("openai" | "claude" | "gemini" | "grok" | "deepseek")[]`
- `children: (openModal: () => void, hasAnyKey: boolean) => React.ReactNode;`: (**Required**) Function receiving:
  - `openModal: () => void`: Call to open the key management modal.
  - `hasAnyKey: boolean`: True if any configured provider has a validated key.

---

## Advanced Usage

- **`useMultiApiKeys` hook:** For custom UI or deeper logic integration.
- **`ByokayKey` class:** For direct `localStorage` key interaction, including `getKeys(...providers)`.

---

## License

MIT
