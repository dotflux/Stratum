import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import errorIcon from "../../assets/error.svg";
import axios from "axios";
import Loader from "./Loader";
import showIcon from "../../assets/show.svg";
import hideIcon from "../../assets/hide.svg";
import { useNavigate, Link } from "react-router-dom";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface ServerError {
  type: string;
  error: string;
}

const SignUpDetails = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>();

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmit: SubmitHandler<SignUpData> = async (data: SignUpData) => {
    try {
      await delay(5);
      const response = await axios.post("http://localhost:3000/signup", data, {
        withCredentials: true, // Equivalent to `credentials: "include"`
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.valid) {
        navigate(`/signup/otp?email=${data.email}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data.errors;
        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((error: ServerError) => {
            setError(error.type as keyof SignUpData, {
              type: "server",
              message: error.error,
            });
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
          Create Account
        </h2>

        <form
          className="flex flex-col space-y-4"
          method="post"
          noValidate
          action=""
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="text-white/80 block mb-1 text-sm">Username</label>
            <input
              type="text"
              {...register("username", {
                required: { value: true, message: "This field is required" },
                minLength: {
                  value: 5,
                  message: "The username must be minimum 5 letters",
                },
                maxLength: {
                  value: 10,
                  message: "The username exceeds the limit of 10 letters",
                },
              })}
              className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
              placeholder="Minimum 5 Maximum 10 Characters"
            />
            {errors.username && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">
                  {String(errors.username.message)}
                </h3>
              </div>
            )}
          </div>

          <div>
            <label className="text-white/80 block mb-1 text-sm">Email</label>
            <input
              type="email"
              {...register("email", {
                required: { value: true, message: "This field is required" },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{String(errors.email.message)}</h3>
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
                  minLength: {
                    value: 8,
                    message: "The password must be minimum 8 letters",
                  },
                  maxLength: {
                    value: 12,
                    message: "The password exceeds the limit of 12 letters",
                  },
                })}
                className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
                placeholder="Minimum 8 Maximum 12 Characters"
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
            <h3 className="text-white">Already have an account?</h3>{" "}
            <Link to="/login" className="text-blue-300">
              Login Now
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-md transition shadow-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpDetails;
