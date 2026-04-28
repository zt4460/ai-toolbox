const DEFAULT_MIN_INTERVAL_MS = 400;

export class SimpleRateLimiter {
  private readonly minIntervalMs: number;
  private lastRunAt = 0;
  private queue = Promise.resolve();

  constructor(minIntervalMs = DEFAULT_MIN_INTERVAL_MS) {
    this.minIntervalMs = minIntervalMs;
  }

  schedule<T>(task: () => Promise<T>) {
    const run = async () => {
      const now = Date.now();
      const waitMs = Math.max(0, this.minIntervalMs - (now - this.lastRunAt));
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }

      this.lastRunAt = Date.now();
      return task();
    };

    const nextTask = this.queue.then(run, run);
    this.queue = nextTask.then(() => undefined, () => undefined);
    return nextTask;
  }
}
