import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { SearchSvg } from "../../../../svgs";
import { AuthContext } from "../../../../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "../../../../firebase";
import OutsideClickHandler from "react-outside-click-handler";
import { signOut } from "firebase/auth";

interface HeaderProps {
  searchValueState: [string, React.Dispatch<React.SetStateAction<string>>];
  handleSearch: (searchValue: string) => void;
}
const Header = ({ handleSearch, searchValueState }: HeaderProps) => {
  const { currentUser } = useContext(AuthContext);
  const [searchValue, setSearchValue] = searchValueState;
  const [isDropDownProfileMenuOpen, setIsDropDownProfileMenuOpen] =
    useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const searchInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const Search = () => {
    handleSearch(searchValue);
  };
  const searchOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      Search();
    }
  };

  const readUserData = async (uid: string) => {
    try {
      // Create a query to match the desired document:
      const userRef = collection(firestore, "users");
      const q = query(userRef, where("uid", "==", uid));

      // Get the document snapshot:
      const querySnapshot = await getDocs(q);

      // Check if the document exists:
      if (querySnapshot.size === 0) {
        return; // Indicate that no such user exists
      }

      // Process the retrieved document data:
      // const userData = querySnapshot.docs[0].data();

      // Handle potential errors gracefully:
    } catch {}
  };

  const LogOut = () => {
    signOut(auth);
  };

  const DropDownProfileMenu = () => {
    if (isDropDownProfileMenuOpen)
      return (
        <OutsideClickHandler
          onOutsideClick={(e: MouseEvent) =>
            !profileButtonRef.current?.contains(e.target as Node) &&
            isDropDownProfileMenuOpen &&
            setIsDropDownProfileMenuOpen(false)
          }
        >
          <div className=" z-40 flex gap-1 absolute -bottom-[2.5rem] p-1 rounded-md bg-white shadow-md text-gray-600 font-medium">
            <button
              className="px-1 rounded-md hover:bg-gray-200"
              onClick={LogOut}
            >
              Log out
            </button>
          </div>
        </OutsideClickHandler>
      );
  };

  useEffect(() => {
    if (currentUser?.uid) readUserData(currentUser?.uid);
  }, [currentUser]);

  return (
    <div className="relative flex mt-2 mx-1 p-2 rounded-2xl h-12 bg-white max-w-full shadow-md">
      <DropDownProfileMenu />


      <button
        className="transition-transform duration-100 hover:scale-110 active:scale-95"
        onClick={() => { handleSearch(""); setIsDropDownProfileMenuOpen(!isDropDownProfileMenuOpen) }}
        ref={profileButtonRef}
      >
        <img
          className="rounded-full shadow mr-2 w-8 h-8 max-w-full overflow-hidden whitespace-nowrap"
          src={currentUser?.photoURL ? currentUser.photoURL : ""}
          alt="Avatar"
          width={32}
          height={32}
        />
      </button>

      <input
        type="text"
        value={searchValue}
        onChange={searchInputOnChange}
        onKeyDown={searchOnKeyDown}
        className={`mr-2 ml-2 px-2 my-auto text-gray-500 text-lg font-medium truncate flex-grow w-0 border-b-2 rounded-lg`}
        placeholder="Search"
      />
      <button>
        <SearchSvg
          className="stroke-gray-500 w-8 h-8 transition-transform duration-100 hover:scale-110 active:scale-95"
          onClick={Search}
        />
      </button>
    </div>
  );
};

export default Header;
