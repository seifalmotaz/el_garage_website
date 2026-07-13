"use client";

/**
 * Authentication context for the El Garage web app.
 *
 * On mount, the provider bootstraps the session by:
 *   1. Reading the stored token pair from `localStorage.elgarage_auth`.
 *   2. If absent → user stays `null`, `isLoading` flips to `false`.
 *   3. If present → calling `/auth/me`. The typed `fetcher` will attempt
 *      a single refresh + retry on `401`; if that also fails, the stored
 *      tokens are cleared and we end up in the logged-out state.
 *
 * After bootstrap, `login()` and `logout()` are the only mutators of the
 * stored token pair and the in-memory `user` state. `register`,
 * `verifyOtp`, `forgotPassword`, `resetPassword`, and `resendOtp` are
 * pass-through helpers — they do not persist tokens or change `user`.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/lib/api/auth";
import {
  clearStoredAuth,
  readStoredAuth,
  writeStoredAuth,
} from "@/lib/api/client";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  User,
  VerifyOtpRequest,
} from "@/lib/api/types";

type AuthContextValue = {
  /** The authenticated user, or `null` if logged out / not yet bootstrapped. */
  user: User | null;
  /**
   * `true` until the initial `/auth/me` check (or localStorage probe)
   * finishes. UI should show a skeleton during this window.
   */
  isLoading: boolean;
  /** Convenience flag: `true` when `user !== null`. */
  isAuthenticated: boolean;
  /**
   * Exchange credentials for tokens, persist them, and populate `user`
   * via `me()`.
   */
  login: (
    input: LoginRequest,
  ) => Promise<{ success: true } | { success: false; error: string }>;
  /** Create a new account. Does NOT log the user in — `verifyOtp` is next. */
  register: (
    input: RegisterRequest,
  ) => Promise<{ success: true } | { success: false; error: string }>;
  /**
   * Verify the OTP sent after registration. On success, the backend does
   * NOT issue tokens — the user still needs to call `login` afterwards.
   * The returned `user` is useful for UI confirmation ("phone verified").
   */
  verifyOtp: (
    input: VerifyOtpRequest,
  ) => Promise<
    | { success: true; user: User }
    | { success: false; error: string }
  >;
  /**
   * Server-side logout (best-effort), then clear local tokens and reset
   * `user` to `null`. Always succeeds locally even if the server call
   * rejects.
   */
  logout: () => Promise<void>;
  /** Request a password-reset OTP. */
  forgotPassword: (
    input: ForgotPasswordRequest,
  ) => Promise<
    | { success: true; message: string; expiresInSeconds: number }
    | { success: false; error: string }
  >;
  /** Set a new password using the OTP received via `forgotPassword`. */
  resetPassword: (
    input: ResetPasswordRequest,
  ) => Promise<{ success: true } | { success: false; error: string }>;
  /** Resend the registration OTP. */
  resendOtp: (
    input: ResendOtpRequest,
  ) => Promise<
    | { success: true; message: string; expiresInSeconds: number }
    | { success: false; error: string }
  >;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Extract a human-readable error message from an unknown thrown value.
 * Backend `ApiError`s carry the server's `message`; anything else gets
 * a generic message so we never leak raw stack traces to the UI.
 */
function describeError(err: unknown, fallback = "Request failed"): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** Type guard for the OTP-style success payloads returned by the backend. */
function isOtpPayload(value: unknown): value is { message: string; expiresInSeconds: number } {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.message === "string" && typeof v.expiresInSeconds === "number";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Guard against state updates after unmount.
  const isMountedRef = useRef<boolean>(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Bootstrap: on mount, hydrate the user from the stored token pair.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const stored = readStoredAuth();
      if (!stored) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const profile = await authApi.me();
        if (!cancelled) setUser(profile);
      } catch {
        // The fetcher already cleared the stored tokens on a failed
        // refresh; we just need to make sure we land in the logged-out
        // state regardless of the error type.
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  // ===== Mutators ===== //

  const login = useCallback(
    async (input: LoginRequest) => {
      try {
        const tokens = await authApi.login(input);
        writeStoredAuth({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        const profile = await authApi.me();
        if (isMountedRef.current) setUser(profile);
        return { success: true as const };
      } catch (err) {
        return {
          success: false as const,
          error: describeError(err, "تعذر تسجيل الدخول"),
        };
      }
    },
    [],
  );

  const register = useCallback(async (input: RegisterRequest) => {
    try {
      await authApi.register(input);
      return { success: true as const };
    } catch (err) {
      return {
        success: false as const,
        error: describeError(err, "تعذر إنشاء الحساب"),
      };
    }
  }, []);

  const verifyOtp = useCallback(async (input: VerifyOtpRequest) => {
    try {
      const result = await authApi.verifyOtp(input);
      return { success: true as const, user: result.user };
    } catch (err) {
      return {
        success: false as const,
        error: describeError(err, "تعذر التحقق من الكود"),
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const stored = readStoredAuth();
    if (stored?.refreshToken) {
      try {
        await authApi.logout({ refreshToken: stored.refreshToken });
      } catch {
        // Best-effort — never block the local sign-out on a server error.
      }
    }
    clearStoredAuth();
    if (isMountedRef.current) setUser(null);
  }, []);

  const forgotPassword = useCallback(async (input: ForgotPasswordRequest) => {
    try {
      const result = await authApi.forgotPassword(input);
      if (!isOtpPayload(result)) {
        return {
          success: false as const,
          error: "Invalid response shape",
        };
      }
      return {
        success: true as const,
        message: result.message,
        expiresInSeconds: result.expiresInSeconds,
      };
    } catch (err) {
      return {
        success: false as const,
        error: describeError(err, "تعذر إرسال كود إعادة التعيين"),
      };
    }
  }, []);

  const resetPassword = useCallback(async (input: ResetPasswordRequest) => {
    try {
      await authApi.resetPassword(input);
      return { success: true as const };
    } catch (err) {
      return {
        success: false as const,
        error: describeError(err, "تعذر إعادة تعيين كلمة المرور"),
      };
    }
  }, []);

  const resendOtp = useCallback(async (input: ResendOtpRequest) => {
    try {
      const result = await authApi.resendOtp(input);
      if (!isOtpPayload(result)) {
        return {
          success: false as const,
          error: "Invalid response shape",
        };
      }
      return {
        success: true as const,
        message: result.message,
        expiresInSeconds: result.expiresInSeconds,
      };
    } catch (err) {
      return {
        success: false as const,
        error: describeError(err, "تعذر إعادة إرسال كود التحقق"),
      };
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      verifyOtp,
      logout,
      forgotPassword,
      resetPassword,
      resendOtp,
    }),
    [
      user,
      isLoading,
      login,
      register,
      verifyOtp,
      logout,
      forgotPassword,
      resetPassword,
      resendOtp,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume the auth context. Throws if used outside of an
 * `<AuthProvider>` so we never silently render an unauthenticated UI
 * when the provider is missing.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}