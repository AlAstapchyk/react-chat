import { useRef, useState } from "react";
import { Send, Smile } from "../svgs";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import OutsideClickHandler from "react-outside-click-handler";

const HIDDEN = "hidden";

const Footer: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const smileButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);

  const sendMessage = () => {
    console.log("Sent " + inputValue);
    setInputValue("");
  };
  const inputOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const inputOnChange = () => {
    if (inputRef.current) setInputValue(inputRef.current.value);
  };
  const EmojiPickerOnEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      <div
        className="relative flex mb-2 p-2 rounded-2xl h-12 bg-white max-w-full shadow-md"
        {...props}
      >
        <div
          className={
            "absolute z-50 bottom-[54px] rounded-lg " +
            (isEmojiPickerOpen ? "" : HIDDEN)
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
          <Smile className="stroke-gray-500 w-8 h-8" />
        </button>
        <input
          className={`mr-2 ml-2 px-2 my-auto text-gray-500 text-lg font-medium truncate flex-grow w-0 border-b-2 rounded-lg`}
          placeholder="Write a message..."
          value={inputValue}
          onChange={inputOnChange}
          onKeyDown={inputOnKeyDown}
          ref={inputRef}
        />
        <button className="ml-auto" onClick={sendMessage}>
          <Send className="stroke-gray-500 w-8 h-8" />
        </button>
      </div>
    </>
  );
};

export default Footer;
