import { sleep } from './common';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  backoffFactor?: number;
  onError?: (error: any, attempt: number) => void;
}

export async function retryableFetch<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = MAX_RETRIES,
    initialDelay = INITIAL_RETRY_DELAY,
    backoffFactor = 2,
    onError
  } = options;

  let attempt = 0;
  let lastError: any;

  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;

      if (onError) {
        onError(error, attempt);
      }

      if (attempt === maxRetries) {
        break;
      }

      const delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}