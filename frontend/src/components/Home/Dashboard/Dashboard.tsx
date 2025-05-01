import { useState, useEffect } from "react";
import DashboardAlpha from "./DashboardAlpha";
import QuickBoxes from "./QuickBoxes";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Loader from "../../SignUp/Loader";
import HomeBg from "../HomeBg";

interface OutletContextType {
  isExpanded: boolean;
}

interface Count {
  workspaceCount: number;
  taskCount: number;
}

interface Task {
  workspaceId: string;
  workspaceName: string;
  name: string;
  description: string;
  deadline: Date;
  createdAt: Date;
}

const Dashboard = () => {
  const { isExpanded } = useOutletContext<OutletContextType>();
  const [count, setCount] = useState<Count>();
  const [taskInfo, setTaskInfo] = useState<Task[]>([]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/home/dashboard`,
        {},
        { withCredentials: true }
      );
      if (res.data.valid) {
        setCount(res.data.count);
        setTaskInfo(res.data.taskInfo);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <HomeBg />
      <div
        className={`relative transition-all duration-300 overflow-x-hidden ${
          isExpanded ? "lg:ml-64 lg:w-[calc(100%-16rem)]" : "w-full"
        } z-10`} // Ensure content stays above the background
      >
        <div>
          {count ? <DashboardAlpha {...count} /> : <Loader />}
          {taskInfo && taskInfo.length > 0 ? (
            <QuickBoxes taskInfo={taskInfo} />
          ) : (
            <p className="text-sm text-center text-white">No tasks assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
