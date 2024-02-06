import { useContext } from "react";
import { HamburgerSvg } from "../../../../svgs";
import { ChatContext } from "../../../../context/ChatContext";

const Header = () => {
  const { currentChat, undefyPartner } = useContext(ChatContext);

  const removeParner = () => {
    undefyPartner && undefyPartner();
  };

  if (currentChat)
    return (
      <button
        className="flex mt-2 mx-1 p-2 rounded-2xl h-12 bg-white max-w-full shadow-md"
        onClick={removeParner}
      >
        <HamburgerSvg className="stroke-gray-500 w-8 h-8 ml-1 mr-auto" />
        <p
          className={`pr-4 pl-2 my-auto text-gray-500 text-lg font-medium truncate flex-grow w-0`}
        >
          {currentChat?.partner.displayName}
        </p>
        <img
          className="rounded-full shadow ml-auto w-8 h-8 max-w-full overflow-hidden whitespace-nowrap"
          src={currentChat.partner.photoURL}
          alt="Avatar"
          width={32}
          height={32}
        />
      </button>
    );
};

export default Header;
