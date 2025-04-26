import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import openSidebar from "../../../assets/openSidebar.svg";
import closeSidebar from "../../../assets/closeSidebar.svg";
import taskIcon from "../../../assets/code.svg";
import fileIcon from "../../../assets/folderOpen.svg";
import membersIcon from "../../../assets/userGroup.svg";
import settingsIcon from "../../../assets/cog.svg";
import logIcon from "../../../assets/edit.svg";
import exitIcon from "../../../assets/logout.svg";
import userLeave from "../../../assets/userRemove.svg";
import axios from "axios";
import LeaveConfirm from "./LeaveConfirm";

interface WorkspaceSidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  administrator: boolean;
}

const WorkspaceSidebar = ({
  isExpanded,
  setIsExpanded,
  administrator,
}: WorkspaceSidebarProps) => {
  const location = useLocation();
  const { id } = useParams();

  const menuItems = [
    { name: "Tasks", link: `/workspace/${id}/tasks`, icon: taskIcon },
    { name: "Files", link: `/workspace/${id}/files`, icon: fileIcon },
    { name: "Members", link: `/workspace/${id}/members`, icon: membersIcon },
    { name: "Log", link: `/workspace/${id}/log`, icon: logIcon },
    {
      name: "Settings",
      link: `/workspace/${id}/settings`,
      icon: settingsIcon,
      admin: true,
    },
  ];
  const navigate = useNavigate();

  const [leaveOpen, setLeaveOpen] = useState(false);

  const leaveWorkspace = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/leave`,
        {},
        { withCredentials: true }
      );
      if (res.data.valid) {
        setLeaveOpen(false);
        navigate("/home/workspaces");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  return (
    <>
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded-md shadow-md hover:bg-gray-800 transition"
        >
          <img src={openSidebar} alt="Open Sidebar" />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-gradient-to-b from-gray-950 to-gray-900 shadow-2xl transition-all duration-300 overflow-hidden
        ${isExpanded ? "w-full md:w-64" : "hidden"}`}
      >
        <div className="flex flex-col h-full px-4 py-6 space-y-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-md hover:bg-gray-800 transition"
            >
              <img src={closeSidebar} alt="Close Sidebar" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              if (item.admin && !administrator) return null; // skip admin items if not admin

              return (
                <div key={item.name}>
                  <Link
                    to={item.link}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all text-sm font-medium
          ${
            location.pathname === item.link
              ? "bg-blue-600 text-white shadow-md"
              : "hover:bg-gray-800 text-gray-300"
          }`}
                  >
                    <img src={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Exit and Leave */}
          <div className="pt-4 border-t border-gray-700">
            <button
              className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-red-700 hover:text-white rounded-md transition-all w-full"
              onClick={() => {
                navigate(`/home/workspaces`);
              }}
            >
              <img src={exitIcon} className="w-5 h-5" />
              <span>Exit</span>
            </button>
            <button
              className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-red-700 hover:text-white rounded-md transition-all w-full"
              onClick={() => {
                setLeaveOpen(true);
              }}
            >
              <img src={userLeave} className="w-5 h-5" />
              <span>Leave Workspace</span>
            </button>
          </div>
        </div>
      </aside>
      {leaveOpen && (
        <LeaveConfirm
          leaveOpen={leaveOpen}
          leaveWorkspace={leaveWorkspace}
          onClose={() => {
            setLeaveOpen(false);
          }}
        />
      )}
    </>
  );
};

export default WorkspaceSidebar;
