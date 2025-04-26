import { Link, useLocation } from "react-router-dom";
import openSidebar from "../../assets/openSidebar.svg";
import closeSidebar from "../../assets/closeSidebar.svg";
import dashboardIcon from "../../assets/book.svg";
import workspaceIcon from "../../assets/briefcase.svg";
import accountIcon from "../../assets/userSettings.svg";
import billingIcon from "../../assets/cash.svg";
import logoutIcon from "../../assets/logout.svg";

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isExpanded, setIsExpanded }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", link: "/home/dashboard", icon: dashboardIcon },
    { name: "Workspaces", link: "/home/workspaces", icon: workspaceIcon },
    { name: "Account", link: "/home/account", icon: accountIcon },
    { name: "Billing", link: "/home/billing", icon: billingIcon },
  ];

  return (
    <>
      {/* Open Sidebar Button (Only Visible When Collapsed) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed top-4 left-4 z-50 bg-[#0f0f0f] p-2 rounded-md shadow-lg hover:bg-[#1a1a1a] transition"
        >
          <img src={openSidebar} alt="Open Sidebar" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bg-[#0d0d0d] text-white flex flex-col p-4 transition-all duration-300 z-50
          ${isExpanded ? "w-full h-full md:w-64 md:h-screen" : "hidden"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="self-end mb-4 focus:outline-none hover:bg-[#1a1a1a] rounded p-2 transition"
        >
          <img src={closeSidebar} alt="Close Sidebar" />
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`flex items-center gap-3 px-4 py-2 font-medium text-sm rounded-lg transition-all
                ${
                  location.pathname === item.link
                    ? "bg-violet-600 text-white shadow"
                    : "text-gray-300 hover:bg-[#1a1a1a]"
                }`}
            >
              <img src={item.icon} className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-[#1f1f1f]">
          <button className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-red-700 hover:text-white rounded-md transition w-full">
            <img src={logoutIcon} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
