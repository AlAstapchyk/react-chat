import {
  GithubAuthProvider,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { useContext, useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { getAuthErrorStr, writeUserData } from "../firebaseUtils";
import { doc, getDoc } from "firebase/firestore";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Enter the email" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Enter the password" }),
});

type LoginFormFields = z.infer<typeof loginFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormFields>({ resolver: zodResolver(loginFormSchema) });

  useEffect(() => {
    if (currentUser) navigate("/");
    console.log(currentUser);
  }, [currentUser]);

  const formOnSubmit = async (data: LoginFormFields) => {
    try {
      loginFormSchema.parse(data);

      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((validationError) => {
          const { path, message } = validationError;
          setError(path[0] as keyof LoginFormFields, { message });
        });
      } else if (error instanceof FirebaseError)
        setError("root", {
          message: getAuthErrorStr(error as FirebaseError),
        });
    }
  };

  const writeUserDataWithProvider = (user: User | null) => {
    if (!user) throw new Error("Current user is undefined or null");
    getDoc(doc(firestore, "users", user.uid));
    if (user?.uid && user.displayName && user.email && user.photoURL)
      writeUserData(user.uid, user.displayName, user.email, user.photoURL);
  };
  const githubOnClick = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        // const token = credential.accessToken;

        // The signed-in user info.
        // const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        const user = auth.currentUser;
        writeUserDataWithProvider(user);

        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        console.log(errorMessage);
        setError("root", {
          message: getAuthErrorStr(error as FirebaseError),
        });
      });
  };
  const googleOnClick = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        // const token = credential.accessToken;
        // The signed-in user info.
        // const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        const user = auth.currentUser;
        writeUserDataWithProvider(user);

        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log(errorMessage);
        setError("root", {
          message: getAuthErrorStr(error as FirebaseError),
        });
      });
  };

  if (currentUser === null)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative flex flex-col rounded-md bg-white px-8 py-6 shadow-md">
          <form onSubmit={handleSubmit(formOnSubmit)} className="flex flex-col">
            <h2 className="text-1xl m-auto mb-4 flex font-bold text-black">
              Login
            </h2>
            {errors.root?.message && (
              <div className="m-auto mb-1 flex font-medium text-red-500">
                <span>{errors.root.message}</span>
              </div>
            )}
            <div className="mb-4">
              {errors.email?.message && (
                <div className="m-auto mb-1 flex font-medium text-red-500">
                  <span className="text-xs">{errors.email.message}</span>
                </div>
              )}
              <input
                {...register("email")}
                className={`w-full rounded border px-3 py-2 text-gray-700 placeholder-gray-500 ${errors.email?.message ? "border-red-500" : ""}`}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              {errors.password?.message && (
                <div className="m-auto mb-1 flex font-medium text-red-500">
                  <span className="text-xs">{errors.password.message}</span>
                </div>
              )}
              <input
                {...register("password")}
                className={`w-full rounded border px-3 py-2 text-gray-700 placeholder-gray-500 ${errors.email?.message ? "border-red-500" : ""}`}
                type="password"
                placeholder="Password"
              />
            </div>
            <button
              className="m-auto rounded-md bg-gradient-to-r from-cyan-400 to-pink-400 px-4 py-2 font-bold text-white shadow transition-all duration-100 hover:scale-105 hover:from-cyan-600 hover:to-pink-600 active:scale-95 active:from-cyan-700 active:to-pink-700"
              type="submit"
            >
              Login
            </button>
          </form>

          <div className="relative mt-4 flex ">
            <hr className="border-t-1 absolute top-1/2 w-64 border-solid border-gray-500"></hr>
            <p className="z-10 mx-auto w-8 bg-white text-center text-gray-500">
              OR
            </p>
          </div>

          <div className="mx-auto mt-3 flex h-8 flex-row gap-4">
            <button className="rounded-full transition-all duration-100 hover:scale-110  active:scale-95">
              <img
                onClick={googleOnClick}
                width={32}
                height={32}
                src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png"
                alt="Google icon"
              />
            </button>
            <button className="rounded-full transition-all duration-100 hover:scale-110 active:scale-95">
              <img
                onClick={githubOnClick}
                width={32}
                height={32}
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="GitHub icon"
              />
            </button>
          </div>
          <p className="m-auto mt-3 flex text-gray-800">
            You don't have an account?
            <Link to="/register" className="ml-1 cursor-pointer font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Login;
