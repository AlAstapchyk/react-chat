import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MessagesView from "../components/MessagesView";

const ChatApp = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser === null) navigate("/login");
  }, [currentUser]);

  if (currentUser)
    return (
      <div className="flex h-full flex-col font-normal">
        <Header />
        <MessagesView className="flex-grow" />
        <Footer />
      </div>
    );
};

export default ChatApp;
