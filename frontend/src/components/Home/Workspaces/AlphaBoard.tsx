import { useState } from "react";
import CreateModal from "./CreateModal";
import searchIcon from "../../../assets/search.svg";
import plusIcon from "../../../assets/plus.svg";
import refreshIcon from "../../../assets/refresh.svg";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
}

const AlphaBoard = (props: Props) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const onClose = () => setIsCreateOpen(false);

  return (
    <div className="w-full px-4 md:px-0 mt-10 mb-4">
      <div className="relative max-w-5xl mx-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white rounded-xl shadow-lg overflow-hidden">
        {/* soft glow accent */}
        <div className="relative overflow-hidden max-w-5xl mx-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white rounded-xl shadow-lg">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Workspaces</h1>

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
                  value={props.search}
                  placeholder="Search tasks..."
                  className="pl-10 py-2 rounded-full bg-gray-800 text-white w-full"
                  onChange={(e) => props.onSearchChange(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="
                flex items-center
                bg-indigo-600 hover:bg-indigo-500
                px-4 py-2
                rounded-full
                shadow
                transition
                flex-shrink-0
              "
              >
                <img src={plusIcon} className="mr-2" />
                Create
              </button>
              <button
                className="flex items-center bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full shadow transition flex-shrink-0"
                onClick={() => window.location.reload()}
              >
                <img src={refreshIcon} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateModal isCreateOpen={isCreateOpen} onClose={onClose} />
    </div>
  );
};

export default AlphaBoard;
