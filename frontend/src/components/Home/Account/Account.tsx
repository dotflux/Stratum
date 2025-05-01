import { useState, useEffect } from "react";
import { useUser } from "../Home";
import { useOutletContext } from "react-router-dom";
import ChangeEmailModal from "./ChangeEmailModal";
import ChangePasswordModal from "./ChangePasswordModal";
import axios from "axios";
import HomeBg from "../HomeBg";

interface OutletContextType {
  isExpanded: boolean;
}

const Account = () => {
  const { isExpanded } = useOutletContext<OutletContextType>();
  const { user } = useUser(); // assume you have a setter to update user in context

  // --- new state for username editing ---
  const [name, setName] = useState<string>(user?.username || "");
  const [savingName, setSavingName] = useState(false);

  const [revealEmail, setRevealEmail] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // keep name in sync if user changes externally
  useEffect(() => {
    setName(user?.username || "");
  }, [user?.username]);

  const saveUsername = async () => {
    if (name === user?.username) return;
    try {
      setSavingName(true);
      const res = await axios.post(
        `http://localhost:3000/home/account/username`,
        { name },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setSavingName(false);
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
        setSavingName(false);
      }
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!domain) return "****";
    if (local.length <= 2) return "*".repeat(local.length) + "@" + domain;
    return (
      local[0] +
      "*".repeat(local.length - 2) +
      local[local.length - 1] +
      "@" +
      domain
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <HomeBg />

      <div
        className={`relative transition-all duration-300 overflow-x-hidden ${
          isExpanded ? "lg:ml-64 lg:w-[calc(100%-16rem)]" : "w-full"
        } z-10`}
      >
        <div className="w-full px-4 md:px-0 mt-10 mb-12">
          <div className="max-w-xl mx-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-8">
              <h1 className="text-2xl font-bold">Account Settings</h1>

              {/* Username Field */}
              <div className="space-y-1">
                <label className="block text-gray-400">Username</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={10}
                  />
                  {name !== user?.username && (
                    <button
                      onClick={saveUsername}
                      disabled={savingName}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow transition font-semibold disabled:opacity-50"
                    >
                      {savingName ? "Saving…" : "Save"}
                    </button>
                  )}
                </div>
              </div>

              {/* Email Field with Reveal */}
              <div className="space-y-1">
                <label className="block text-gray-400">Email</label>
                <div className="flex items-center">
                  <p className="flex-1 p-2 bg-gray-700 text-white rounded">
                    {revealEmail ? user?.email : maskEmail(user?.email || "")}
                  </p>
                  <button
                    onClick={() => setRevealEmail((v) => !v)}
                    className="ml-3 text-sm font-medium text-indigo-400 hover:underline"
                  >
                    {revealEmail ? "Hide" : "Reveal"}
                  </button>
                </div>
              </div>

              {/* Action Buttons Vertical */}
              <div className="space-y-4">
                <button
                  onClick={() => setEmailModalOpen(true)}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow transition font-semibold"
                >
                  Change Email
                </button>
                <button
                  onClick={() => setPassModalOpen(true)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-full shadow transition font-semibold"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ChangeEmailModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
        />
        <ChangePasswordModal
          isOpen={passModalOpen}
          onClose={() => setPassModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Account;
