import { useContext, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../../firebase";
import { ChatContext } from "../../../../context/ChatContext";
import { AuthContext } from "../../../../context/AuthContext";
import { IMessage } from "./Message";
import { v4 as uuid } from "uuid";
import OutsideClickHandler from "react-outside-click-handler";
import { SendSvg, SmileSvg } from "../../../../svgs";

const Footer: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const smileButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const { currentChat } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const inputOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendTextMessage();
    }
  };
  const inputOnChange = () => {
    if (inputRef.current) setInputValue(inputRef.current.value);
  };
  const EmojiPickerOnEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  const sendTextMessage = async () => {
    if (!currentChat || !currentUser || !inputValue) return;

    const newTextMessage: IMessage = {
      messageId: uuid(),
      text: inputValue,
      senderId: currentUser.uid,
      sentDate: Timestamp.now(),
      type: "text",
    };
    setInputValue("");

    await updateDoc(doc(firestore, "chats", currentChat.chatId), {
      messages: arrayUnion(newTextMessage),
    });

    await updateDoc(doc(firestore, "userChats", currentUser.uid), {
      [currentChat.chatId + ".lastMessage"]: newTextMessage,
      [currentChat.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(firestore, "userChats", currentChat.partner.uid), {
      [currentChat.chatId + ".lastMessage"]: newTextMessage,
      [currentChat.chatId + ".date"]: serverTimestamp(),
    });
  };

  return (
    <>
      <div
        className="relative flex mt-auto mb-2 mx-1 p-2 rounded-2xl h-12 bg-white max-w-full shadow-md"
        {...props}
      >
        <div
          className={
            "absolute z-50 bottom-[54px] rounded-lg " +
            (isEmojiPickerOpen ? "" : "hidden")
          }
          ref={emojiPickerRef}
        >
          <OutsideClickHandler
            onOutsideClick={(e: MouseEvent) =>
              !smileButtonRef.current?.contains(e.target as Node) &&
              isEmojiPickerOpen &&
              setIsEmojiPickerOpen(false)
            }
          >
            <EmojiPicker
              onEmojiClick={EmojiPickerOnEmojiClick}
              emojiStyle={EmojiStyle.NATIVE}
              width={288}
            />
          </OutsideClickHandler>
        </div>
        <button
          ref={smileButtonRef}
          className="mr-auto relative"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        >
          <SmileSvg className="stroke-gray-500 w-8 h-8 transition-transform duration-100 hover:scale-110 active:scale-95" />
        </button>
        <input
          type="text"
          className={`mx-2 px-2 my-auto text-gray-500 text-lg font-medium truncate flex-grow w-0 border-b-2 rounded-lg`}
          placeholder="Write a message..."
          value={inputValue}
          onChange={inputOnChange}
          onKeyDown={inputOnKeyDown}
          ref={inputRef}
        />
        <button className="ml-auto" onClick={sendTextMessage}>
          <SendSvg className="stroke-gray-500 w-8 h-8 transition-transform duration-100 hover:scale-110 active:scale-95" />
        </button>
      </div>
    </>
  );
};

export default Footer;
