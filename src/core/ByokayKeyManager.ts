// src/core/ByokayKey.ts
export type SupportedProvider =
  | "openai"
  | "claude"
  | "gemini"
  | "grok"
  | "deepseek"
  | "llama";

// Renamed interface
interface ByokayKeyOptions {
  storage?: Storage;
}

export class ByokayKey {
  private storage: Storage;
  private memoryStorage: Map<string, string>;

  constructor(options: ByokayKeyOptions = {}) {
    // Use renamed options interface
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

  getKeys<T extends SupportedProvider>(
    ...providers: T[]
  ): { [P in T]: string | null } {
    const result = {} as { [P in T]: string | null };
    for (const provider of providers) {
      result[provider] = this.getKey(provider);
    }
    return result;
  }

  removeKey(provider: SupportedProvider): void {
    const keyName = this.getStorageKey(provider);
    this.storage.removeItem(keyName);
    this.memoryStorage.delete(keyName);
  }

  private getStorageKey(provider: SupportedProvider): string {
    return `byokay-${provider}-key`;
  }

  private createMemoryStorage(): Storage {
    const localMemory = new Map<string, string>();
    return {
      getItem: (key: string) => localMemory.get(key) || null,
      setItem: (key: string, value: string) => localMemory.set(key, value),
      removeItem: (key: string) => localMemory.delete(key),
      clear: () => localMemory.clear(),
      key: (index: number) => Array.from(localMemory.keys())[index] || null,
      length: localMemory.size,
    };
  }
}
