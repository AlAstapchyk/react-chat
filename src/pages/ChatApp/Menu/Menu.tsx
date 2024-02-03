import Header from "./components/Header";
import UserList from "./components/UserList";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import { useState } from "react";

const Menu = () => {
  const [err, setErr] = useState<boolean>(false);
  const [partner, setPartner] = useState<DocumentData>();

  const handleSearch = async (searchValue: string) => {
    const q = query(
      collection(firestore, "users"),
      where("displayedName", "==", searchValue),
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setPartner(doc.data());
      });
      if (querySnapshot.size === 0) {
        console.log("No user found with ID:", searchValue);
        return; // Indicate that no such user exists
      }

      // Process the retrieved document data:
      const userData = querySnapshot.docs[0];
      console.log("Retrieved user data:", userData); // Or use the data as needed

      setPartner(userData);
    } catch (err) {
      setErr(true);
    }
  };

  console.log(err);
  console.log(partner);

  return (
    <div className="flex h-full flex-col font-normal">
      <Header handleSearch={handleSearch} />
      <UserList />
    </div>
  );
};

export default Menu;
