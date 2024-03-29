import { ReactNode, createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

export interface IChatPartner {
  uid: string;
  displayName: string;
  photoURL: string;
}
interface IChat {
  chatId: string;
  partner: IChatPartner;
}
interface ChatContextValue {
  currentChat: IChat | undefined;
  setPartner: ((partner: IChatPartner) => void) | undefined;
  undefyPartner: (() => void) | undefined;
}

export const ChatContext = createContext<ChatContextValue>({
  currentChat: undefined,
  setPartner: undefined,
  undefyPartner: undefined,
});

interface ChatContextProviderProps {
  children: ReactNode;
}
export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const { currentUser } = useContext(AuthContext);
  const [chat, setChat] = useState<IChat>();

  const setPartner = (partner: IChatPartner) => {
    if (!currentUser || !partner.uid) {
      return;
    }
    const newChat: IChat = {
      partner: partner,
      chatId:
        currentUser.uid > partner.uid
          ? `${currentUser.uid}_${partner.uid}`
          : `${partner.uid}_${currentUser.uid}`,
    };
    setChat(newChat);
  };
  const undefyPartner = () => {
    setChat(undefined);
  };

  return (
    <ChatContext.Provider
      value={{ currentChat: chat, setPartner, undefyPartner }}
    >
      {children}
    </ChatContext.Provider>
  );
};
