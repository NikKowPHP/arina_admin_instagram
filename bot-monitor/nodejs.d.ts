declare namespace NodeJS {
  interface Timeout {
    readonly hasRef: boolean;
    ref(): void;
    unref(): void;
  }
}

declare module 'child_process' {
  export function exec(command: string, callback: (error: Error | null, stdout: string, stderr: string) => void): void;
}

declare module 'util' {
  export function promisify<T extends (...args: any[]) => any>(original: T): (...args: Parameters<T>) => Promise<ReturnType<T>>;
}