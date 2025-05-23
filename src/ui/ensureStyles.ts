// src/ui/ensureStyles.ts
/**
 * Ensures that Byokay Kit's stylesheet is loaded.
 *
 * This injects a <link> tag for the pre-built CSS at runtime,
 * so consumers of the library don't need to manually import it.
 *
 * Avoids requiring any additional setup in user projects (e.g., Next.js).
 */
export function ensureStyles() {
  if (typeof window === "undefined") return;
  const id = "byokay-kit-link";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/byokay-kit@0.1.6/dist/styles.css";
  document.head.appendChild(link);
}
