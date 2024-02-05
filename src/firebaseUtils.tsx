import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export const getAuthErrorStr = (e: FirebaseError) => {
  const errorCode = e.code;
  console.log(errorCode);
  if (errorCode === "auth/email-already-in-use")
    return "Email is already in use";
  else if (errorCode === "auth/invalid-email") return "Invalid email";
  else if (errorCode === "auth/invalid-credential")
    return "Invalid email or password";
  else if (errorCode === "auth/weak-password") return "Weak password";
  else if (errorCode === "auth/user-not-found") return "User not found";
  else if (errorCode === "auth/wrong-password") return "Wrong password";
  else if (errorCode === "auth/timeout") return "Operation has timeout";
  else if (errorCode === "auth/too-many-requests") return "Too many requests";
  else if (errorCode === "auth/network-request-failed")
    return "Network request error";
  else return "Something went wrong";
};

export const writeUserData = async (
  uid: string,
  name: string,
  email: string,
  photoURL: string,
) => {
  const docRef = doc(firestore, "users", uid); // Specify the document ID using the uid
  await setDoc(docRef, {
    uid,
    displayName: name,
    email,
    photoURL,
  });
  console.log("Document written with ID: ", docRef.id);
};
