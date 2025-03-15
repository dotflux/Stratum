import LoginBG from "./LoginBg";
import LoginDetails from "./LoginDetails";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const checkLogged = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/login/isLogged",
        {},
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.valid) {
        navigate(`/home`);
      }
    } catch (error) {
      console.error("No session detected");
    }
  };

  useEffect(() => {
    checkLogged();
  }, []);
  return (
    <div>
      <LoginBG />
      <LoginDetails />
    </div>
  );
};

export default Login;
