import { useState } from "react";
import axios from "axios";
import errorIcon from "../../../assets/error.svg";
import Loader from "../../SignUp/Loader";
import { useParams } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMemberModal = ({ isOpen, onClose }: ModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const { id } = useParams();

  if (!isOpen) return null;

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      await delay(5);
      const response = await axios.post(
        `http://localhost:3000/workspace/${id}/members/add`,
        { usernames },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.valid) {
        setSubmitting(false);
        setUsernames([]); // Clear usernames after successful submission
        onClose(); // Close modal after adding members
      }
    } catch (error) {
      setSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
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
    setUsernames([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-white mb-4">Add Members</h2>
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
          {/* Add Usernames with Tagging System */}
          <div>
            <label className="text-white block mb-1">Add Members</label>
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
                placeholder="Add usernames... (Press space or enter after typing one)"
                className="bg-transparent outline-none flex-1 text-white"
              />
            </div>
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
            {isSubmitting ? <Loader /> : "Add Members"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
