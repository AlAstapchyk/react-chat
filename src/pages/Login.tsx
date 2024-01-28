import {
  GithubAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, getAuthErrorStr } from "../firebase";
import { useContext, useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { z, ZodError } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";

const loginFormSchema = z.object({
  email: z.string().min(1, { message: "Enter the email" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Enter the password" }),
});

type LoginFormFields = z.infer<typeof loginFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormFields>({ resolver: zodResolver(loginFormSchema) });

  useEffect(() => {
    if (currentUser) navigate("/");
    console.log(currentUser)
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
      }
      else if (error instanceof FirebaseError)
        setError("root", {
          message: getAuthErrorStr(error as FirebaseError),
        });
    }
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
      <div className="flex justify-center items-center h-screen">
        <div className="flex relative flex-col bg-white px-8 py-6 shadow-md rounded-md">
          <form onSubmit={handleSubmit(formOnSubmit)} className="flex flex-col">
            <h2 className="text-1xl font-bold mb-4 text-black flex m-auto">
              Login
            </h2>
            {errors.root?.message && (
              <div className="flex m-auto text-red-500 mb-1 font-medium">
                <span>{errors.root.message}</span>
              </div>
            )}
            <div className="mb-4">
              {errors.email?.message && (
                <div className="flex m-auto text-red-500 mb-1 font-medium">
                  <span className="text-xs">{errors.email.message}</span>
                </div>
              )}
              <input
                {...register("email")}
                className={`border rounded w-full py-2 px-3 text-gray-700 placeholder-gray-500 ${errors.email?.message ? "border-red-500" : ""}`}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              {errors.password?.message && (
                <div className="flex m-auto text-red-500 mb-1 font-medium">
                  <span className="text-xs">{errors.password.message}</span>
                </div>
              )}
              <input
                {...register("password")}
                className={`border rounded w-full py-2 px-3 text-gray-700 placeholder-gray-500 ${errors.email?.message ? "border-red-500" : ""}`}
                type="password"
                placeholder="Password"
              />
            </div>
            <button
              className="shadow transition-colors duration-1000 bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-bold py-2 px-4 rounded-md hover:from-cyan-600 hover:to-pink-600 active:from-cyan-700 active:to-pink-700 m-auto"
              type="submit"
            >
              Login
            </button>
          </form>

          <div className="flex relative mt-4">
            <hr className="absolute top-1/2 border-t-1 border-solid border-gray-500 w-64"></hr>
            <p className="z-10 text-gray-500 mx-auto bg-white w-8 text-center">
              OR
            </p>
          </div>

          <div className="flex flex-row gap-4 mt-3 mx-auto h-8">
            <button className="rounded-full">
              <img
                onClick={googleOnClick}
                width={32}
                height={32}
                src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png"
                alt="Google icon"
              />
            </button>
            <button className="rounded-full">
              <img
                onClick={githubOnClick}
                width={32}
                height={32}
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="GitHub icon"
              />
            </button>
          </div>
          <p className="flex m-auto text-gray-800 mt-3">
            You don't have an account?
            <Link to="/register" className="font-medium cursor-pointer ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Login;
