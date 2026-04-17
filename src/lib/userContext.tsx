"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "./types";
import { mockUsers } from "./data";

interface UserContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
  activeUser: mockUsers[0],
  setActiveUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUserState] = useState<User>(mockUsers[0]);

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

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
