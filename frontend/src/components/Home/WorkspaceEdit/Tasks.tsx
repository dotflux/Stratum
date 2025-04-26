import { useState } from "react";
import TaskAlphaBoard from "./Tasks/TaskAlphaBoard";
import TaskBoxes from "./Tasks/TaskBoxes";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  isExpanded: boolean;
  workspaceInfo: {
    username: string;
  };
}
const Tasks = () => {
  const { isExpanded, workspaceInfo } = useOutletContext<OutletContext>();
  const [search, setSearch] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);
  return (
    <div
      className={`relative transition-all duration-300 ${
        isExpanded ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      }`}
    >
      <TaskAlphaBoard
        search={search}
        onSearchChange={(s) => setSearch(s)}
        showOnlyAssigned={showOnlyAssigned}
        setShowOnlyAssigned={setShowOnlyAssigned}
      />
      <TaskBoxes
        search={search}
        username={workspaceInfo?.username}
        showOnlyAssigned={showOnlyAssigned}
      />
    </div>
  );
};

export default Tasks;
