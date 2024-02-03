// import { useContext } from "react";
// import { AuthContext } from "../../../../context/AuthContext";
import React from "react";

const MessagesView: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  // const { currentUser } = useContext(AuthContext);

  return (
    <div
      className={
        "pb-2 ml-1 flex flex-col-reverse max-w-full mask-gradient flex-grow overflow-y-scroll white-scrollbar-thumb " +
        props.className
      }
    >
      <div className="flex flex-col gap-2 pt-4"></div>
    </div>
  );
};

export default MessagesView;
