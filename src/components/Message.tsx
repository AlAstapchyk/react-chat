import { useRef } from "react";
// import { AuthContext } from "../context/AuthContext";

export interface IMessage {
  messageId: number;
  type: "emoji" | "text" | "image" | "document";
  senderId: string;
  text?: string;
  url?: string;
  sentDate: Date;
}

const Message = ({ message }: { message: IMessage }) => {
  // const { currentUser } = useContext(AuthContext);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`flex flex-col rounded-2xl rounded-${"es"}-none min-w-[264px] w-fit-content max-w-[75%] bg-gray-500 shadow-md`}
    >
      <div className="flex">
        <p className="flex">{message.text}</p>
        {/* {message.url && <img src={message.url} alt="" />} */}
        <span>Today</span>
      </div>
    </div>
  );
};

export default Message;
