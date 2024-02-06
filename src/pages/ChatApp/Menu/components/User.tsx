import { format } from "date-fns";
import { IChatPartner } from "../../../../context/ChatContext";
import { MessageSvg } from "../../../../svgs";
import { IMessage } from "../../Chat/components/Message";
import { getFormattedDate } from "../../../../helpers";

interface PartnerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  partner: IChatPartner;
  lastMessage?: IMessage;
}

const Partner = ({ partner, lastMessage, ...props }: PartnerProps) => {
  let lastMessageSentDate: Date | undefined;
  if (lastMessage?.sentDate)
    lastMessageSentDate = lastMessage.sentDate?.toDate();

  return (
    <button
      className="group flex max-sm:last:mb-1 rounded-2xl bg-white p-2 shadow-md hover:cursor-pointer"
      {...props}
    >
      <img
        src={partner.photoURL}
        className="w-12 h-12 rounded-2xl shadow-md transition-transform duration-100 group-hover:scale-105 group-active:scale-95"
        alt="Avatar"
      />
      <div className="flex flex-col flex-grow h-full w-0 ml-3 mr-2">
        <p className="truncate text-lg font-medium my-auto text-left text-gray-500">
          {partner.displayName}
        </p>
        {lastMessage?.type === "text" && (
          <p className="truncate text-sm font-medium my-auto text-left text-gray-500">
            {lastMessage.text}
          </p>
        )}
      </div>

      {lastMessageSentDate ? (
        <div className="flex flex-col text-gray-400  text-right my-auto">
          <span className="text-md">
            {getFormattedDate(lastMessageSentDate)}
          </span>
          <span className="text-xs">
            {format(lastMessageSentDate, "hh:mm a")}
          </span>
        </div>
      ) : (
        <div className="transition-transform duration-100 group-hover:scale-110 group-active:scale-95">
          <MessageSvg className="w-[3rem] h-[3rem] p-1 my-auto stroke-gray-300" />
        </div>
      )}
    </button>
  );
};

export default Partner;
