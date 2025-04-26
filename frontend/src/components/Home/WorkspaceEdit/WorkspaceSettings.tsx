import { useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmDelModal from "./ConfirmDelModal";
import DeletingModal from "./DeletingModal";

interface OutletContextType {
  isExpanded: boolean;
  workspaceInfo: {
    name: string;
    description: string;
    defaultRole: string;
    role: string;
    administrator: boolean;
  };
}

const WorkspaceSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isExpanded } = useOutletContext<OutletContextType>();
  const { workspaceInfo } = useOutletContext<OutletContextType>();

  // --- state + initial values for change detection ---
  const [name, setName] = useState(workspaceInfo?.name);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmDel] = useState(false);

  const [description, setDescription] = useState(workspaceInfo?.description);

  const defaultRole: string = workspaceInfo?.defaultRole;

  const [ownerUsername, setOwnerUsername] = useState("");

  const saveName = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/settings/name`,
        { name },
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
  const saveDescription = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/settings/description`,
        { description },
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
  const changeRole = async (role: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/settings/role`,
        { role },
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
  const transferOwner = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/settings/owner`,
        { ownerUsername },
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
  const deleteWorkspace = async (
    input: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      setDeleting(true);
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/settings/delete`,
        { input },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setDeleting(false);
        navigate("/home/workspaces");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setDeleting(false);
        setError("The name does not match");
      }
    }
  };

  return (
    <div
      className={`relative transition-all duration-300 ${
        isExpanded ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      } px-4 md:px-0 mt-8 mb-12`}
    >
      {workspaceInfo?.administrator ? (
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-white">Workspace Settings</h1>

          {/* Name */}
          <div className="space-y-2">
            <label className="block text-gray-300">Name</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name !== workspaceInfo?.name && (
              <button
                onClick={saveName}
                className={`px-4 py-2 rounded font-semibold transition bg-blue-700 text-white`}
              >
                Save Name
              </button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-gray-300">Description</label>
            <textarea
              className="w-full p-2 bg-gray-700 text-white rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
            />
            {description !== workspaceInfo?.description && (
              <button
                onClick={saveDescription}
                className={`px-4 py-2 rounded font-semibold transition 
              bg-blue-700 text-white`}
              >
                Save Description
              </button>
            )}
          </div>

          {/* Default Role */}
          <div className="space-y-2">
            <label className="block text-gray-300">Default Role</label>
            <select
              className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={defaultRole}
              onChange={(e) => changeRole(e.target.value)}
            >
              <option>Member</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Transfer Ownership */}
          {workspaceInfo?.role === "owner" && (
            <div className="space-y-2">
              <label className="block text-gray-300">Transfer Ownership</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="New owner's username"
                value={ownerUsername}
                onChange={(e) => setOwnerUsername(e.target.value)}
              />
              <button
                onClick={transferOwner}
                className={`px-4 py-2 rounded font-semibold transition bg-red-600 text-white`}
              >
                Confirm Transfer
              </button>
            </div>
          )}

          {/* Delete Workspace */}
          {workspaceInfo?.role === "owner" && (
            <div className="pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setConfirmDel(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition"
              >
                Delete Workspace
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400">This is for administrators</p>
      )}
      {confirmOpen && (
        <ConfirmDelModal
          confirmOpen={confirmOpen}
          onClose={() => {
            setConfirmDel(false);
          }}
          deleteWorkspace={deleteWorkspace}
          name={workspaceInfo?.name}
        />
      )}
      {deleting && <DeletingModal />}
    </div>
  );
};

export default WorkspaceSettings;
