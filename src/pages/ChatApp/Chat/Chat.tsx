import Header from "./components/Header";
import MessagesView from "./components/MessagesView";
import Footer from "./components/Footer";

const ChatApp = () => {
  return (
    <div className="flex h-[100dvh] flex-col font-normal">
      <Header />
      <MessagesView />
      <Footer />
    </div>
  );
};

export default ChatApp;
