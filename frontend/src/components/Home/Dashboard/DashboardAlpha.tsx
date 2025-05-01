interface Props {
  workspaceCount: number;
  taskCount: number;
}

const DashboardAlpha = (props: Props) => {
  return (
    <div className="w-full px-4 md:px-0 mt-10 mb-4">
      <div className="relative max-w-5xl mx-auto bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white rounded-xl shadow-lg overflow-hidden">
        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* Placeholder area for stats, charts, etc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-start">
              <span className="text-sm text-gray-400">Total Workspaces</span>
              <span className="text-3xl font-bold mt-2">
                {props.workspaceCount}
              </span>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-start">
              <span className="text-sm text-gray-400">Your Assigned Tasks</span>
              <span className="text-3xl font-bold mt-2">{props.taskCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAlpha;
