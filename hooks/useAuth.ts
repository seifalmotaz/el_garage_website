/**
 * Re-export of `useAuth` for ergonomic imports.
 *
 * Components should prefer `import { useAuth } from '@/hooks/useAuth'`
 * over reaching into `@/contexts/AuthContext` directly. This keeps the
 * context module as an implementation detail that we can refactor
 * (split files, rename internals) without touching every consumer.
 */
export { useAuth } from "@/contexts/AuthContext";