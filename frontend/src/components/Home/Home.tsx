import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeBg from "./HomeBg";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

interface User {
  username: string;
  tenants: { id: string; role: string; joinedAt: Date }[];
}

// Create a context for the user
const UserContext = createContext<{ user: User | null } | undefined>(undefined);

// Custom hook for easier context usage in child components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within Home");
  return context;
};

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/home/auth",
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.valid) {
          setUser(response.data.user);
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user }}>
      <HomeBg />
      <div className="relative">
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>
      <Outlet context={{ isExpanded }} />
    </UserContext.Provider>
  );
};

export default Home;
