import { Link } from "react-router-dom";

interface Task {
  workspaceId: string;
  workspaceName: string;
  name: string;
  description: string;
  deadline: Date;
  createdAt: Date;
}

interface Props {
  taskInfo: Task[];
}

const QuickBoxes: React.FC<Props> = ({ taskInfo }) => {
  return (
    <div className="px-4 md:px-0 mt-8 mb-12">
      {taskInfo.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {taskInfo.map((task, i) => {
              const createdAt = new Date(task.createdAt).getTime();
              const deadlineTime = new Date(task.deadline).getTime();
              const now = Date.now();
              const totalDuration = deadlineTime - createdAt;
              const timeLeft = deadlineTime - now;
              const percentRemaining = Math.max(
                0,
                Math.min(100, (timeLeft / totalDuration) * 100)
              );
              const isExpired = timeLeft <= 0;

              const totalSeconds = Math.max(Math.floor(timeLeft / 1000), 0);
              const days = Math.floor(totalSeconds / 86400);
              const hours = Math.floor((totalSeconds % 86400) / 3600);
              const minutes = Math.floor((totalSeconds % 3600) / 60);

              const shortDesc =
                task.description.length > 30
                  ? task.description.slice(0, 30) + "..."
                  : task.description || "No description";

              const glowClass = isExpired
                ? "hover:shadow-[0_0_16px_4px_rgba(239,68,68,0.6)]"
                : "hover:shadow-[0_0_16px_4px_rgba(34,197,94,0.6)]";

              return (
                <Link
                  to={`/workspace/${task.workspaceId}/tasks`}
                  key={i}
                  className="block"
                >
                  <div
                    className={`
                      border border-gray-700 rounded-lg p-6
                      bg-gradient-to-br from-gray-800 to-gray-900 text-white
                      shadow-lg transform transition duration-300
                      hover:scale-105 ${glowClass}
                    `}
                  >
                    {/* Header row: Task + Workspace */}
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-extrabold text-xl">{task.name}</h2>
                      <span className="text-sm text-gray-400">
                        {task.workspaceName}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 mb-4">{shortDesc}</p>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
                      <div
                        className="h-4 origin-left transform transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500"
                        style={{
                          transform: `scaleX(${percentRemaining / 100})`,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-gray-400">
                      {isExpired
                        ? "Deadline passed"
                        : `${days}d ${hours}h ${minutes}m left`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-white text-center">No tasks found.</p>
      )}
    </div>
  );
};

export default QuickBoxes;
