import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Menu from "./Menu/Menu";
import Chat from "./Chat/Chat";
import { ChatContext } from "../../context/ChatContext";

const ChatApp = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { currentChat } = useContext(ChatContext);

  useEffect(() => {
    if (currentUser === null) navigate("/login");
  }, [currentUser]);

  if (currentUser)
    return (
      <div className="flex h-[100dvh] max-w-[100vw] flex-col font-normal">
        {currentChat ? <Chat /> : <Menu />}
      </div>
    );
};

export default ChatApp;
