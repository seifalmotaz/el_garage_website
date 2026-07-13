/**
 * Typed error class for API failures.
 *
 * Throwing an `ApiError` from the typed `fetcher` lets call sites distinguish
 * HTTP / API failures (status code, server message, optional field-level
 * validation errors) from network failures (e.g. fetch itself rejected).
 *
 * Network errors will still surface as the platform's native `TypeError`
 * thrown by `fetch`, so consumers can `try/catch` once and inspect
 * `err instanceof ApiError` to decide how to react.
 */
export class ApiError extends Error {
  /** HTTP status code that triggered the error (e.g. 400, 401, 500). */
  public readonly status: number;

  /**
   * Optional per-field validation errors returned by the backend
   * (e.g. `{ phone: ['Phone number must be in international format'] }`).
   */
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    // Pass `message` to the base Error so `err.message` works.
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    // Maintain a proper prototype chain when targeting older runtimes.
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Human-readable representation that includes both the status code and
   * the message — handy for logging and dev tools.
   */
  override toString(): string {
    const base = `${this.name}[${this.status}]: ${this.message}`;
    if (this.fieldErrors && Object.keys(this.fieldErrors).length > 0) {
      return `${base} | fieldErrors=${JSON.stringify(this.fieldErrors)}`;
    }
    return base;
  }
}