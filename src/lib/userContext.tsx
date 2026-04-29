"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, ESGProject, Club } from "./types";
import { mockUsers, mockESGProjects, mockClubs } from "./data";
import { computeClubScore } from "./scoring";

interface UserContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
  projects: ESGProject[];
  setProjects: Dispatch<SetStateAction<ESGProject[]>>;
  /** Live ESG scores for the logged-in user's club, updated as projects change. */
  liveClub: Club | null;
}

const UserContext = createContext<UserContextType>({
  activeUser: mockUsers[0],
  setActiveUser: () => {},
  projects: mockESGProjects,
  setProjects: () => {},
  liveClub: null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUserState] = useState<User>(mockUsers[0]);
  const [projects, setProjects] = useState<ESGProject[]>(mockESGProjects);

  useEffect(() => {
    // First try to load full user data (includes profile edits)
    const storedData = localStorage.getItem("bettersport_user_data");
    if (storedData) {
      try {
        setActiveUserState(JSON.parse(storedData));
        return;
      } catch {}
    }
    // Fallback: load by ID from mockUsers
    const stored = localStorage.getItem("bettersport_user");
    if (stored) {
      const found = mockUsers.find((u) => u.id === stored);
      if (found) setActiveUserState(found);
    }
  }, []);

  const setActiveUser = (user: User) => {
    setActiveUserState(user);
    localStorage.setItem("bettersport_user", user.id);
    localStorage.setItem("bettersport_user_data", JSON.stringify(user));
  };

  /** Recompute club ESG scores whenever projects change */
  const liveClub = useMemo(() => {
    if (!activeUser.clubId) return null;
    const base = mockClubs.find((c) => c.id === activeUser.clubId);
    if (!base) return null;
    return computeClubScore(base, projects);
  }, [activeUser.clubId, projects]);

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser, projects, setProjects, liveClub }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
