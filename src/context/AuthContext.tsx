import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextValue {
  currentUser: User | null | undefined;
}
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: undefined,
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined,
  );

  useEffect(() => {
    console.log(currentUser);
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
