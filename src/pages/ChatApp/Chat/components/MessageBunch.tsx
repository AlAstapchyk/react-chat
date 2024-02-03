import { isSameMinute } from "date-fns";
import Message, { IMessage } from "./Message";
// import { useContext } from "react";
// import { AuthContext } from "../../../context/AuthContext";

interface MessageBunchProps {
  messages: IMessage[];
}

const MessageBunch = ({ messages }: MessageBunchProps) => {
  // const { currentUser } = useContext(AuthContext);

  // dont pass sent date if next message has the same
  const removeUnnecessaryDates = (messages: IMessage[]) => {
    return messages.map((mes, i) => {
      if (
        messages[i + 1] !== undefined &&
        isSameMinute(mes.sentDate as Date, messages[i + 1].sentDate as Date)
      )
        return { ...mes, sentDate: undefined };
      return mes;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {removeUnnecessaryDates(messages).map((message) => (
        <Message
          message={message}
          isCurrentUser={message.senderId === "user1"}
          key={message.messageId}
        />
      ))}
    </div>
  );
};

export default MessageBunch;
