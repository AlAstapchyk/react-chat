import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IMessage } from "./Message";
import MessageBunch from "./MessageBunch";
import { AuthContext } from "../../../../context/AuthContext";
import { isSameDay } from "date-fns/isSameDay";
import { differenceInDays } from "date-fns";
import DayLabel from "./DayLabel";
import React from "react";

interface MessagesViewProps extends React.HTMLProps<HTMLDivElement> {
  messages: IMessage[] | undefined;
}

const MessagesView = ({ messages, ...props }: MessagesViewProps) => {
  const [messageBunchs, setMessageBunchs] = useState<Array<IMessage[]>>([]);
  const { currentUser } = useContext(AuthContext);
  const ref = useRef<HTMLDivElement>(null);
  const endScrollRef = useRef<HTMLSpanElement>(null);

  const distributeMessagesToBunches = () => {
    if (!messages?.length) return;

    const newMessageBunchs: IMessage[][] = [];

    let currentMessageBunch: IMessage[] = [messages[0]];

    for (let i = 1; i < messages.length; i++) {
      const lastCurrentBunchMessage = currentMessageBunch?.at(-1);
      // checks if the same sender and same day
      if (
        lastCurrentBunchMessage?.senderId === messages[i].senderId &&
        lastCurrentBunchMessage.sentDate &&
        messages[i].sentDate !== undefined &&
        isSameDay(
          lastCurrentBunchMessage.sentDate.toDate(),
          messages[i].sentDate?.toDate() as Date,
        )
      )
        currentMessageBunch.push(messages[i]);
      else {
        newMessageBunchs?.push(currentMessageBunch);
        currentMessageBunch = [messages[i]];
      }
    }
    newMessageBunchs?.push(currentMessageBunch);
    setMessageBunchs(newMessageBunchs);
  };

  useLayoutEffect(() => {
    // sort messages by sentDate
    messages?.length &&
      messages.sort(
        (a, b) => (a.sentDate?.toMillis() ?? 0) - (b.sentDate?.toMillis() ?? 0),
      );

    distributeMessagesToBunches();

    setTimeout(() => endScrollRef.current?.scrollIntoView({ behavior: "smooth" }), 0)
  }, [currentUser, messages]);

  return (
    <div
      className={
        "ml-1 flex flex-col-reverse max-w-full mask-gradient flex-grow white-scrollbar-thumb overflow-y-scroll pr-1 white-scrollbar-thumb " +
        props.className
      }
      ref={ref}
    >
      {messages?.length ? (
        <div className="flex flex-col gap-2 pt-8">
          {messages[0].sentDate && (
            <DayLabel date={messages[0].sentDate.toDate()} />
          )}
          {messageBunchs.length !== 0 &&
            messageBunchs.map((messageBunch, i) => {
              if (
                messageBunch.at(-1)?.sentDate !== undefined &&
                messageBunchs[i + 1]?.at(-1)?.sentDate !== undefined &&
                differenceInDays(
                  messageBunch.at(-1)?.sentDate?.toDate() as Date,
                  messageBunchs[i + 1].at(-1)?.sentDate?.toDate() as Date,
                )
              )
                return (
                  <React.Fragment key={i}>
                    <MessageBunch messages={messageBunch} />
                    <DayLabel
                      date={
                        messageBunchs[i + 1].at(-1)?.sentDate?.toDate() as Date
                      }
                    />
                  </React.Fragment>
                );
              return <MessageBunch messages={messageBunch} key={i} />;
            })}
          <span className="h-0" ref={endScrollRef}></span>
        </div>
      ) : (
        <div className="m-auto bg-white p-3 rounded-2xl shadow-lg">
          <p className="text-gray-500 font-medium text-lg text-center">
            Chat is empty. Let's write first message!
          </p>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
