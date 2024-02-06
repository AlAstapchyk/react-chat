import Header from "./components/Header";
import MessagesView from "./components/MessagesView";
import Footer from "./components/Footer";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../firebase";
import { IMessage } from "./components/Message";

const ChatApp = () => {
  const [messages, setMessages] = useState<IMessage[]>();
  const { currentChat } = useContext(ChatContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentChat) return;

    const unSub = onSnapshot(
      doc(firestore, "chats", currentChat.chatId),
      (doc) => {
        setIsLoading(true);
        console.log("chat Id: ", currentChat.chatId);
        console.log("Messages: ", doc.data());
        doc.exists() && setMessages(doc.data().messages);
        setIsLoading(false);
      },
    );

    return () => {
      unSub();
    };
  }, [currentChat?.chatId]);

  return (
    <div className="flex h-full flex-col font-normal">
      <Header />
      {isLoading ? (
        <div
          className="my-4 m-auto text-secondary inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        <MessagesView messages={messages} />
      )}

      <Footer />
    </div>
  );
};

export default ChatApp;
