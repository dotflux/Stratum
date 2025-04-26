import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WorkinfoBoxes from "./WorkinfoBoxes";

interface Workspace {
  id: string;
  name: string;
  description: string;
  role: string;
  memberCount: number;
}

interface Props {
  search: string;
}

const WorkBoxes = (props: Props) => {
  const [userWorkspaces, setWorkspaces] = useState<Workspace[]>([]);
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/home/workspace/list",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.valid) {
        setWorkspaces(response.data.workspaces);
      }
    } catch {
      console.log("No workspaces available");
    }
  };
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const filtered = userWorkspaces.filter((ws) =>
    ws.name.toLowerCase().includes(props.search.toLowerCase())
  );
  return (
    <div className=" px-4 md:px-0 mt-8 mb-12">
      <div className="max-w-5xl mx-auto">
        {filtered.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => navigate(`/workspace/${workspace.id}`)}
              >
                <WorkinfoBoxes
                  name={workspace.name}
                  description={workspace.description}
                  role={workspace.role}
                  memberCount={workspace.memberCount}
                  id={workspace.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-white text-center mt-20">No Workspace Found</h1>
        )}
      </div>
    </div>
  );
};

export default WorkBoxes;
