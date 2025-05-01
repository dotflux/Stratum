import { useState } from "react";
import errorIcon from "../../../assets/error.svg";
import axios from "axios";
import Loader from "../../SignUp/Loader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = (props: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPass] = useState("");
  const [currentPassword, setCurrentPass] = useState("");

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:3000/home/account/password`,
        { newPassword, currentPassword },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setSubmitting(false);
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setError(`${err.response.data.message}`);
        setSubmitting(false);
      }
    }
  };

  if (!props.isOpen) return null;
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

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Change Password
          </h2>
          <p className="text-gray-400 mb-6">
            Enter your new password and current password
          </p>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1" htmlFor="newEmail">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimum 8 letters and maximum 12"
                value={newPassword}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPass(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          {error && (
            <div className="mt-3 flex items-center text-red-500">
              <img src={errorIcon} alt="Error" className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
          >
            {submitting ? <Loader /> : "Change"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
