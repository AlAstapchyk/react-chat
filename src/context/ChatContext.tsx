import {
    ReactNode,
    createContext,
    useContext,
    useState,
} from "react";
import { AuthContext } from "./AuthContext";

export interface IChatPartner {
    uid: string;
    displayName: string;
    photoURL: string
}
interface IChat {
    chatId: string,
    partner: IChatPartner,
}
interface ChatContextValue {
    currentChat: IChat | undefined;
    changePartner: ((partner: IChatPartner) => void) | undefined;
}

export const ChatContext = createContext<ChatContextValue>({ currentChat: undefined, changePartner: undefined });

interface ChatContextProviderProps {
    children: ReactNode;
}
export const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
    const { currentUser } = useContext(AuthContext);
    const [chat, setChat] = useState<IChat>();

    const changePartner = (partner: IChatPartner) => {
        console.log("Current user is: ", currentUser)
        console.log("Current partner is: ", partner)
        if (!currentUser || !partner.uid) {
            console.log("!currentUser || !partner?.uid - Error");
            return;
        }
        const newChat: IChat = {
            partner: partner,
            chatId:
                currentUser.uid > partner.uid
                    ? currentUser.uid + partner.uid
                    : partner.uid + currentUser.uid,
        };
        setChat(newChat);
    }

    return (
        <ChatContext.Provider value={{ currentChat: chat, changePartner }}>
            {children}
        </ChatContext.Provider>
    );
};