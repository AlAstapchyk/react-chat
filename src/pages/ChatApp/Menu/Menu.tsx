import Header from "./components/Header";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../../firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Partner from "./components/User";
import { ChatContext, IChatPartner } from "../../../context/ChatContext";

const Menu = () => {
  const { currentUser } = useContext(AuthContext);
  const { setPartner } = useContext(ChatContext);
  const [currentUserChats, setCurrentUserChats] = useState<DocumentData>();
  const [searchPartners, setSearchPartners] = useState<Array<any>>();
  const searchValueState = useState<string>("");
  const [isLoadingChatsCompleted, setIsLoadingChatsCompleted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchValue: string) => {
    setSearchPartners([]);
    if (searchValue.length === 0 || !currentUser) return;
    setIsSearching(true);

    const q = query(
      collection(firestore, "users"),
      where("uid", "!=", currentUser.uid),
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        console.log("No user is founded with ID:", searchValue);
        return;
      }

      const partnersData = querySnapshot.docs
        .map((doc: any) => doc.data())
        .filter((partner) =>
          partner.displayName.toLowerCase().includes(searchValue.toLowerCase()),
        );
      console.log("Retrieved founded user data:", partnersData);

      setSearchPartners(partnersData);
    } catch (err) {
      console.log("Error while trying find someone");
    }
    setIsSearching(false);
  };

  const handleSelect = async (partner: any) => {
    if (!currentUser || !partner) return;

    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > partner.uid
        ? `${currentUser.uid}_${partner.uid}`
        : `${partner.uid}_${currentUser.uid}`;
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));

      if (!res.exists()) {
        //create user chats
        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: partner.uid,
            displayName: partner.displayName,
            photoURL: partner.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "userChats", partner.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        //create a chat in chats collection
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });
      }

      setPartner && setPartner(partner as IChatPartner);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const getChats = () => {
      const unsub = onSnapshot(
        doc(firestore, "userChats", currentUser.uid),
        (doc) => {
          setCurrentUserChats(doc.data());
          setIsLoadingChatsCompleted(true);
        },
        (e) => {
          console.log(e);
        },
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser?.uid]);

  console.log(currentUserChats);

  return (
    <div className="flex h-full flex-col font-normal">
      <Header handleSearch={handleSearch} searchValueState={searchValueState} />
      {!isSearching && !searchPartners?.length && (
        <h1 className="font-medium text-xl text-white mt-2 ml-3">My chats</h1>
      )}
      {!isSearching && isLoadingChatsCompleted && (
        <div className="flex-col mt-4 ml-1 white-scrollbar-thumb overflow-y-scroll pr-1 gap-2 grid grid-cols-2 max-sm:grid-cols-1">
          {searchPartners?.length ? (
            searchPartners.map((partner) => (
              <Partner
                partner={partner}
                onClick={() => handleSelect(partner)}
                key={partner.uid}
              />
            ))
          ) : currentUserChats && Object.entries(currentUserChats)?.length ? (
            Object.entries(currentUserChats)
              .sort((a, b) => {
                if (
                  a[1]?.lastMessage === undefined &&
                  b[1]?.lastMessage === undefined
                )
                  return 0;
                if (a[1]?.lastMessage === undefined) return 1;
                if (b[1]?.lastMessage === undefined) return -1;

                return b[1].date - a[1].date;
              })
              .map((chat: any) => (
                <Partner
                  partner={chat[1].userInfo}
                  lastMessage={chat[1]?.lastMessage}
                  key={chat[0]}
                  onClick={() => handleSelect(chat[1].userInfo)}
                />
              ))
          ) : (
            <div className="text-lg">
              You don't have any chats. Let's search!
            </div>
          )}
        </div>
      )}
      {!isLoadingChatsCompleted && (
        <span className="mx-auto mt-4 text-xl">Loading chats...</span>
      )}
      {isSearching && (
        <span className="mx-auto mt-4 text-xl">Searching chats...</span>
      )}
    </div>
  );
};

export default Menu;
