import { createContext, useEffect, useState, ReactNode } from "react";
import { auth, firestore } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  const checkUserChats = async () => {
    if (currentUser?.uid) {
      const userChatsDoc = await getDoc(
        doc(firestore, "userChats", currentUser.uid),
      );
      if (!userChatsDoc.exists())
        await setDoc(doc(firestore, "userChats", currentUser.uid), {});
    }
  };

  useEffect(() => {
    checkUserChats();
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
