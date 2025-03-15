import SignUpDetails from "./SignUpDetails";
import Pattern from "./SignupBg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
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
      if (response.data.valid) {
        navigate(`/signup/otp?email=${response.data.dummyMail}`);
      }
    } catch (error) {
      console.error("No ongoing registration detected");
    }
  };

  useEffect(() => {
    checkProcess();
  }, []);
  return (
    <div className="">
      <Pattern />

      <SignUpDetails />
    </div>
  );
};

export default SignUp;
