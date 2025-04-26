import { useState } from "react";
import axios from "axios";
import errorIcon from "../../../assets/error.svg";
import Loader from "../../SignUp/Loader";

interface ModalProps {
  isCreateOpen: boolean;
  onClose: () => void;
}

const CreateModal = ({ isCreateOpen, onClose }: ModalProps) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [defaultRole, setDefaultRole] = useState("Member");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  if (!isCreateOpen) return null;

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      workspaceName,
      description,
      usernames,
      defaultRole,
    };
    try {
      setSubmitting(true);
      await delay(5);
      const response = await axios.post(
        "http://localhost:3000/home/workspace/create",
        data,
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.valid) {
        setSubmitting(false);
        setWorkspaceName("");
        setDescription("");
        setUsernames([]);
        setDefaultRole("Member");
        onClose();
      }
    } catch (error) {
      setSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data;
        if (backendErrors) {
          setError(`${backendErrors.error}`);
        }

        console.log("Backend Error:", backendErrors);
      } else {
        console.log("Network Error:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() && !usernames.includes(inputValue.trim())) {
        setUsernames([...usernames, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && usernames.length) {
      setUsernames(usernames.slice(0, -1));
    }
  };

  const removeUser = (username: string) => {
    setUsernames(usernames.filter((user) => user !== username));
  };

  const removeModal = () => {
    setWorkspaceName("");
    setDescription("");
    setUsernames([]);
    setDefaultRole("Member");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-white mb-4">
          Create Workspace
        </h2>
        {/* Close Button */}
        <button
          onClick={removeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close Modal"
        >
          &#x2715;
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workspace Name */}
          <div>
            <label className="text-white block mb-1">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Pick a name for workspace (required)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              placeholder="Briefly describe this workspace... (Optional)"
            />
          </div>

          {/* Initial Members with Tagging System */}
          <div>
            <label className="text-white block mb-1">Initial Members</label>
            <div className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none flex flex-wrap gap-2">
              {usernames.map((username, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-600 px-2 py-1 rounded-lg text-sm"
                >
                  {username}
                  <button
                    type="button"
                    onClick={() => removeUser(username)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    &#x2715;
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Add usernames... (Optional,Press space or enter after typing)"
                className="bg-transparent outline-none flex-1 text-white"
              />
            </div>
          </div>

          {/* Default Role */}
          <div>
            <label className="text-white block mb-1">Default Role</label>
            <select
              value={defaultRole}
              onChange={(e) => setDefaultRole(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {error && (
            <div className="flex justify-start items-start">
              <img src={errorIcon} alt="" />{" "}
              <h3 className="text-red-600">{String(error)}</h3>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-md transition shadow-lg"
          >
            {isSubmitting ? <Loader /> : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
