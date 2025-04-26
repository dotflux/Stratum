import { useState } from "react";
import errorIcon from "../../../assets/error.svg";

interface Props {
  confirmOpen: boolean;
  onClose: () => void;
  deleteWorkspace: (
    input: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  name: string;
}

const ConfirmDelModal = (props: Props) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (workspaceName !== props.name) {
      setError("The name does not match");
      return;
    }
    props.deleteWorkspace(workspaceName, setError);
    props.onClose();
  };

  if (!props.confirmOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close (X) Icon */}
        <button
          onClick={props.onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Delete Workspace</h2>
        <p className="text-gray-400 mb-6">
          Please type <span className="font-mono text-white">{props.name}</span>{" "}
          to confirm.
        </p>

        <input
          type="text"
          className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Workspace name"
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.target.value);
            if (error) setError("");
          }}
        />

        {error && (
          <div className="mt-2 flex items-center text-red-500">
            <img src={errorIcon} alt="Error" className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelModal;
