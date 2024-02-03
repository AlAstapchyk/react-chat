import { MessageSvg } from "../../../../svgs";

const UserList = () => {
  const User = () => {
    return (
      <div className="flex rounded-2xl bg-white p-2 shadow-md">
        <img src="" className="w-12 h-12 rounded-2xl shadow-md" />
        <p className="truncate text-lg font-medium my-auto text-gray-500 ml-2 flex-grow w-0">
          Andrey Kakoyto
        </p>
        <div>
          <MessageSvg className="w-[3rem] h-[3rem] p-1 my-auto stroke-gray-300" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col mt-4 ml-1 overflow-y-scroll gap-2 grid grid-cols-2">
      <User />
    </div>
  );
};

export default UserList;
