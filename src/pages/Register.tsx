import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { db, getAuthErrorStr } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from "firebase/app";

const registerFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Min 8 characters" }).refine(data => /\d/.test(data) && /[a-zA-Z]/.test(data), {
    message: "At least one letter and one number",
  })
    .refine(data => /[^a-zA-Z\d]/.test(data), {
      message: "At least one special character",
    }),
  displayedName: z.string().min(1, { message: "Displayed name is required" }).max(30, { message: "Max 30 characters" }),
});

type RegisterFormFields = z.infer<typeof registerFormSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { currentUser } = useContext(AuthContext);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormFields>({ resolver: zodResolver(registerFormSchema) });

  const setRandomAvatarUrl = () => {
    setAvatarUrl(
      `https://robohash.org/${Math.trunc(Math.random() * 10000)}?size=256x256`
    );
  };

  const writeUserData = async (
    userId: string,
    name: string,
    email: string,
    imageUrl: string
  ) => {
    await set(ref(db, "users/" + userId), {
      userId: userId,
      displayedName: name,
      email: email,
      imageUrl: imageUrl,
    });
  };

  const registrateUser = async ({
    email,
    password,
    displayedName,
  }: RegisterFormFields) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await writeUserData(user.uid, displayedName, email, avatarUrl);

      navigate("/");
    } catch (error: any) {
      if (error instanceof FirebaseError)
        setError("root", {
          message: getAuthErrorStr(error as FirebaseError),
        });
    }
  };

  const formOnSubmit = async (data: RegisterFormFields) => {
    try {
      registerFormSchema.parse(data);

      registrateUser(data);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((validationError) => {
          const { path, message } = validationError;
          setError(path[0] as keyof RegisterFormFields, { message });
        });
      }
    }
  };

  useEffect(() => {
    setRandomAvatarUrl();
  }, []);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  if (currentUser === null)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col bg-white px-8 py-6 shadow-md rounded-md">
          <form onSubmit={handleSubmit(formOnSubmit)} className="flex flex-col">
            <h2 className="text-1xl font-bold mb-4 text-black flex m-auto">
              Register
            </h2>
            {errors.root?.message && (
              <div className="flex m-auto text-red-500 mb-1 font-medium">
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="mb-4">
              {errors.displayedName?.message && (
                <div className="flex m-auto text-red-500 mb-1 font-medium">
                  <span className="text-xs">{errors.displayedName.message}</span>
                </div>
              )}
              <input
                {...register("displayedName")}
                className={`border rounded w-full py-2 px-3 text-gray-700 placeholder-gray-500 ${errors.displayedName && "border-red-500"}`}
                type="text"
                placeholder="Displayed name"
              />
            </div>
            <div className="mb-4">
              {errors.email?.message && (
                <div className="flex m-auto text-red-500 mb-1 font-medium">
                  <span className="text-xs">{errors.email.message}</span>
                </div>
              )}
              <input
                {...register("email")}
                className={`border rounded w-full py-2 px-3 text-gray-700 placeholder-gray-500 ${errors.email && "border-red-500"}`}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-2">
              {errors.password?.message && (
                <div className="flex m-auto text-red-500 mb-1 font-medium">
                  <span className="text-xs">{errors.password.message}</span>
                </div>
              )}
              <input
                {...register("password")}
                className={`border rounded w-full py-2 px-3  text-gray-700 placeholder-gray-500 ${errors.password && "border-red-500"}`}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="flex flex-col mb-4">
              <button
                className="w-32 h-32 mx-auto rounded-xl"
                type="button"
                onClick={setRandomAvatarUrl}
              >
                <img className="w-32 h-32 bg-white" src={avatarUrl ? avatarUrl : "#"} alt="Random avatar" key={avatarUrl}/>
              </button>

              <p className="flex m-auto text-gray-600 text-xs">
                Click the avatar to re-generate it
              </p>
            </div>
            <button
              className="shadow transition-colors duration-1000 bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-bold py-2 px-4 rounded-md hover:from-cyan-600 hover:to-pink-600 active:from-cyan-700 active:to-pink-700 m-auto"
              type="submit"
            >
              Register
            </button>
          </form>
          <p className="flex m-auto text-gray-800 mt-3">
            You do have an account?
            <Link to="/login" className="font-medium cursor-pointer ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Register;
