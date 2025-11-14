// index.d.ts or global.d.ts

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

export {};