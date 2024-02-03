import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { firestore, getAuthErrorStr } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";

const registerFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Min 8 characters" })
    .refine((data) => /\d/.test(data) && /[a-zA-Z]/.test(data), {
      message: "At least one letter and one number",
    })
    .refine((data) => /[^a-zA-Z\d]/.test(data), {
      message: "At least one special character",
    }),
  displayedName: z
    .string()
    .min(1, { message: "Displayed name is required" })
    .max(30, { message: "Max 30 characters" }),
});

type RegisterFormFields = z.infer<typeof registerFormSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isAvatarLoading, setIsAvatarLoading] = useState<boolean>();
  const [avatarLoadingErr, setAvatarLoadingErr] = useState<string>("");
  const { currentUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: zodResolver(registerFormSchema),
  });

  const fetchRandomAvatar = async () => {
    if (isAvatarLoading) {
      return;
    }
    setIsAvatarLoading(true);

    const randomId = Math.trunc(Math.random() * 10000);
    const url = `https://robohash.org/${randomId}?size=256x256`;

    setAvatarUrl("");
    setAvatarLoadingErr("");

    const img = new Image();

    img.onload = () => {
      setAvatarUrl(url);
      setIsAvatarLoading(false);
    };
    img.onerror = () => {
      setAvatarLoadingErr("Error loading the image");
      setIsAvatarLoading(false);
    };

    img.src = url;
  };

  const writeUserData = async (
    userId: string,
    name: string,
    email: string,
    imageUrl: string,
  ) => {
    const docRef = await addDoc(collection(firestore, "users"), {
      userId,
      displayedName: name,
      email,
      imageUrl,
    });
    console.log("Document written with ID: ", docRef.id);
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
        password,
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
    fetchRandomAvatar();
  }, []);

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  if (currentUser === null)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col rounded-md bg-white px-8 py-6 shadow-md">
          <form onSubmit={handleSubmit(formOnSubmit)} className="flex flex-col">
            <h2 className="text-1xl m-auto mb-4 flex font-bold text-black">
              Register
            </h2>
            {errors.root?.message && (
              <div className="m-auto mb-1 flex font-medium text-red-500">
                <span>{errors.root.message}</span>
              </div>
            )}

            <div className="mb-4">
              {errors.displayedName?.message && (
                <div className="m-auto mb-1 flex font-medium text-red-500">
                  <span className="text-xs">
                    {errors.displayedName.message}
                  </span>
                </div>
              )}
              <input
                {...register("displayedName")}
                className={`w-full rounded border px-3 py-2 text-gray-700 placeholder-gray-500 ${errors.displayedName && "border-red-500"}`}
                type="text"
                placeholder="Displayed name"
              />
            </div>
            <div className="mb-4">
              {errors.email?.message && (
                <div className="m-auto mb-1 flex font-medium text-red-500">
                  <span className="text-xs">{errors.email.message}</span>
                </div>
              )}
              <input
                {...register("email")}
                className={`w-full rounded border px-3 py-2 text-gray-700 placeholder-gray-500 ${errors.email && "border-red-500"}`}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-2">
              {errors.password?.message && (
                <div className="m-auto mb-1 flex font-medium text-red-500">
                  <span className="text-xs">{errors.password.message}</span>
                </div>
              )}
              <input
                {...register("password")}
                className={`w-full rounded border px-3 py-2  text-gray-700 placeholder-gray-500 ${errors.password && "border-red-500"}`}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="mb-4 flex flex-col">
              <button
                className="mx-auto h-32 w-32 rounded-xl"
                type="button"
                onClick={fetchRandomAvatar}
              >
                {avatarLoadingErr?.length !== 0 && (
                  <span className="text-red-500">{avatarLoadingErr}</span>
                )}
                {isAvatarLoading === true && (
                  <div
                    className="text-secondary inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-gray-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                )}
                {isAvatarLoading === false && avatarLoadingErr === "" && (
                  <img
                    className="h-32 w-32 bg-white transition-all duration-100 hover:scale-105 active:scale-95"
                    src={avatarUrl}
                    alt="Random avatar"
                    key={avatarUrl}
                  />
                )}
              </button>

              <p className="m-auto flex text-xs text-gray-600">
                Click the avatar to re-generate it
              </p>
            </div>
            <button
              className="m-auto rounded-md bg-gradient-to-r from-cyan-400 to-pink-400 px-4 py-2 font-bold text-white shadow transition-all duration-100 hover:scale-105 hover:from-cyan-600 hover:to-pink-600 active:scale-95 active:from-cyan-700 active:to-pink-700"
              type="submit"
            >
              Register
            </button>
          </form>
          <p className="m-auto mt-3 flex text-gray-800">
            You do have an account?
            <Link to="/login" className="ml-1 cursor-pointer font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
};

export default Register;
