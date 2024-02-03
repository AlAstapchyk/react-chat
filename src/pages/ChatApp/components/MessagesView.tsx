import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { IMessage } from "./Message";
import MessageBunch from "./MessageBunch";
import { AuthContext } from "../../../context/AuthContext";
import { isSameDay } from "date-fns/isSameDay";
import { differenceInDays, sub, subDays } from "date-fns";
import DayLabel from "./DayLabel";
import React from "react";

const messages: IMessage[] = [
  {
    messageId: "1",
    type: "text",
    senderId: "user1",
    text: "Hello there!",
    sentDate: subDays(new Date(), 2),
  },
  {
    messageId: "2",
    type: "text",
    senderId: "user2",
    text: "How are you today?",
    sentDate: subDays(new Date(), 2),
  },
  {
    messageId: "3",
    type: "text",
    senderId: "user1",
    text: "I'm doing well, thanks for asking.",
    sentDate: new Date(),
  },
  {
    messageId: "4",
    type: "text",
    senderId: "user1",
    text: "What are you up to?",
    sentDate: sub(new Date(), { minutes: 1 }),
    // sentDate: new Date(),
  },
  {
    messageId: "5",
    type: "text",
    senderId: "user1",
    text: "Just catching up on some emails.",
    sentDate: sub(new Date(), { years: 1 }),
  },
  {
    messageId: "6",
    type: "text",
    senderId: "user2",
    text: "Sounds like a productive day.",
    sentDate: new Date(),
  },
  {
    messageId: "8",
    type: "text",
    senderId: "user2",
    text: "Yeah, I'm trying to get ahead of the curve.",
    sentDate: new Date(),
  },
  {
    messageId: "7",
    type: "text",
    senderId: "user2",
    text: "Yeah, I'm trying to get ahead of the curve 2.",
    sentDate: new Date(),
  },
];

const MessagesView: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const [messageBunchs, setMessageBunchs] = useState<Array<IMessage[]>>([]);
  const { currentUser } = useContext(AuthContext);

  const distributeMessagesToBunches = () => {
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
          lastCurrentBunchMessage.sentDate,
          messages[i].sentDate as Date,
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
    messages.sort(
      (a, b) => (a.sentDate?.getTime() ?? 0) - (b.sentDate?.getTime() ?? 0),
    );

    distributeMessagesToBunches();
  }, [currentUser, messages]);

  return (
    <div
      className={
        "pb-2 ml-1 flex flex-col-reverse max-w-full mask-gradient flex-grow overflow-y-scroll white-scrollbar-thumb " +
        props.className
      }
    >
      <div className="flex flex-col gap-2 pt-4">
        {messages[0].sentDate && <DayLabel date={messages[0].sentDate} />}
        {messageBunchs.length !== 0 &&
          messageBunchs.map((messageBunch, i) => {
            if (
              messageBunch.at(-1)?.sentDate !== undefined &&
              messageBunchs[i + 1]?.at(-1)?.sentDate !== undefined &&
              differenceInDays(
                messageBunch.at(-1)?.sentDate as Date,
                messageBunchs[i + 1].at(-1)?.sentDate as Date,
              )
            )
              return (
                <React.Fragment key={i}>
                  <MessageBunch messages={messageBunch} />
                  <DayLabel
                    date={messageBunchs[i + 1].at(-1)?.sentDate as Date}
                  />
                </React.Fragment>
              );
            return <MessageBunch messages={messageBunch} key={i} />;
          })}
      </div>
    </div>
  );
};

export default MessagesView;
