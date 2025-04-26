import { useState } from "react";
import TaskCreateModal from "./TaskCreateModal";
import searchIcon from "../../../../assets/search.svg";
import plusIcon from "../../../../assets/plus.svg";
import userCircleIcon from "../../../../assets/userCircle.svg";
import refreshIcon from "../../../../assets/refresh.svg";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  showOnlyAssigned: boolean;
  setShowOnlyAssigned: (val: boolean) => void;
}

const TaskAlphaBoard = (props: Props) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const onClose = () => setIsCreateOpen(false);

  return (
    <div className="w-full px-4 md:px-0 mt-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Tasks
          </h1>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}{" "}
            <div className="relative">
              <img
                src={searchIcon}
                alt="Search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 mr-2"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 py-2 rounded-full bg-gray-800 text-white w-full"
              />
            </div>
            {/* Create */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md transition flex-shrink-0"
            >
              <img src={plusIcon} className="mr-1" />
              Create
            </button>
            {/* Pinned */}
            <button
              onClick={() => {
                props.setShowOnlyAssigned(!props.showOnlyAssigned);
              }}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md transition flex-shrink-0"
            >
              <img src={userCircleIcon} className="mr-1" />
              Assigned
            </button>
            {/* Refresh */}
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md transition flex-shrink-0"
            >
              <img src={refreshIcon} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskCreateModal isCreateOpen={isCreateOpen} onClose={onClose} />
    </div>
  );
};

export default TaskAlphaBoard;
