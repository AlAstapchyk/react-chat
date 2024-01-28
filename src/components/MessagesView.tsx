import Message, { IMessage } from "./Message";

const MessagesView: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const messages: IMessage[] = [
    {
      messageId: 1,
      type: "text",
      senderId: "user1",
      text: "Hello there!",
      sentDate: new Date(),
    },
    {
      messageId: 2,
      type: "text",
      senderId: "user2",
      text: "How are you today?",
      sentDate: new Date(),
    },
    {
      messageId: 3,
      type: "text",
      senderId: "user3",
      text: "I'm doing well, thanks for asking.",
      sentDate: new Date(),
    },
    {
      messageId: 4,
      type: "text",
      senderId: "user4",
      text: "What are you up to?",
      sentDate: new Date(),
    },
    {
      messageId: 5,
      type: "text",
      senderId: "user1",
      text: "Just catching up on some emails.",
      sentDate: new Date(),
    },
    {
      messageId: 6,
      type: "text",
      senderId: "user2",
      text: "Sounds like a productive day.",
      sentDate: new Date(),
    },
    {
      messageId: 7,
      type: "text",
      senderId: "user3",
      text: "Yeah, I'm trying to get ahead of the curve.",
      sentDate: new Date(),
    },
  ];

  return (
    <div className={"pb-2 flex flex-col-reverse w-full h-full mask-gradient flex-grow " + props.className}>
      <div className="overflow-y-auto">
        {
          messages.map((message) => {
            return <Message message={message} key={message.messageId} />
          })
        }
      </div>
    </div>
  );
};

export default MessagesView;
