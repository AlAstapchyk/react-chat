import { isSameMinute } from "date-fns";
import Message, { IMessage } from "./Message";

interface MessageBunchProps {
  messages: IMessage[];
}
const MessageBunch = ({ messages }: MessageBunchProps) => {
  // dont pass sent date if next message has the same
  const removeUnnecessaryDates = (messages: IMessage[]) => {
    return messages.map((mes, i) => {
      if (
        messages[i + 1] !== undefined &&
        isSameMinute(
          mes.sentDate?.toDate() as Date,
          messages[i + 1].sentDate?.toDate() as Date,
        )
      )
        return { ...mes, sentDate: undefined };
      return mes;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {removeUnnecessaryDates(messages).map((message) => (
        <Message message={message} key={message.messageId} />
      ))}
    </div>
  );
};

export default MessageBunch;
