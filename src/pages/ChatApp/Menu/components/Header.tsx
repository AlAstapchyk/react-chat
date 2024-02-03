import { ChangeEvent, useContext, useEffect, useState } from "react";
import { SearchSvg } from "../../../../svgs";
import { AuthContext } from "../../../../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../../firebase";

interface HeaderProps {
  handleSearch: (searchValue: string) => void;
}
const Header = ({ handleSearch }: HeaderProps) => {
  const { currentUser } = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState<any>();
  const [searchValue, setSearchValue] = useState<string>("");

  const searchInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const Search = () => {
    console.log("Search...");
    handleSearch(searchValue);
  };
  const searchOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      Search();
    }
  };

  const readUserData = async (userId: string) => {
    try {
      // Create a query to match the desired document:
      const userRef = collection(firestore, "users");
      const q = query(userRef, where("userId", "==", userId));

      // Get the document snapshot:
      const querySnapshot = await getDocs(q);

      // Check if the document exists:
      if (querySnapshot.size === 0) {
        console.log("No user found with ID:", userId);
        return; // Indicate that no such user exists
      }

      // Process the retrieved document data:
      const userData = querySnapshot.docs[0].data();
      console.log("Retrieved user data:", userData); // Or use the data as needed

      setCurrentUserData(userData);
      // Handle potential errors gracefully:
    } catch (error) {
      console.error("Error reading user data:", error);
      // Provide an appropriate error message or take corrective actions
    }
  };

  useEffect(() => {
    if (currentUser?.uid) readUserData(currentUser?.uid);
  }, [currentUser]);

  console.log(currentUser?.photoURL);

  return (
    <div className="flex mt-2 mx-1 p-2 rounded-2xl h-12 bg-white max-w-full shadow-md">
      <button className="transition-transform duration-100 hover:scale-110 active:scale-95">
        <img
          className="rounded-full shadow mr-2 w-8 h-8 max-w-full overflow-hidden whitespace-nowrap"
          src={
            currentUser?.photoURL
              ? currentUser.photoURL
              : currentUserData?.imageUrl
                ? currentUserData.imageUrl
                : ""
          }
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
