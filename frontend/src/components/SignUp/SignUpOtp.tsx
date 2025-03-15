import { useEffect } from "react";
import SignUpBG from "./SignupBg";
import Loader from "./Loader";
import errorIcon from "../../assets/error.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface OtpData {
  otp: string;
}

const SignUpOtp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpData>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = decodeURIComponent(queryParams.get("email") || "");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, []);

  const checkProcess = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/signup/authTk",
        {},
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.valid) {
        navigate(`/signup`);
      }
    } catch (error) {
      console.error("Unauthorized Access");

      // Navigate if the request fails (e.g., 401 Unauthorized)
      navigate(`/signup`);
    }
  };

  useEffect(() => {
    checkProcess();
  }, []);

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmit: SubmitHandler<OtpData> = async (data: OtpData) => {
    try {
      const responseData = {
        otp: data.otp,
        email: email,
      };
      await delay(5);
      const response = await axios.post(
        "http://localhost:3000/signup/otp",
        responseData,
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data.error;
        setError("otp", {
          type: "server",
          message: backendErrors,
        });
        console.log("Backend Error:", backendErrors);
      } else {
        console.log("Network Error:", error);
      }
    }
  };
  return (
    <div>
      <SignUpBG />
      <div className="flex justify-center items-center min-h-screen px-4 bg-[#0a0a0a]">
        <div className="relative w-full max-w-xl bg-white/10 md:bg-white/15  sm:backdrop-blur-xl backdrop-blur-none rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex space-x-2 mb-6">
            <span className="h-3 w-3 bg-red-500/50 rounded-full"></span>
            <span className="h-3 w-3 bg-yellow-500/50 rounded-full"></span>
            <span className="h-3 w-3 bg-green-500/50 rounded-full"></span>
          </div>

          <h2 className="text-2xl font-semibold text-white text-center mb-4">
            Submit OTP
          </h2>

          <form
            className="flex flex-col space-y-4"
            method="post"
            noValidate
            action=""
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="text-white/80 block mb-1 text-sm">OTP</label>
              <input
                type="text"
                {...register("otp", {
                  required: { value: true, message: "This field is required" },
                  minLength: {
                    value: 6,
                    message: "The otp must be minimum 6 letters",
                  },
                  maxLength: {
                    value: 6,
                    message: "The otp exceeds the limit of 6 letters",
                  },
                })}
                className="w-full p-3 bg-white/20 text-white border border-white/30 rounded-md focus:ring-2 focus:ring-blue-400 outline-none placeholder-white/60"
                placeholder="Otp sent to mail"
              />
              {errors.otp && (
                <div className="flex justify-start items-start">
                  <img src={errorIcon} alt="" />{" "}
                  <h3 className="text-red-600">{String(errors.otp.message)}</h3>
                </div>
              )}
            </div>
            <div>{isSubmitting && <Loader />}</div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-md transition shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpOtp;
