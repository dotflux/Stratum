import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import SignUpOtp from "./components/SignUp/SignUpOtp";
import ForgetPass from "./components/ForgetPassword/ForgetPass";
import Home from "./components/Home/Home";
import Dashboard from "./components/Home/Dashboard/Dashboard";
import Workspaces from "./components/Home/Workspaces/Workspaces";
import EditWorkspace from "./components/Home/WorkspaceEdit/EditWorkspace";
import MiddleWelcome from "./components/Home/WorkspaceEdit/MiddleWelcome";
import Tasks from "./components/Home/WorkspaceEdit/Tasks";
import WorkspaceFiles from "./components/Home/WorkspaceEdit/WorkspaceFiles";
import WorkspaceMembers from "./components/Home/WorkspaceEdit/WorkspaceMembers";
import WorkspaceLog from "./components/Home/WorkspaceEdit/WorkspaceLog";
import WorkspaceSettings from "./components/Home/WorkspaceEdit/WorkspaceSettings";
import Account from "./components/Home/Account/Account";
import Billing from "./components/Home/Billing/Billing";
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
      element: <Home />, // Protect all /home routes
      children: [
        { index: true, element: <Home /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "workspaces", element: <Workspaces /> },
        { path: "account", element: <Account /> },
        { path: "billing", element: <Billing /> },
      ],
    },
    {
      path: "/workspace/:id",
      element: <EditWorkspace />,
      children: [
        { index: true, element: <MiddleWelcome /> },
        { path: "tasks", element: <Tasks /> },
        { path: "files", element: <WorkspaceFiles /> },
        { path: "members", element: <WorkspaceMembers /> },
        { path: "log", element: <WorkspaceLog /> },
        { path: "settings", element: <WorkspaceSettings /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
