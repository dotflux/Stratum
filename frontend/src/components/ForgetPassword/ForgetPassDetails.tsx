import { useForm, SubmitHandler } from "react-hook-form";
import errorIcon from "../../assets/error.svg";
import axios from "axios";
import Loader from "../SignUp/Loader";
import { useNavigate } from "react-router-dom";

interface ForgetPassData {
  email: string;
}

const ForgetPassDetails = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPassData>();

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const onSubmit: SubmitHandler<ForgetPassData> = async (
    data: ForgetPassData
  ) => {
    try {
      await delay(5);
      const response = await axios.post(
        "http://localhost:3000/forgetpassword",
        data,
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.valid) {
        navigate(`/forgetpassword/otp?email=${data.email}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data;
        if (backendErrors) {
          setError(backendErrors.type as keyof ForgetPassData, {
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
          Reset Password
        </h2>

        <form
          className="flex flex-col space-y-4"
          method="post"
          noValidate
          action=""
          onSubmit={handleSubmit(onSubmit)}
        >
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
              placeholder="Enter Your Registered Email"
            />
            {errors.email && (
              <div className="flex justify-start items-start">
                <img src={errorIcon} alt="" />{" "}
                <h3 className="text-red-600">{String(errors.email.message)}</h3>
              </div>
            )}
          </div>
          <div>{isSubmitting && <Loader />}</div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-md transition shadow-lg"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassDetails;
