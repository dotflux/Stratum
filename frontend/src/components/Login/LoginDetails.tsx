import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import errorIcon from "../../assets/error.svg";
import axios from "axios";
import Loader from "../SignUp/Loader";
import showIcon from "../../assets/show.svg";
import hideIcon from "../../assets/hide.svg";
import { useNavigate, Link } from "react-router-dom";

interface LoginData {
  identifier: string;
  password: string;
}

const LoginDetails = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmit: SubmitHandler<LoginData> = async (data: LoginData) => {
    try {
      await delay(5);
      const response = await axios.post("http://localhost:3000/login", data, {
        withCredentials: true, // Equivalent to `credentials: "include"`
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.valid) {
        navigate(`/home`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data;
        if (backendErrors) {
          setError(backendErrors.type as keyof LoginData, {
            type: "server",
            message: backendErrors.error,
          });
        }

        console.log("Backend Error:", backendErrors);
      } else {
        console.log("Network Error:", error);
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[#0a0a0a]">
      <div className="relative w-full max-w-xl bg-white/10 md:bg-white/15  sm:backdrop-blur-xl backdrop-blur-none rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex space-x-2 mb-6">
          <span className="h-3 w-3 bg-red-500/50 rounded-full"></span>
          <span className="h-3 w-3 bg-yellow-500/50 rounded-full"></span>
          <span className="h-3 w-3 bg-green-500/50 rounded-full"></span>
        </div>

        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          Login To Account
        </h2>

        <form
          className="flex flex-col space-y-4"
          method="post"
          noValidate
          action=""
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="text-white/80 block mb-1 text-sm">
              Email or Username
            </label>
            <input
              type="text"
              {...register("identifier", {
                required: { value: true, message: "This field is required" },
              })}
              className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
              placeholder="Enter Your Email or Username"
            />
            {errors.identifier && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">
                  {String(errors.identifier.message)}
                </h3>
              </div>
            )}
          </div>

          <div>
            <label className="text-white/80 block mb-1 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: { value: true, message: "This field is required" },
                })}
                className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
                placeholder="Enter Your Password"
              />

              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <img src={showIcon} alt="" />
                ) : (
                  <img src={hideIcon} alt="" />
                )}
              </div>
            </div>

            {errors.password && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">
                  {String(errors.password.message)}
                </h3>
              </div>
            )}
          </div>
          <div>{isSubmitting && <Loader />}</div>
          <div className="flex justify-start z-10 relative space-x-2 mb-4">
            <h3 className="text-white">Don't have an account?</h3>{" "}
            <Link to="/signup" className="text-blue-300">
              Register
            </Link>
          </div>
          <div className="flex justify-start z-10 relative space-x-2 mb-4">
            <h3 className="text-white">Forgot your password?</h3>{" "}
            <Link to="/forgetpassword" className="text-blue-300">
              Reset
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-md transition shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDetails;
