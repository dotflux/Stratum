import plusIcon from "../../../assets/plus.svg";
import removeUserIcon from "../../../assets/userRemove.svg";
import refreshIcon from "../../../assets/refresh.svg";
import searchIcon from "../../../assets/search.svg";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddMemberModal from "./AddMemberModal";

interface OutletContextType {
  isExpanded: boolean;
  workspaceInfo: {
    administrator: boolean;
    username: string;
  };
}

interface Members {
  username: string;
  role: string;
  tasks: number;
}

const WorkspaceMembers = () => {
  const { id } = useParams();
  const { isExpanded, workspaceInfo } = useOutletContext<OutletContextType>();
  const [members, setMembers] = useState<Members[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/members/list`,
        {},
        { withCredentials: true }
      );
      if (res.data.valid) {
        setMembers(res.data.members);
        setLoading(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
      setLoading(false);
    }
  };

  const removeUser = async (username: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/members/remove`,
        { username },
        { withCredentials: true }
      );
      if (res.data.valid) {
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const handleRoleChange = async (memberUser: string, newRole: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/members/changeRole`,
        { memberUser, newRole },
        { withCredentials: true }
      );
      if (res.data.valid) {
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);
  return (
    <div
      className={`relative transition-all duration-300 ${
        isExpanded ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      } px-4 md:px-0 mt-8 mb-12`}
    >
      <div className="relative px-4 md:px-0 mt-8 mb-12 max-w-5xl mx-auto">
        <h1 className="text-white text-2xl mb-4">Members</h1>

        {/* Top right buttons */}
        <div className="absolute top-0 right-0 flex gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-md"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <img src={plusIcon} className="w-5 h-5" alt="Add Member" />
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-800 p-2 rounded-full shadow-md"
            onClick={() => {
              window.location.reload();
            }}
          >
            <img src={refreshIcon} className="w-5 h-5" alt="Refresh" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-md max-w-md mt-2">
          <img src={searchIcon} alt="Search" className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search members..."
            className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
          />
        </div>

        {/* Members list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {loading ? (
            <p className="text-gray-400 mt-4 col-span-full">Loading...</p>
          ) : members ? (
            members.map((member, i) => (
              <div
                key={i}
                className="relative bg-[#1f2937] p-4 rounded-md shadow-md border border-gray-700 hover:border-blue-500 transition duration-200"
              >
                {/* Action buttons */}

                {workspaceInfo?.administrator &&
                  member.role !== "Owner" &&
                  member.username !== workspaceInfo?.username && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        className="p-1 hover:bg-gray-700 rounded"
                        onClick={() => {
                          removeUser(member.username);
                        }}
                      >
                        <img
                          src={removeUserIcon}
                          className="w-4 h-4"
                          alt="Remove User"
                        />
                      </button>
                    </div>
                  )}

                {/* Member info section */}
                <p className="text-white font-semibold text-lg truncate">
                  {member.username}
                </p>

                {workspaceInfo?.administrator &&
                member.role !== "Owner" &&
                workspaceInfo?.username !== member.username ? (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(member.username, e.target.value)
                    }
                    className="bg-gray-800 text-white text-sm px-2 py-1 rounded mt-1"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    Role: {member.role}
                  </p>
                )}

                <p className="text-gray-400 text-sm">
                  Tasks assigned: {member.tasks}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-4 col-span-full">
              No members found.
            </p>
          )}
        </div>
      </div>
      {isOpen && (
        <AddMemberModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      )}
      {}
    </div>
  );
};

export default WorkspaceMembers;
