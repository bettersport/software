"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "./types";

interface UserContextType {
  /** The authenticated user, or null when not logged in. */
  activeUser: User | null;
  /** False until /api/auth/me has resolved. */
  loaded: boolean;
  /** True for seeded demo accounts. */
  isDemo: boolean;
  /** Re-fetch the current user from the server. */
  refresh: () => Promise<void>;
  /** End the session server-side and clear local state. */
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  activeUser: null,
  loaded: false,
  isDemo: false,
  refresh: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setActiveUser(data.user ?? null);
    } catch {
      setActiveUser(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setActiveUser(null);
  }, []);

  const isDemo = !!activeUser?.demo;

  return (
    <UserContext.Provider value={{ activeUser, loaded, isDemo, refresh, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
