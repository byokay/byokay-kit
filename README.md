# Byokay Kit

Byokay Kit lets users bring their own AI API keys and store them securely in their browser.
This eliminates the need for your app to manage sensitive credentials or maintain AI API backend infrastructure.

---

## Core Idea

1. **User-managed keys**: Users connect and manage their own AI service API keys via a simple UI.
2. **Client-side storage**: Keys are stored **locally** in the user's browser (`localStorage`), scoped to your domain.
3. **Frontend-first**: Simplifies your application — no need to proxy or store API keys on your backend.
4. **Customizable integration**: Add a “Connect AI” button with your preferred design.

---

## Live Demo

<video
src="./assets/demo.mp4"
autoplay
muted
loop
playsinline
style="max-width:100%; border-radius:8px;"

> 🎬 Your browser doesn’t support HTML5 video.
> </video>

## Supported Providers

Byokay Kit currently supports these AI services:

- `openai`
- `claude`
- `gemini`
- `grok`
- `deepseek`

Use one or more of these when configuring the provider list.

## Installation

```bash
npm install byokay-kit
# or
yarn add byokay-kit
```

---

## Quick Start

**1. Import:**

```tsx
import { ByokayKeyProvider, SupportedProvider, ByokayKey } from "byokay-kit";
```

**2. Add `ByokayKeyProvider` in your app:**

```tsx
// ExampleComponent.tsx
const providers: SupportedProvider[] = ["openai", "claude"];

<ByokayKeyProvider providers={providers}>
  {(openModal, hasAnyKey) => (
    <button onClick={openModal}>
      {hasAnyKey ? "AI Connected" : "Connect AI"}
    </button>
  )}
</ByokayKeyProvider>;
```

**3. Use Stored Keys for AI API Calls:**

Once keys are stored, retrieve them using an instance of `ByokayKey`.

```tsx
// Example: Function to call AI providers
async function callOpenAI() {
  const byokayKey = new ByokayKey();
  const { openai } = byokayKey.getKeys("openai");

  if (openai) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello!" }],
      }),
    });
    const data = await res.json();
    console.log(data);
  }
}
```

---

## How It Works

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

## Project Links

- **Repository:** [https://github.com/byokay/byokay-kit](https://github.com/byokay/byokay-kit)
- **Issues:** [https://github.com/byokay/byokay-kit/issues](https://github.com/byokay/byokay-kit/issues)

## License

MIT
