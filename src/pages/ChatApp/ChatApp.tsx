import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Menu from "./Menu/Menu";
import Chat from "./Chat/Chat";

const ChatApp = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isMenu] = useState<boolean>(true);

  useEffect(() => {
    if (currentUser === null) navigate("/login");
  }, [currentUser]);

  if (currentUser)
    return (
      <div className="flex h-[100dvh] max-w-[100vw] flex-col font-normal">
        {isMenu ? <Menu /> : <Chat />}
      </div>
    );
};

export default ChatApp;
