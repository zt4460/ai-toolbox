declare global {
  interface ReadableStream<R = unknown> {
    values(options?: { preventCancel?: boolean }): AsyncIterableIterator<R>;
    [Symbol.asyncIterator](): AsyncIterableIterator<R>;
  }
}

export {};
