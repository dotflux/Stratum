import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { Outlet } from "react-router-dom";

interface WorkspaceInfo {
  name: string;
  description: string;
  role: string;
  username: string;
  administrator: boolean;
}

const EditWorkspace = () => {
  const [workspaceInfo, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/workspace/${id}/auth`,
          {},
          {
            withCredentials: true,
          }
        );

        if (response.data.valid) {
          setWorkspace(response.data.workspace);
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
    <div className=" bg-gray-900 min-h-screen flex flex-col">
      {workspaceInfo ? (
        <div>
          <div>
            <WorkspaceSidebar
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              administrator={workspaceInfo?.administrator ?? false}
            />
          </div>
          <Outlet context={{ workspaceInfo, isExpanded }} />
        </div>
      ) : (
        "Loading.."
      )}
    </div>
  );
};

export default EditWorkspace;
