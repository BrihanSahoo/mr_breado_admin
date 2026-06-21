import { useSyncExternalStore } from "react";

/**
 * Admin auth token persistence.
 *
 * We persist to sessionStorage (not localStorage) so:
 *  - The session survives page reloads and Vite HMR within the tab
 *    (avoids the "logged in, then 401 cascade" UX bug).
 *  - Closing the tab clears the token (no long-lived XSS exfiltration window
 *    across browser restarts).
 *
 * Token is read on every request from this module via authStore.getToken().
 */

type AuthState = { token: string | null; tokenType: string | null };

const STORAGE_KEY = "mr_breado.admin.session";

const EMPTY: AuthState = Object.freeze({ token: null, tokenType: null }) as AuthState;

function readFromStorage(): AuthState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    if (typeof parsed?.token !== "string" || !parsed.token) return EMPTY;
    return {
      token: parsed.token,
      tokenType: typeof parsed.tokenType === "string" ? parsed.tokenType : "ADMIN",
    };
  } catch {
    return EMPTY;
  }
}

let snapshot: AuthState = readFromStorage();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist(state: AuthState) {
  if (typeof window === "undefined") return;
  try {
    if (state.token) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* storage may be disabled; in-memory snapshot still works for the session */
  }
}

// Cross-tab sign-out: if another tab clears the key, mirror it here.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.storageArea !== window.sessionStorage) return;
    if (e.key && e.key !== STORAGE_KEY) return;
    const next = readFromStorage();
    if (next.token !== snapshot.token) {
      snapshot = next;
      emit();
    }
  });
}

export const authStore = {
  getToken(): string | null {
    return snapshot.token;
  },
  getTokenType(): string | null {
    return snapshot.tokenType;
  },
  setToken(token: string, tokenType = "ADMIN") {
    snapshot = { token, tokenType };
    persist(snapshot);
    emit();
  },
  clear() {
    snapshot = EMPTY;
    persist(snapshot);
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot(): AuthState {
    return snapshot;
  },
  /**
   * Stable server snapshot. MUST return the same reference on every call to
   * avoid the React "getServerSnapshot should be cached" infinite loop.
   */
  getServerSnapshot(): AuthState {
    return EMPTY;
  },
};

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );
  return { ...state, isAuthenticated: !!state.token };
}
