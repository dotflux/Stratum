import errorIcon from "../../../assets/error.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../SignUp/Loader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangeEmailModal = (props: Props) => {
  const [newEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const checkState = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/home/account/email/state`,
        {},
        { withCredentials: true }
      );
      if (res.data.valid) {
        setIsOtp(true);
      } else {
        setIsOtp(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:3000/home/account/email`,
        { newEmail, password },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setSubmitting(false);
        setEmail("");
        setPassword("");
        setError("");
        setIsOtp(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setSubmitting(false);
        setError(err.response.data.message);
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setOtpSubmitting(true);
      const res = await axios.post(
        `http://localhost:3000/home/account/email/otp`,
        { otp },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setOtpSubmitting(false);
        setOtp("");
        setError("");
        props.onClose();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setOtpSubmitting(false);
        setError(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    checkState();
  }, []);

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

        {!isOtp ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Change Email</h2>
            <p className="text-gray-400 mb-6">
              Enter your new email and current password.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  className="text-gray-400 text-sm mb-1"
                  htmlFor="newEmail"
                >
                  New Email
                </label>
                <input
                  id="newEmail"
                  type="email"
                  className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@gmail.com"
                  value={newEmail}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>

              <div className="flex flex-col">
                <label
                  className="text-gray-400 text-sm mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Change Email</h2>
            <p className="text-gray-400 mb-6">
              Enter your otp which is sent to new email.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  className="text-gray-400 text-sm mb-1"
                  htmlFor="newEmail"
                >
                  Enter otp
                </label>
                <input
                  id="otp"
                  type="text"
                  className="w-full p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (error) setError("");
                  }}
                  maxLength={6}
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
              onClick={handleOtpSubmit}
              disabled={otpSubmitting}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
            >
              {otpSubmitting ? <Loader /> : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailModal;
