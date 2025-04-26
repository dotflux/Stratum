interface Props {
  leaveOpen: boolean;
  leaveWorkspace: () => void;
  onClose: () => void;
}

const LeaveConfirm = (props: Props) => {
  if (!props.leaveOpen) return null;
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

        <h2 className="text-2xl font-bold text-white mb-4">Leave Workspace</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to leave this workspce?
        </p>
        <div className="flex gap-2">
          <button
            onClick={props.onClose}
            className="mt-6 w-full bg-slate-400 hover:bg-slate-500 text-white py-2 rounded font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              props.leaveWorkspace();
            }}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirm;
