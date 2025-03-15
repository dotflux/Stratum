import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import SignUpOtp from "./components/SignUp/SignUpOtp";
import ForgetPass from "./components/ForgetPassword/ForgetPass";
import Home from "./components/Home/Home";
import ForgetPassOtp from "./components/ForgetPassword/ForgetPassOtp";

function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/signup/otp",
      element: <SignUpOtp />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/forgetpassword",
      element: <ForgetPass />,
    },
    {
      path: "/forgetpassword/otp",
      element: <ForgetPassOtp />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
