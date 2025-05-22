export type SupportedProvider =
  | "openai"
  | "claude"
  | "gemini"
  | "grok"
  | "deepseek";

interface KeyManagerOptions {
  storage?: Storage; // localStorage, sessionStorage, or memory fallback
}

export class KeyManager {
  private storage: Storage;
  private memoryStorage: Map<string, string>;

  constructor(options: KeyManagerOptions = {}) {
    this.storage =
      options.storage ||
      (typeof window !== "undefined"
        ? localStorage
        : this.createMemoryStorage());
    this.memoryStorage = new Map();
  }

  setKey(provider: SupportedProvider, key: string): void {
    const keyName = this.getStorageKey(provider);
    this.storage.setItem(keyName, key);
    this.memoryStorage.set(keyName, key);
  }

  getKey(provider: SupportedProvider): string | null {
    const keyName = this.getStorageKey(provider);
    return this.memoryStorage.get(keyName) || this.storage.getItem(keyName);
  }

  removeKey(provider: SupportedProvider): void {
    const keyName = this.getStorageKey(provider);
    this.storage.removeItem(keyName);
    this.memoryStorage.delete(keyName);
  }

  private getStorageKey(provider: SupportedProvider): string {
    return `byok-${provider}-key`;
  }

  // Fallback memory-only storage (used in SSR or tests)
  private createMemoryStorage(): Storage {
    return {
      getItem: (key: string) => this.memoryStorage.get(key) || null,
      setItem: (key: string, value: string) =>
        this.memoryStorage.set(key, value),
      removeItem: (key: string) => this.memoryStorage.delete(key),
      clear: () => this.memoryStorage.clear(),
      key: (index: number) =>
        Array.from(this.memoryStorage.keys())[index] || null,
      length: 0,
    };
  }
}
