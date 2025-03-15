import ForgetPassBG from "./ForgetPassBg";
import ForgetPassDetails from "./ForgetPassDetails";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPass = () => {
  const navigate = useNavigate();
  const checkProcess = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/forgetpassword/authTk",
        {},
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        navigate(`/forgetpassword/otp?email=${response.data.email}`);
      }
    } catch (error) {
      console.error("No ongoing reset process detected");
    }
  };

  useEffect(() => {
    checkProcess();
  }, []);
  return (
    <div>
      <ForgetPassBG />
      <ForgetPassDetails />
    </div>
  );
};

export default ForgetPass;
