import { useRef } from "react";
import { format } from "date-fns";

const currentUserStyles: string =
  "ml-auto text-gray-700 bg-white border-gray-700 rounded-se-md rounded-ee-md rounded-ss-2xl rounded-es-2xl first:rounded-se-2xl last:rounded-ee-2xl";
const partnerUserStyles: string =
  "bg-gray-500 border-gray-700 rounded-ss-md rounded-es-md rounded-se-2xl rounded-ee-2xl first:rounded-ss-2xl last:rounded-es-2xl";

export interface IMessage {
  messageId: number;
  type: "emoji" | "text" | "image" | "document";
  senderId: string;
  text?: string;
  url?: string;
  sentDate?: Date;
}

const Message = ({
  message,
  isCurrentUser,
}: {
  message: IMessage;
  isCurrentUser: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  if (message.type === "text")
    return (
      <div
        ref={ref}
        className={`${isCurrentUser ? currentUserStyles : partnerUserStyles} flex flex-col py-2 px-3 w-[max-content] min-w-[20px] w-fit-content max-w-[75%] border-[1px] shadow-md box-border`}
      >
        <div className="flex flex-col">
          <p className="flex">{message.text}</p>
          {message.sentDate && (
            <span
              className={`${isCurrentUser ? "text-gray-500" : "text-gray-200"} text-xs ml-auto flex`}
            >
              {format(message.sentDate, "hh:mm a")}
            </span>
          )}
        </div>
      </div>
    );
};

export default Message;
